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
const CLEANUP_INTERVAL = 5 * 60 * 1000;

if (typeof setInterval !== 'undefined') {
    setInterval(() => {
        const now = Date.now();
        Object.keys(store).forEach(key => {
            if (now > store[key].resetTime) {
                delete store[key];
            }
        });
    }, CLEANUP_INTERVAL);
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

export function rateLimit(request: NextRequest): { allowed: boolean; remaining: number } {
    const ip = getClientIP(request);
    
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
        'scrapy'
    ];
    
    const lowerUA = userAgent.toLowerCase();
    const isBlocked = blockedPatterns.some(pattern => lowerUA.includes(pattern));
    
    if (isBlocked) {
        logSecurityEvent(request, 'blocked_user_agent', { userAgent });
        return false;
    }
    
    return true;
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

export function isServerSideRequest(request: NextRequest): boolean {
    const userAgent = request.headers.get('user-agent') || '';
    const isServerUA = !userAgent || userAgent.includes('node') || userAgent.includes('Next.js');
    
    const forwardedFor = request.headers.get('x-forwarded-for');
    const isInternalIP = forwardedFor === '127.0.0.1' || forwardedFor === '::1' || !forwardedFor;
    
    return isServerUA && isInternalIP;
}

function logSecurityEvent(request: NextRequest, event: string, data?: Record<string, unknown>): void {
    if (process.env.NODE_ENV === 'production') {
        const ip = getClientIP(request);
        const timestamp = new Date().toISOString();
        console.warn(`[SECURITY] ${timestamp} - ${event} - IP: ${ip}`, data || {});
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

