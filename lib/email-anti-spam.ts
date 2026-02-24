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

import { createHash, randomUUID } from 'crypto';
import type Redis from 'ioredis';

import { getKVInstance } from '@/lib/db';
import { type EmailFormData } from '@/lib/email-validation';

const BURST_WINDOW_MS = 20_000;
const BURST_LIMIT = 2;
const IP_WINDOW_MS = 10 * 60 * 1000;
const IP_LIMIT = 8;
const EMAIL_WINDOW_MS = 60 * 60 * 1000;
const EMAIL_LIMIT = 4;
const DUPLICATE_TTL_SECONDS = 15 * 60;
const HEURISTIC_BLOCK_SCORE = 3;

const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local window = tonumber(ARGV[2])
local limit = tonumber(ARGV[3])
local member = ARGV[4]
local ttl = tonumber(ARGV[5])

redis.call('ZREMRANGEBYSCORE', key, 0, now - window)
local count = redis.call('ZCARD', key)
if count >= limit then
  return {0, count}
end

redis.call('ZADD', key, now, member)
redis.call('EXPIRE', key, ttl)
return {1, count + 1}
`;

interface AntiSpamInput {
    ip: string;
    data: EmailFormData;
    honeypot?: string;
}

interface AntiSpamResult {
    allowed: boolean;
    error?: string;
    retryAfterSeconds?: number;
}

type MemoryWindowStore = Record<string, number[]>;
type MemoryDuplicateStore = Record<string, number>;
type GlobalWithAntiSpamStore = typeof globalThis & {
    __emailSpamWindowStore?: MemoryWindowStore;
    __emailSpamDuplicateStore?: MemoryDuplicateStore;
};

function hashValue(value: string): string {
    return createHash('sha256').update(value).digest('hex').slice(0, 24);
}

function normalizeText(value: string): string {
    return value.toLowerCase().replace(/\s+/g, ' ').trim();
}

function buildFingerprint(data: EmailFormData): string {
    const normalized = [
        normalizeText(data.from_email || ''),
        normalizeText(data.subject),
        normalizeText(data.message)
    ].join('|');
    return hashValue(normalized);
}

function getStores(): { windows: MemoryWindowStore; duplicates: MemoryDuplicateStore } {
    const g = globalThis as GlobalWithAntiSpamStore;

    if (!g.__emailSpamWindowStore) {
        g.__emailSpamWindowStore = {};
    }

    if (!g.__emailSpamDuplicateStore) {
        g.__emailSpamDuplicateStore = {};
    }

    return {
        windows: g.__emailSpamWindowStore,
        duplicates: g.__emailSpamDuplicateStore
    };
}

function checkMemoryWindow(
    windows: MemoryWindowStore,
    key: string,
    now: number,
    windowMs: number,
    limit: number
): boolean {
    const existing = windows[key] ?? [];
    const minTs = now - windowMs;
    const kept = existing.filter(ts => ts > minTs);
    if (kept.length >= limit) {
        windows[key] = kept;
        return false;
    }
    kept.push(now);
    windows[key] = kept;
    return true;
}

function cleanupMemoryDuplicates(duplicates: MemoryDuplicateStore, now: number): void {
    for (const [key, expiresAt] of Object.entries(duplicates)) {
        if (expiresAt <= now) {
            delete duplicates[key];
        }
    }
}

function getHeuristicSpamScore(data: EmailFormData): number {
    const text = `${data.subject} ${data.message}`.toLowerCase();
    const urlCount = text.match(/https?:\/\/|www\./g)?.length ?? 0;
    const suspiciousWords = [
        'crypto',
        'bitcoin',
        'casino',
        'viagra',
        'forex',
        'telegram',
        'whatsapp',
        'backlink',
        'seo service',
        'loan',
        'betting',
        'adult'
    ];
    const hitWords = suspiciousWords.reduce((total, word) => (
        text.includes(word) ? total + 1 : total
    ), 0);
    const repeatedChars = /(.)\1{8,}/.test(text);
    let score = 0;

    if (urlCount >= 3) score += 2;
    if (urlCount >= 1 && hitWords >= 1) score += 2;
    if (hitWords >= 3) score += 2;
    if (data.message.length < 45 && urlCount >= 1) score += 1;
    if (repeatedChars) score += 1;

    return score;
}

function parseLuaAllowed(result: unknown): boolean {
    if (!Array.isArray(result) || result.length === 0) {
        return true;
    }

    const raw = result[0];
    if (typeof raw === 'number') {
        return raw === 1;
    }
    if (typeof raw === 'string') {
        return raw === '1';
    }
    return true;
}

async function checkRedisWindow(
    redis: Redis,
    key: string,
    now: number,
    windowMs: number,
    limit: number
): Promise<boolean> {
    const ttl = Math.max(1, Math.ceil(windowMs / 1000));
    const member = `${now}-${randomUUID()}`;
    const result = await redis.eval(
        SLIDING_WINDOW_LUA,
        1,
        key,
        now.toString(),
        windowMs.toString(),
        limit.toString(),
        member,
        ttl.toString()
    );

    return parseLuaAllowed(result);
}

export async function runEmailAntiSpamCheck(input: AntiSpamInput): Promise<AntiSpamResult> {
    if (typeof input.honeypot === 'string' && input.honeypot.trim() !== '') {
        return {
            allowed: false,
            error: 'Requete bloquee'
        };
    }

    if (getHeuristicSpamScore(input.data) >= HEURISTIC_BLOCK_SCORE) {
        return {
            allowed: false,
            error: 'Message refuse par la protection anti-spam'
        };
    }

    const now = Date.now();
    const ipHash = hashValue(input.ip || 'unknown');
    const normalizedEmail = normalizeText(input.data.from_email || '');
    const emailHash = normalizedEmail ? hashValue(normalizedEmail) : '';
    const fingerprint = buildFingerprint(input.data);

    const { redis, hasRedis } = await getKVInstance();

    if (hasRedis && redis) {
        const burstAllowed = await checkRedisWindow(
            redis,
            `email_spam:burst:${ipHash}`,
            now,
            BURST_WINDOW_MS,
            BURST_LIMIT
        );
        if (!burstAllowed) {
            return {
                allowed: false,
                error: 'Trop de tentatives, patientez quelques secondes',
                retryAfterSeconds: Math.ceil(BURST_WINDOW_MS / 1000)
            };
        }

        const ipAllowed = await checkRedisWindow(
            redis,
            `email_spam:ip:${ipHash}`,
            now,
            IP_WINDOW_MS,
            IP_LIMIT
        );
        if (!ipAllowed) {
            return {
                allowed: false,
                error: 'Trop de messages envoyes depuis cette adresse IP',
                retryAfterSeconds: Math.ceil(IP_WINDOW_MS / 1000)
            };
        }

        if (emailHash) {
            const emailAllowed = await checkRedisWindow(
                redis,
                `email_spam:email:${emailHash}`,
                now,
                EMAIL_WINDOW_MS,
                EMAIL_LIMIT
            );
            if (!emailAllowed) {
                return {
                    allowed: false,
                    error: 'Trop de messages envoyes depuis cet email',
                    retryAfterSeconds: Math.ceil(EMAIL_WINDOW_MS / 1000)
                };
            }
        }

        const duplicateKey = `email_spam:duplicate:${fingerprint}`;
        const duplicateSet = await redis.set(
            duplicateKey,
            now.toString(),
            'EX',
            DUPLICATE_TTL_SECONDS,
            'NX'
        );
        if (duplicateSet !== 'OK') {
            return {
                allowed: false,
                error: 'Message deja recu recemment',
                retryAfterSeconds: DUPLICATE_TTL_SECONDS
            };
        }

        return { allowed: true };
    }

    const { windows, duplicates } = getStores();
    cleanupMemoryDuplicates(duplicates, now);

    const burstAllowed = checkMemoryWindow(windows, `burst:${ipHash}`, now, BURST_WINDOW_MS, BURST_LIMIT);
    if (!burstAllowed) {
        return {
            allowed: false,
            error: 'Trop de tentatives, patientez quelques secondes',
            retryAfterSeconds: Math.ceil(BURST_WINDOW_MS / 1000)
        };
    }

    const ipAllowed = checkMemoryWindow(windows, `ip:${ipHash}`, now, IP_WINDOW_MS, IP_LIMIT);
    if (!ipAllowed) {
        return {
            allowed: false,
            error: 'Trop de messages envoyes depuis cette adresse IP',
            retryAfterSeconds: Math.ceil(IP_WINDOW_MS / 1000)
        };
    }

    if (emailHash) {
        const emailAllowed = checkMemoryWindow(windows, `email:${emailHash}`, now, EMAIL_WINDOW_MS, EMAIL_LIMIT);
        if (!emailAllowed) {
            return {
                allowed: false,
                error: 'Trop de messages envoyes depuis cet email',
                retryAfterSeconds: Math.ceil(EMAIL_WINDOW_MS / 1000)
            };
        }
    }

    const duplicateKey = `duplicate:${fingerprint}`;
    const duplicateExpiresAt = duplicates[duplicateKey];
    if (duplicateExpiresAt && duplicateExpiresAt > now) {
        return {
            allowed: false,
            error: 'Message deja recu recemment',
            retryAfterSeconds: Math.ceil((
                                             duplicateExpiresAt - now
                                         ) / 1000)
        };
    }

    duplicates[duplicateKey] = now + DUPLICATE_TTL_SECONDS * 1000;
    return { allowed: true };
}
