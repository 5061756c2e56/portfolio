import { NextRequest, NextResponse } from 'next/server';

const ALLOWED_ORIGINS = [
    'https://paulviandier.com',
    'https://www.paulviandier.com',
    'http://localhost:3000',
    'http://localhost:3001'
];

const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 100;

function getClientIdentifier(request: NextRequest): string {
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) return cfConnectingIP;

    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();

    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;

    return 'unknown';
}

function checkRateLimit(clientId: string): { allowed: boolean; remaining: number; resetIn: number } {
    const now = Date.now();
    const record = rateLimitStore.get(clientId);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(clientId, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1, resetIn: RATE_LIMIT_WINDOW_MS };
    }

    if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
        return { allowed: false, remaining: 0, resetIn: record.resetTime - now };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - record.count, resetIn: record.resetTime - now };
}

export interface SecurityCheckResult {
    allowed: boolean;
    response?: NextResponse;
    rateLimitRemaining?: number;
}

export function validateRequest(request: NextRequest): SecurityCheckResult {
    const clientId = getClientIdentifier(request);
    const rateLimitResult = checkRateLimit(clientId);

    if (!rateLimitResult.allowed) {
        return {
            allowed: false,
            response: NextResponse.json(
                { error: 'Trop de requêtes', code: 'RATE_LIMIT' },
                {
                    status: 429,
                    headers: {
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': String(Math.ceil(rateLimitResult.resetIn / 1000)),
                        'Retry-After': String(Math.ceil(rateLimitResult.resetIn / 1000))
                    }
                }
            )
        };
    }

    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');

    const isValidOrigin = origin
        ? ALLOWED_ORIGINS.some(allowed => origin.startsWith(allowed))
        : false;

    const isValidReferer = referer
        ? ALLOWED_ORIGINS.some(allowed => referer.startsWith(allowed))
        : false;

    if (process.env.NODE_ENV === 'production') {
        if (!isValidOrigin && !isValidReferer) {
            return {
                allowed: false,
                response: NextResponse.json(
                    { error: 'Accès non autorisé', code: 'UNAUTHORIZED' },
                    {
                        status: 403,
                        headers: {
                            'X-Content-Type-Options': 'nosniff',
                            'X-Frame-Options': 'DENY',
                            'X-RateLimit-Remaining': String(rateLimitResult.remaining)
                        }
                    }
                )
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
