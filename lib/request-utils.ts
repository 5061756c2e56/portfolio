import { NextRequest } from 'next/server';

export function getClientIP(request: NextRequest): string {
    const cfConnectingIP = request.headers.get('cf-connecting-ip');
    if (cfConnectingIP) return cfConnectingIP;

    const forwarded = request.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0].trim();

    const realIP = request.headers.get('x-real-ip');
    if (realIP) return realIP;

    return 'unknown';
}
