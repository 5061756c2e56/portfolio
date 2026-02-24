/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

import { randomUUID } from 'crypto';

import type Redis from 'ioredis';
import { getEmailCounter, getKVInstance, incrementEmailCounter } from '@/lib/db';
import { type EmailFormData } from '@/lib/email-validation';
import { sendEmailViaEmailJS } from '@/lib/email-sender';

const QUEUE_MAX_SIZE = 1000;
const MAX_RETRIES = 4;
const RETRY_BASE_DELAY_MS = 15_000;
const RETRY_MAX_DELAY_MS = 15 * 60 * 1000;
const EMAILJS_RATE_LIMIT_MS = 1100;
const DEAD_QUEUE_MAX_SIZE = 500;
const WORKER_LOCK_TTL_SECONDS = 30;

const QUEUE_PENDING_KEY = 'email_queue:pending';
const QUEUE_PROCESSING_KEY = 'email_queue:processing';
const QUEUE_DELAYED_KEY = 'email_queue:delayed';
const QUEUE_DEAD_KEY = 'email_queue:dead';
const QUEUE_WORKER_LOCK_KEY = 'email_queue:worker_lock';
const QUEUE_LAST_SENT_KEY = 'email_queue:last_sent';

type PipelineExecResult = Array<[unknown, unknown] | null> | null;

interface EmailQueueJob {
    id: string;
    createdAt: number;
    attempts: number;
    from_name: string;
    from_email: string;
    subject: string;
    message: string;
    sourceIp: string;
    userAgent: string;
    lastError?: string;
}

interface QueueState {
    pending: number;
    processing: number;
    delayed: number;
    nextDelayedAt: number | null;
}

interface InternalDrainResult extends DrainEmailQueueResult {
    nextRunInMs: number | null;
}

interface MemoryDelayedEntry {
    runAt: number;
    job: EmailQueueJob;
}

export interface EnqueueEmailResult {
    accepted: boolean;
    queueId?: string;
    position?: number;
    error?: string;
}

export interface DrainEmailQueueResult {
    processed: number;
    sent: number;
    retried: number;
    failed: number;
    pending: number;
}

const memoryPendingQueue: EmailQueueJob[] = [];
const memoryDelayedQueue: MemoryDelayedEntry[] = [];
const memoryDeadQueue: EmailQueueJob[] = [];
let memoryWorkerRunning = false;
let memoryLastSentAt = 0;
let scheduledDrainTimer: ReturnType<typeof setTimeout> | null = null;
let scheduledDrainAt: number | null = null;
let immediateKickInFlight = false;

function sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function buildQueueJob(data: EmailFormData, sourceIp: string, userAgent: string): EmailQueueJob {
    return {
        id: randomUUID(),
        createdAt: Date.now(),
        attempts: 0,
        from_name: data.from_name,
        from_email: data.from_email,
        subject: data.subject,
        message: data.message,
        sourceIp: sourceIp.slice(0, 128),
        userAgent: userAgent.slice(0, 300)
    };
}

function toQueuePayload(job: EmailQueueJob): string {
    return JSON.stringify(job);
}

function parseQueueJob(raw: string): EmailQueueJob | null {
    try {
        const value: unknown = JSON.parse(raw);
        if (typeof value !== 'object' || value === null) {
            return null;
        }

        const record = value as Record<string, unknown>;
        const from_name = typeof record.from_name === 'string' ? record.from_name : '';
        const from_email = typeof record.from_email === 'string' ? record.from_email : '';
        const subject = typeof record.subject === 'string' ? record.subject : '';
        const message = typeof record.message === 'string' ? record.message : '';

        if (!from_name || !subject || !message) {
            return null;
        }

        return {
            id: typeof record.id === 'string' ? record.id : randomUUID(),
            createdAt: typeof record.createdAt === 'number' ? record.createdAt : Date.now(),
            attempts: typeof record.attempts === 'number' ? Math.max(0, record.attempts) : 0,
            from_name,
            from_email,
            subject,
            message,
            sourceIp: typeof record.sourceIp === 'string' ? record.sourceIp : 'unknown',
            userAgent: typeof record.userAgent === 'string' ? record.userAgent : '',
            lastError: typeof record.lastError === 'string' ? record.lastError : undefined
        };
    } catch {
        return null;
    }
}

