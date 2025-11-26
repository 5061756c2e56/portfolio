import {
    NextRequest,
    NextResponse
} from 'next/server';

const MAX_PAYLOAD_SIZE = 1024 * 10;
const API_SECRET = process.env.API_SECRET || '';
const ALLOWED_ORIGINS = getAllowedOrigins();

function getAllowedOrigins(): string[] {
    const origins: string[] = [];

    if (process.env.ALLOWED_ORIGIN) {
        const allowed = process.env.ALLOWED_ORIGIN.toLowerCase().trim();
        origins.push(allowed);
        if (!allowed.startsWith('http')) {
            origins.push(`https://${allowed}`);
            origins.push(`http://${allowed}`);
            const withoutWww = allowed.replace(/^www\./, '');
            if (withoutWww !== allowed) {
                origins.push(withoutWww);
                origins.push(`https://${withoutWww}`);
            } else {
                origins.push(`www.${allowed}`);
                origins.push(`https://www.${allowed}`);
            }
        }
    }

    if (process.env.NEXT_PUBLIC_SITE_URL) {
        try {
            const url = new URL(process.env.NEXT_PUBLIC_SITE_URL);
            const origin = url.origin.toLowerCase();
            const host = url.host.toLowerCase();
            origins.push(origin);
            origins.push(host);

            const hostWithoutWww = host.replace(/^www\./, '');
            if (hostWithoutWww !== host) {
                origins.push(hostWithoutWww);
                origins.push(`https://${hostWithoutWww}`);
            } else {
                origins.push(`www.${host}`);
                origins.push(`https://www.${host}`);
            }
        } catch {}
    }

    if (process.env.VERCEL_URL) {
        const vercelUrl = process.env.VERCEL_URL.toLowerCase().trim();
        origins.push(`https://${vercelUrl}`);
        origins.push(vercelUrl);
    }

    return [...new Set(origins)];
}

export function getSecurityHeaders(cacheControl?: string): Record<string, string> {
    const headers: Record<string, string> = {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=()'
    };

    if (cacheControl) {
        headers['Cache-Control'] = cacheControl;
    } else {
        headers['Cache-Control'] = 'no-store, no-cache, must-revalidate, max-age=0';
    }

    return headers;
}

export function validateApiSecret(request: NextRequest): boolean {
    if (!API_SECRET) {
        return false;
    }

    const authHeader = request.headers.get('authorization');
    const apiKeyHeader = request.headers.get('x-api-key');

    if (authHeader && authHeader.startsWith('Bearer ')) {
        const token = authHeader.substring(7);
        return constantTimeCompare(token, API_SECRET);
    }

    if (apiKeyHeader) {
        return constantTimeCompare(apiKeyHeader, API_SECRET);
    }

    return false;
}

function constantTimeCompare(a: string, b: string): boolean {
    if (a.length !== b.length) {
        return false;
    }

    let result = 0;
    for (let i = 0; i < a.length; i++) {
        result |= a.charCodeAt(i) ^ b.charCodeAt(i);
    }

    return result === 0;
}

