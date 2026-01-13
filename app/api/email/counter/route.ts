import { NextRequest, NextResponse } from 'next/server';
import { getEmailCounter } from '@/lib/db';
import { rateLimit, validateOrigin } from '@/lib/rate-limit';

const isProduction = process.env.NODE_ENV === 'production';

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') {
        return NextResponse.json(
            { error: 'Méthode non autorisée' },
            {
                status: 405,
                headers: {
                    'Allow': 'GET',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    const rateLimitResult = await rateLimit(request);

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
            {
                status: 429,
                headers: {
                    'Retry-After': '60',
                    'X-RateLimit-Remaining': '0',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    if (!validateOrigin(request)) {
        return NextResponse.json(
            { error: 'Origine non autorisée' },
            {
                status: 403,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    try {
        const counter = await getEmailCounter();
        return NextResponse.json(
            counter,
            {
                headers: {
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
                }
            }
        );
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Counter API] Error');
        }
        return NextResponse.json(
            {
                count: 0,
                month: new Date().toISOString().slice(0, 7)
            },
            {
                status: 500,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }
}