function toNumber(value: unknown): number {
    if (typeof value === 'number') {
        return Number.isFinite(value) ? value : 0;
    }
    if (typeof value === 'string') {
        const parsed = Number.parseInt(value, 10);
        return Number.isFinite(parsed) ? parsed : 0;
    }
    return 0;
}

function getPipelineValue(results: PipelineExecResult, index: number): unknown {
    const row = results?.[index];
    return row ? row[1] : null;
}

function extractNextDelayedAt(value: unknown): number | null {
    if (!Array.isArray(value) || value.length < 2) {
        return null;
    }

    const score = value[1];
    if (typeof score === 'number') {
        return Number.isFinite(score) ? score : null;
    }
    if (typeof score === 'string') {
        const parsed = Number.parseInt(score, 10);
        return Number.isFinite(parsed) ? parsed : null;
    }
    return null;
}

function getRetryDelayMs(nextAttempts: number): number {
    const attemptFactor = Math.max(0, nextAttempts - 1);
    return Math.min(RETRY_BASE_DELAY_MS * (
        2 ** attemptFactor
    ), RETRY_MAX_DELAY_MS);
}

function scheduleDrain(delayMs: number): void {
    const boundedDelay = Math.min(Math.max(delayMs, 200), 60_000);
    const targetAt = Date.now() + boundedDelay;

    if (scheduledDrainTimer && scheduledDrainAt !== null && scheduledDrainAt <= targetAt) {
        return;
    }

    if (scheduledDrainTimer) {
        clearTimeout(scheduledDrainTimer);
    }

    scheduledDrainAt = targetAt;
    scheduledDrainTimer = setTimeout(() => {
        scheduledDrainTimer = null;
        scheduledDrainAt = null;
        void drainEmailQueue();
    }, boundedDelay);
}

async function getRedisQueueState(redis: Redis): Promise<QueueState> {
    const pipeline = redis.pipeline();
    pipeline.llen(QUEUE_PENDING_KEY);
    pipeline.llen(QUEUE_PROCESSING_KEY);
    pipeline.zcard(QUEUE_DELAYED_KEY);
    pipeline.zrange(QUEUE_DELAYED_KEY, 0, 0, 'WITHSCORES');

    const results = (
        await pipeline.exec()
    ) as PipelineExecResult;

    return {
        pending: toNumber(getPipelineValue(results, 0)),
        processing: toNumber(getPipelineValue(results, 1)),
        delayed: toNumber(getPipelineValue(results, 2)),
        nextDelayedAt: extractNextDelayedAt(getPipelineValue(results, 3))
    };
}

async function waitForRedisSendCadence(redis: Redis): Promise<void> {
    const raw = await redis.get(QUEUE_LAST_SENT_KEY);
    if (!raw) {
        return;
    }

    const lastSentAt = Number.parseInt(raw, 10);
    if (!Number.isFinite(lastSentAt)) {
        return;
    }

    const elapsed = Date.now() - lastSentAt;
    if (elapsed < EMAILJS_RATE_LIMIT_MS) {
        await sleep(EMAILJS_RATE_LIMIT_MS - elapsed);
    }
}

async function markRedisSendCadence(redis: Redis): Promise<void> {
    await redis.set(QUEUE_LAST_SENT_KEY, Date.now().toString(), 'EX', 120);
}

async function tryAcquireRedisWorkerLock(redis: Redis, lockOwner: string): Promise<boolean> {
    const result = await redis.set(
        QUEUE_WORKER_LOCK_KEY,
        lockOwner,
        'EX',
        WORKER_LOCK_TTL_SECONDS,
        'NX'
    );
    return result === 'OK';
}

async function refreshRedisWorkerLock(redis: Redis, lockOwner: string): Promise<boolean> {
    const result = await redis.eval(
        'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("expire", KEYS[1], ARGV[2]) else return 0 end',
        1,
        QUEUE_WORKER_LOCK_KEY,
        lockOwner,
        WORKER_LOCK_TTL_SECONDS.toString()
    );
    return result === 1 || result === '1';
}

