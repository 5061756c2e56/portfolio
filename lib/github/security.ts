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

import { NextRequest, NextResponse } from 'next/server';
import { getKVInstance } from '@/lib/db';
import { apiError } from '@/lib/github/errors';
import { getClientIP } from '@/lib/request-utils';

function getAllowedOrigins(): string[] {
    const envOrigins = process.env.ALLOWED_ORIGIN ?? process.env.ALLOWED_ORIGINS;

    if (envOrigins) {
        return envOrigins
            .split(',')
            .map(o => o.trim().toLowerCase())
            .filter(Boolean);
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
        try {
            const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
            const origin = url.origin.toLowerCase();
            const host = url.host.toLowerCase();
            return [origin, host, `www.${host}`];
        } catch {
            //
        }
    }

    if (process.env.NODE_ENV === 'production') {
        return ['https://paulviandier.com'];
    }

    return [
        'http://localhost:3000',
        'http://localhost:3001'
    ];
}

function isAllowedUrl(value: string | null, allowed: string[]): boolean {
    if (!value) return false;

    try {
        const url = new URL(value);
        const origin = url.origin.toLowerCase();
        const host = url.host.toLowerCase();

        return allowed.some((entry) => {
            const normalized = entry.toLowerCase().replace(/\/+$/, '');
            return (
                origin === normalized ||
                host === normalized ||
                host.endsWith(`.${normalized}`) ||
                origin.endsWith(`.${normalized}`)
            );
        });
    } catch {
        return false;
    }
}

const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;
const RATE_LIMIT_KEY_PREFIX = 'github_api_rate_limit:';

const memoryRateLimitStore: Record<string, { count: number; resetTime: number }> = {};

function checkRateLimitMemory(clientId: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = memoryRateLimitStore[clientId];

    if (!record || now > record.resetTime) {
        memoryRateLimitStore[clientId] = { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS };
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetIn: record.resetTime - now };
}

async function checkRateLimit(clientId: string): Promise<{ allowed: boolean; remaining: number; resetIn: number }> {
    const now = Date.now();
    const key = `${RATE_LIMIT_KEY_PREFIX}${clientId}`;

    try {
        const { redis, hasRedis } = await getKVInstance();

        if (hasRedis && redis) {
            const windowStart = now - RATE_LIMIT_WINDOW_MS;
            const pipeline = redis.pipeline();

            pipeline.zremrangebyscore(key, 0, windowStart);
            pipeline.zcard(key);
            pipeline.zadd(key, now, `${now}-${Math.random()}`);
            pipeline.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));

            const results = await pipeline.exec();

            if (results && results[1] && results[1][1] !== undefined) {
                const count = results[1][1] as number;

                if (count >= RATE_LIMIT_MAX_REQUESTS) {
                    const ttl = await redis.ttl(key);
                    return { allowed: false, remaining: 0, resetIn: ttl > 0 ? ttl * 1000 : RATE_LIMIT_WINDOW_MS };
                }

                return {
                    allowed: true,
                    remaining: Math.max(0, RATE_LIMIT_MAX_REQUESTS - count),
                    resetIn: RATE_LIMIT_WINDOW_MS
                };
            }
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[GitHub API Rate Limit] Redis error', error);
        }
    }

    return checkRateLimitMemory(clientId);
}

export interface SecurityCheckResult {
    allowed: boolean;
    response?: NextResponse;
    rateLimitRemaining?: number;
}

export async function validateRequest(request: NextRequest): Promise<SecurityCheckResult> {
    const clientId = getClientIP(request);
    const rateLimitResult = await checkRateLimit(clientId);

    if (!rateLimitResult.allowed) {
        const { payload, status } = apiError('RATE_LIMIT');
        return {
            allowed: false,
            response: NextResponse.json(payload, {
                status,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'X-RateLimit-Remaining': '0',
                    'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetIn / 1000)),
                    'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000))
                }
            })
        };
    }

    const allowedOrigins = getAllowedOrigins();
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    const isValidOrigin = isAllowedUrl(origin, allowedOrigins);
    const isValidReferer = isAllowedUrl(referer, allowedOrigins);

    if (process.env.NODE_ENV === 'production') {
        if (!isValidOrigin && !isValidReferer) {
            const { payload, status } = apiError('UNAUTHORIZED');
            return {
                allowed: false,
                response: NextResponse.json(payload, {
                    status,
                    headers: {
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'X-RateLimit-Remaining': String(rateLimitResult.remaining)
                    }
                })
            };
        }
    }

    return { allowed: true, rateLimitRemaining: rateLimitResult.remaining };
}

export function addSecurityHeaders(response: NextResponse, rateLimitRemaining?: number): NextResponse {
    response.headers.set('X-Content-Type-Options', 'nosniff');
    response.headers.set('X-Frame-Options', 'DENY');
    response.headers.set('X-XSS-Protection', '1; mode=block');
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
    response.headers.set('X-DNS-Prefetch-Control', 'off');
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
    response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

    if (rateLimitRemaining !== undefined) {
        response.headers.set('X-RateLimit-Remaining', String(rateLimitRemaining));
    }

    return response;
}

export interface SecurityCheckResultWithRemaining {
    rateLimitRemaining?: number;
}

export function createJsonResponse<T>(
    data: T,
    init: { status?: number; headers?: HeadersInit } = {},
    securityCheck?: SecurityCheckResultWithRemaining
): NextResponse {
    const { status = 200, headers } = init;
    const res = NextResponse.json(data, { status, headers });
    return addSecurityHeaders(res, securityCheck?.rateLimitRemaining);
}
