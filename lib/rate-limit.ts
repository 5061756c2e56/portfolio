import { NextRequest } from 'next/server';
import { getKVInstance } from '@/lib/db';
import { getClientIP } from '@/lib/request-utils';

const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 3;

export async function rateLimit(request: NextRequest): Promise<{ allowed: boolean; remaining: number }> {
    const ip = getClientIP(request);
    const now = Date.now();
    const key = `rate_limit:${ip}`;

    try {
        const { redis, hasRedis } = await getKVInstance();

        if (hasRedis && redis) {
            const windowStart = now - RATE_LIMIT_WINDOW;
            const pipeline = redis.pipeline();

            pipeline.zremrangebyscore(key, 0, windowStart);
            pipeline.zcard(key);
            pipeline.zadd(key, now, `${now}-${Math.random()}`);
            pipeline.expire(key, Math.ceil(RATE_LIMIT_WINDOW / 1000));

            const results = await pipeline.exec();

            if (results && results[1] && results[1][1]) {
                const count = results[1][1] as number;

                if (count >= MAX_REQUESTS) {
                    return { allowed: false, remaining: 0 };
                }

                return { allowed: true, remaining: MAX_REQUESTS - count - 1 };
            }
        }

        const fallbackKey = `rate_limit_memory_${ip}`;
        const memoryStore = (
                                global as any
                            ).__rateLimitStore || {};
        (
            global as any
        ).__rateLimitStore = memoryStore;

        if (!memoryStore[fallbackKey] || now > memoryStore[fallbackKey].resetTime) {
            memoryStore[fallbackKey] = {
                count: 1,
                resetTime: now + RATE_LIMIT_WINDOW
            };
            return { allowed: true, remaining: MAX_REQUESTS - 1 };
        }

        if (memoryStore[fallbackKey].count >= MAX_REQUESTS) {
            return { allowed: false, remaining: 0 };
        }

        memoryStore[fallbackKey].count++;
        return { allowed: true, remaining: MAX_REQUESTS - memoryStore[fallbackKey].count };
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Rate Limit] Error');
        }
        return { allowed: true, remaining: MAX_REQUESTS };
    }
}

function getAllowedOrigins(): string[] {
    const allowedOrigin = process.env.ALLOWED_ORIGIN;
    const origins: string[] = [];

    if (allowedOrigin) {
        origins.push(allowedOrigin.toLowerCase());
        if (!allowedOrigin.startsWith('http')) {
            origins.push(`https://${allowedOrigin.toLowerCase()}`);
            origins.push(`http://${allowedOrigin.toLowerCase()}`);
        }
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
        try {
            const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
            origins.push(url.host.toLowerCase());
            origins.push(url.origin.toLowerCase());
        } catch {
        }
    }

    return origins;
}

export function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

    const allowedOrigins = getAllowedOrigins();
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (isDevelopment && host && host.includes('localhost')) {
        return true;
    }

    if (!origin && !referer) {
        if (isDevelopment) return true;
        logSecurityEvent(request, 'missing_origin_referer');
        return false;
    }

    if (origin) {
        try {
            const originUrl = new URL(origin);
            const originHost = originUrl.host.toLowerCase();
            const originOrigin = originUrl.origin.toLowerCase();

            if (allowedOrigins.length > 0) {
                const isAllowed = allowedOrigins.some(allowed =>
                    originHost === allowed ||
                    originOrigin === allowed ||
                    originHost.endsWith(`.${allowed}`) ||
                    originOrigin.endsWith(`.${allowed}`)
                );

                if (!isAllowed) {
                    logSecurityEvent(request, 'invalid_origin', { origin: originHost });
                    return false;
                }
            } else if (host) {
                const hostLower = host.toLowerCase();
                const hostWithoutWww = hostLower.replace(/^www\./, '');
                const originWithoutWww = originHost.replace(/^www\./, '');

                if (originHost !== hostLower &&
                    originHost !== `www.${hostLower}` &&
                    originWithoutWww !== hostLower &&
                    originWithoutWww !== hostWithoutWww) {
                    logSecurityEvent(request, 'origin_host_mismatch', { origin: originHost, host });
                    return false;
                }
            }

            return true;
        } catch {
            logSecurityEvent(request, 'invalid_origin_format', { origin });
            return false;
        }
    }

    if (referer) {
        try {
            const refererUrl = new URL(referer);
            const refererHost = refererUrl.host.toLowerCase();
            const refererOrigin = refererUrl.origin.toLowerCase();

            if (allowedOrigins.length > 0) {
                const isAllowed = allowedOrigins.some(allowed =>
                    refererHost === allowed ||
                    refererOrigin === allowed ||
                    refererHost.endsWith(`.${allowed}`) ||
                    refererOrigin.endsWith(`.${allowed}`)
                );

                if (!isAllowed) {
                    logSecurityEvent(request, 'invalid_referer', { referer: refererHost });
                    return false;
                }
            } else if (host) {
                const hostLower = host.toLowerCase();
                const hostWithoutWww = hostLower.replace(/^www\./, '');
                const refererWithoutWww = refererHost.replace(/^www\./, '');

                if (refererHost !== hostLower &&
                    refererHost !== `www.${hostLower}` &&
                    refererWithoutWww !== hostLower &&
                    refererWithoutWww !== hostWithoutWww) {
                    logSecurityEvent(request, 'referer_host_mismatch', { referer: refererHost, host });
                    return false;
                }
            }

            return true;
        } catch {
            logSecurityEvent(request, 'invalid_referer_format', { referer });
            return false;
        }
    }

    return false;
}

function logSecurityEvent(request: NextRequest, event: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'production') {
        const ip = getClientIP(request);
        const timestamp = new Date().toISOString();
        const sanitizedData = data ? Object.fromEntries(
            Object.entries(data).map(([key, value]) => [
                key,
                typeof value === 'string' ? value.substring(0, 100) : value
            ])
        ) : {};
        console.warn(`[SECURITY] ${timestamp} - ${event} - IP: ${ip}`, sanitizedData);
    }
}

export function validateContentType(request: NextRequest, expectedType: string = 'application/json'): boolean {
    const contentType = request.headers.get('content-type');

    if (!contentType) {
        logSecurityEvent(request, 'missing_content_type');
        return false;
    }

    if (!contentType.includes(expectedType)) {
        logSecurityEvent(request, 'invalid_content_type', { contentType, expectedType });
        return false;
    }

    return true;
}