async function releaseRedisWorkerLock(redis: Redis, lockOwner: string): Promise<void> {
    await redis.eval(
        'if redis.call("get", KEYS[1]) == ARGV[1] then return redis.call("del", KEYS[1]) else return 0 end',
        1,
        QUEUE_WORKER_LOCK_KEY,
        lockOwner
    );
}

async function promoteDueRedisDelayed(redis: Redis, now: number): Promise<number> {
    const due = await redis.zrangebyscore(QUEUE_DELAYED_KEY, 0, now, 'LIMIT', 0, 200);
    if (due.length === 0) {
        return 0;
    }

    const pipeline = redis.pipeline();
    for (const raw of due) {
        pipeline.zrem(QUEUE_DELAYED_KEY, raw);
        pipeline.lpush(QUEUE_PENDING_KEY, raw);
    }
    await pipeline.exec();
    return due.length;
}

async function recoverRedisProcessingJobs(redis: Redis): Promise<void> {
    while (true) {
        const recovered = await redis.rpoplpush(QUEUE_PROCESSING_KEY, QUEUE_PENDING_KEY);
        if (!recovered) {
            return;
        }
    }
}

async function moveRedisJobToDeadQueue(redis: Redis, rawProcessingJob: string, job: EmailQueueJob, error: string): Promise<void> {
    const payload = JSON.stringify({
        ...job,
        lastError: error.slice(0, 400),
        failedAt: Date.now()
    });

    const pipeline = redis.pipeline();
    pipeline.lrem(QUEUE_PROCESSING_KEY, 1, rawProcessingJob);
    pipeline.lpush(QUEUE_DEAD_KEY, payload);
    pipeline.ltrim(QUEUE_DEAD_KEY, 0, DEAD_QUEUE_MAX_SIZE - 1);
    pipeline.expire(QUEUE_DEAD_KEY, 60 * 60 * 24 * 30);
    await pipeline.exec();
}

async function requeueRedisJob(redis: Redis, rawProcessingJob: string, job: EmailQueueJob, error: string): Promise<void> {
    const nextAttempts = job.attempts + 1;
    const retryAt = Date.now() + getRetryDelayMs(nextAttempts);
    const payload = JSON.stringify({
        ...job,
        attempts: nextAttempts,
        lastError: error.slice(0, 400)
    });

    const pipeline = redis.pipeline();
    pipeline.lrem(QUEUE_PROCESSING_KEY, 1, rawProcessingJob);
    pipeline.zadd(QUEUE_DELAYED_KEY, retryAt, payload);
    pipeline.expire(QUEUE_DELAYED_KEY, 60 * 60 * 24 * 7);
    await pipeline.exec();
}