export function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');

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

            if (ALLOWED_ORIGINS.length > 0) {
                const originHostWithoutWww = originHost.replace(/^www\./, '');
                const originOriginWithoutWww = originOrigin.replace(/^www\./, '');

                const isAllowed = ALLOWED_ORIGINS.some(allowed => {
                    const allowedHost = allowed.replace(/^https?:\/\//, '').replace(/^www\./, '');
                    const allowedOrigin = allowed.replace(/^www\./, '');

                    return originHost === allowed ||
                           originOrigin === allowed ||
                           originHostWithoutWww === allowedHost ||
                           originOriginWithoutWww === allowedOrigin ||
                           originHost === allowed.replace(/^https?:\/\//, '') ||
                           originHost.endsWith(`.${allowedHost}`) ||
                           originOrigin.endsWith(`.${allowedOrigin}`);
                });

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
                    logSecurityEvent(request, 'origin_host_mismatch', {
                        origin: originHost,
                        host
                    });
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

            if (ALLOWED_ORIGINS.length > 0) {
                const refererHostWithoutWww = refererHost.replace(/^www\./, '');
                const refererOriginWithoutWww = refererOrigin.replace(/^www\./, '');

                const isAllowed = ALLOWED_ORIGINS.some(allowed => {
                    const allowedHost = allowed.replace(/^https?:\/\//, '').replace(/^www\./, '');
                    const allowedOrigin = allowed.replace(/^www\./, '');

                    return refererHost === allowed ||
                           refererOrigin === allowed ||
                           refererHostWithoutWww === allowedHost ||
                           refererOriginWithoutWww === allowedOrigin ||
                           refererHost === allowed.replace(/^https?:\/\//, '') ||
                           refererHost.endsWith(`.${allowedHost}`) ||
                           refererOrigin.endsWith(`.${allowedOrigin}`);
                });

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
                    logSecurityEvent(request, 'referer_host_mismatch', {
                        referer: refererHost,
                        host
                    });
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

export function validateUserAgent(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent');

    if (!userAgent) {
        logSecurityEvent(request, 'missing_user_agent');
        return false;
    }

    const blockedPatterns = [
        'curl',
        'wget',
        'python-requests',
        'postman',
        'insomnia',
        'httpie',
        'go-http-client',
        'java/',
        'scrapy',
        'bot',
        'crawler',
        'spider'
    ];

    const lowerUA = userAgent.toLowerCase();
    const isBlocked = blockedPatterns.some(pattern => lowerUA.includes(pattern));

    if (isBlocked) {
        logSecurityEvent(request, 'blocked_user_agent', { userAgent });
        return false;
    }

    return true;
}

export function validateContentType(request: NextRequest, expectedType: string = 'application/json'): boolean {
    const contentType = request.headers.get('content-type');

    if (!contentType) {
        logSecurityEvent(request, 'missing_content_type');
        return false;
    }

    if (!contentType.includes(expectedType)) {
        logSecurityEvent(request, 'invalid_content_type', {
            contentType,
            expectedType
        });
        return false;
    }

    return true;
}

export function validatePayloadSize(request: NextRequest): boolean {
    const contentLength = request.headers.get('content-length');

    if (contentLength) {
        const size = parseInt(contentLength, 10);
        if (size > MAX_PAYLOAD_SIZE) {
            logSecurityEvent(request, 'payload_too_large', {
                size,
                max: MAX_PAYLOAD_SIZE
            });
            return false;
        }
    }

    return true;
}

export function getCorsHeaders(origin: string | null): Record<string, string> {
    const headers = getSecurityHeaders();

    if (origin && validateOriginHeader(origin)) {
        headers['Access-Control-Allow-Origin'] = origin;
        headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
        headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, X-API-Key';
        headers['Access-Control-Max-Age'] = '86400';
        headers['Access-Control-Allow-Credentials'] = 'false';
    }

    return headers;
}

function validateOriginHeader(origin: string): boolean {
    try {
        const originUrl = new URL(origin);
        const originHost = originUrl.host.toLowerCase();
        const originOrigin = originUrl.origin.toLowerCase();

        if (ALLOWED_ORIGINS.length > 0) {
            return ALLOWED_ORIGINS.some(allowed =>
                originHost === allowed ||
                originOrigin === allowed ||
                originHost.endsWith(`.${allowed}`) ||
                originOrigin.endsWith(`.${allowed}`)
            );
        }

        return true;
    } catch {
        return false;
    }
}

function getClientIP(request: NextRequest): string {
    const forwarded = request.headers.get('x-forwarded-for');
    const realIP = request.headers.get('x-real-ip');
    const cfConnectingIP = request.headers.get('cf-connecting-ip');

    if (cfConnectingIP) return cfConnectingIP;
    if (forwarded) return forwarded.split(',')[0].trim();
    if (realIP) return realIP;

    return 'unknown';
}

function logSecurityEvent(request: NextRequest, event: string, data?: Record<string, unknown>): void {
    const ip = getClientIP(request);
    const timestamp = new Date().toISOString();
    const userAgent = request.headers.get('user-agent') || 'unknown';
    const url = request.url;

    console.warn(`[SECURITY] ${timestamp} - ${event} - IP: ${ip} - URL: ${url} - UA: ${userAgent}`, data || {});
}

export function createSecurityResponse(
    message: string,
    status: number = 403,
    additionalHeaders: Record<string, string> = {}
): NextResponse {
    return NextResponse.json(
        { error: message },
        {
            status,
            headers: {
                ...getSecurityHeaders(),
                ...additionalHeaders
            }
        }
    );
}