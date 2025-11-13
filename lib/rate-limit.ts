import { NextRequest } from 'next/server';

interface RateLimitStore {
    [key: string]: {
        count: number;
        resetTime: number;
    };
}

const store: RateLimitStore = {};
const RATE_LIMIT_WINDOW = 60 * 1000;
const MAX_REQUESTS = 10;

export function rateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] || 
               request.headers.get('x-real-ip') || 
               'unknown';
    
    const now = Date.now();
    const key = `rate_limit_${ip}`;
    
    if (!store[key] || now > store[key].resetTime) {
        store[key] = {
            count: 1,
            resetTime: now + RATE_LIMIT_WINDOW
        };
        return { allowed: true, remaining: MAX_REQUESTS - 1 };
    }
    
    if (store[key].count >= MAX_REQUESTS) {
        return { allowed: false, remaining: 0 };
    }
    
    store[key].count++;
    return { allowed: true, remaining: MAX_REQUESTS - store[key].count };
}

export function validateOrigin(request: NextRequest): boolean {
    const origin = request.headers.get('origin');
    const referer = request.headers.get('referer');
    const host = request.headers.get('host');
    
    if (!origin && !referer) {
        return false;
    }
    
    const allowedOrigin = process.env.ALLOWED_ORIGIN || host;
    
    if (origin) {
        try {
            const originHost = new URL(origin).host;
            return originHost === allowedOrigin || originHost === host;
        } catch {
            return false;
        }
    }
    
    if (referer) {
        try {
            const refererHost = new URL(referer).host;
            return refererHost === allowedOrigin || refererHost === host;
        } catch {
            return false;
        }
    }
    
    return false;
}