async function drainRedisQueue(redis: Redis): Promise<InternalDrainResult> {
    const result: InternalDrainResult = {
        processed: 0,
        sent: 0,
        retried: 0,
        failed: 0,
        pending: 0,
        nextRunInMs: null
    };

    const lockOwner = randomUUID();
    const lockAcquired = await tryAcquireRedisWorkerLock(redis, lockOwner);
    if (!lockAcquired) {
        const state = await getRedisQueueState(redis);
        result.pending = state.pending + state.processing + state.delayed;
        result.nextRunInMs = result.pending > 0 ? 1500 : null;
        return result;
    }

    try {
        await recoverRedisProcessingJobs(redis);

        while (true) {
            const lockStillOwned = await refreshRedisWorkerLock(redis, lockOwner);
            if (!lockStillOwned) {
                break;
            }

            await promoteDueRedisDelayed(redis, Date.now());
            const rawJob = await redis.rpoplpush(QUEUE_PENDING_KEY, QUEUE_PROCESSING_KEY);

            if (!rawJob) {
                const state = await getRedisQueueState(redis);
                result.pending = state.pending + state.processing + state.delayed;
                if (state.nextDelayedAt && state.nextDelayedAt > Date.now()) {
                    result.nextRunInMs = state.nextDelayedAt - Date.now();
                }
                break;
            }

            const parsedJob = parseQueueJob(rawJob);
            if (!parsedJob) {
                await redis.lrem(QUEUE_PROCESSING_KEY, 1, rawJob);
                result.processed += 1;
                result.failed += 1;
                continue;
            }

            const counter = await getEmailCounter();
            if (counter.count >= 200) {
                await moveRedisJobToDeadQueue(redis, rawJob, parsedJob, 'Limite mensuelle atteinte');
                result.processed += 1;
                result.failed += 1;
                continue;
            }

            await waitForRedisSendCadence(redis);
            const sendResult = await sendEmailViaEmailJS({
                from_name: parsedJob.from_name,
                from_email: parsedJob.from_email,
                subject: parsedJob.subject,
                message: parsedJob.message
            });
            await markRedisSendCadence(redis);

            if (sendResult.success) {
                await redis.lrem(QUEUE_PROCESSING_KEY, 1, rawJob);
                await incrementEmailCounter();
                result.processed += 1;
                result.sent += 1;
                continue;
            }

            const errorMessage = sendResult.error ?? 'Erreur lors de l\'envoi de l\'email';
            const shouldRetry = sendResult.retryable && parsedJob.attempts < MAX_RETRIES;

            if (shouldRetry) {
                await requeueRedisJob(redis, rawJob, parsedJob, errorMessage);
                result.processed += 1;
                result.retried += 1;
            } else {
                await moveRedisJobToDeadQueue(redis, rawJob, parsedJob, errorMessage);
                result.processed += 1;
                result.failed += 1;
            }
        }
    } finally {
        try {
            await releaseRedisWorkerLock(redis, lockOwner);
        } catch {
        }
    }

    const finalState = await getRedisQueueState(redis);
    result.pending = finalState.pending + finalState.processing + finalState.delayed;
    if (result.pending > 0) {
        if (finalState.nextDelayedAt && finalState.nextDelayedAt > Date.now()) {
            result.nextRunInMs = finalState.nextDelayedAt - Date.now();
        } else {
            result.nextRunInMs = 400;
        }
    }

    return result;
}

function promoteDueMemoryDelayed(now: number): void {
    if (memoryDelayedQueue.length === 0) {
        return;
    }

    const keep: MemoryDelayedEntry[] = [];
    for (const entry of memoryDelayedQueue) {
        if (entry.runAt <= now) {
            memoryPendingQueue.unshift(entry.job);
        } else {
            keep.push(entry);
        }
    }

    keep.sort((a, b) => a.runAt - b.runAt);
    memoryDelayedQueue.length = 0;
    memoryDelayedQueue.push(...keep);
}

function getNextMemoryDelayedAt(): number | null {
    if (memoryDelayedQueue.length === 0) {
        return null;
    }
    return memoryDelayedQueue[0].runAt;
}

async function waitForMemorySendCadence(): Promise<void> {
    const elapsed = Date.now() - memoryLastSentAt;
    if (elapsed < EMAILJS_RATE_LIMIT_MS) {
        await sleep(EMAILJS_RATE_LIMIT_MS - elapsed);
    }
}

async function drainMemoryQueue(): Promise<InternalDrainResult> {
    const result: InternalDrainResult = {
        processed: 0,
        sent: 0,
        retried: 0,
        failed: 0,
        pending: 0,
        nextRunInMs: null
    };

    if (memoryWorkerRunning) {
        result.pending = memoryPendingQueue.length + memoryDelayedQueue.length;
        result.nextRunInMs = result.pending > 0 ? 1500 : null;
        return result;
    }

    memoryWorkerRunning = true;
    try {
        while (true) {
            promoteDueMemoryDelayed(Date.now());
            const job = memoryPendingQueue.pop();

            if (!job) {
                break;
            }

            const counter = await getEmailCounter();
            if (counter.count >= 200) {
                memoryDeadQueue.unshift({
                    ...job,
                    lastError: 'Limite mensuelle atteinte'
                });
                memoryDeadQueue.splice(DEAD_QUEUE_MAX_SIZE);
                result.processed += 1;
                result.failed += 1;
                continue;
            }

            await waitForMemorySendCadence();
            const sendResult = await sendEmailViaEmailJS({
                from_name: job.from_name,
                from_email: job.from_email,
                subject: job.subject,
                message: job.message
            });
            memoryLastSentAt = Date.now();

            if (sendResult.success) {
                await incrementEmailCounter();
                result.processed += 1;
                result.sent += 1;
                continue;
            }

            const errorMessage = (
                sendResult.error ?? 'Erreur lors de l\'envoi de l\'email'
            ).slice(0, 400);
            const shouldRetry = sendResult.retryable && job.attempts < MAX_RETRIES;

            if (shouldRetry) {
                const nextAttempts = job.attempts + 1;
                memoryDelayedQueue.push({
                    runAt: Date.now() + getRetryDelayMs(nextAttempts),
                    job: {
                        ...job,
                        attempts: nextAttempts,
                        lastError: errorMessage
                    }
                });
                memoryDelayedQueue.sort((a, b) => a.runAt - b.runAt);
                result.processed += 1;
                result.retried += 1;
            } else {
                memoryDeadQueue.unshift({
                    ...job,
                    lastError: errorMessage
                });
                memoryDeadQueue.splice(DEAD_QUEUE_MAX_SIZE);
                result.processed += 1;
                result.failed += 1;
            }
        }
    } finally {
        memoryWorkerRunning = false;
    }

    result.pending = memoryPendingQueue.length + memoryDelayedQueue.length;
    if (result.pending > 0) {
        const nextDelayedAt = getNextMemoryDelayedAt();
        if (nextDelayedAt && nextDelayedAt > Date.now()) {
            result.nextRunInMs = nextDelayedAt - Date.now();
        } else {
            result.nextRunInMs = 400;
        }
    }

    return result;
}

export function kickEmailQueueWorker(): void {
    if (immediateKickInFlight) {
        return;
    }

    immediateKickInFlight = true;
    void drainEmailQueue().finally(() => {
        immediateKickInFlight = false;
    });
}

export async function enqueueEmailJob(
    data: EmailFormData,
    metadata: { ip: string; userAgent?: string }
): Promise<EnqueueEmailResult> {
    const sourceIp = metadata.ip || 'unknown';
    const userAgent = metadata.userAgent || '';
    const job = buildQueueJob(data, sourceIp, userAgent);
    const payload = toQueuePayload(job);

    const { redis, hasRedis } = await getKVInstance();

    if (hasRedis && redis) {
        const queueState = await getRedisQueueState(redis);
        const queueSize = queueState.pending + queueState.processing + queueState.delayed;
        if (queueSize >= QUEUE_MAX_SIZE) {
            return {
                accepted: false,
                error: 'Service temporairement sature. Reessayez dans quelques instants.'
            };
        }

        const positionRaw = await redis.lpush(QUEUE_PENDING_KEY, payload);
        const position = toNumber(positionRaw);
        scheduleDrain(10);
        return {
            accepted: true,
            queueId: job.id,
            position: position > 0 ? position : 1
        };
    }

    const queueSize = memoryPendingQueue.length + memoryDelayedQueue.length;
    if (queueSize >= QUEUE_MAX_SIZE) {
        return {
            accepted: false,
            error: 'Service temporairement sature. Reessayez dans quelques instants.'
        };
    }

    memoryPendingQueue.unshift(job);
    scheduleDrain(10);
    return {
        accepted: true,
        queueId: job.id,
        position: memoryPendingQueue.length
    };
}

export async function drainEmailQueue(): Promise<DrainEmailQueueResult> {
    const { redis, hasRedis } = await getKVInstance();

    const result = hasRedis && redis
        ? await drainRedisQueue(redis)
        : await drainMemoryQueue();

    if (result.pending > 0) {
        scheduleDrain(result.nextRunInMs ?? 400);
    }

    return {
        processed: result.processed,
        sent: result.sent,
        retried: result.retried,
        failed: result.failed,
        pending: result.pending
    };
}
