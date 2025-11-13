import { NextRequest, NextResponse } from 'next/server';
import { getEmailCounter } from '@/lib/db';
import { rateLimit, validateOrigin } from '@/lib/rate-limit';

export async function GET(request: NextRequest) {
    const rateLimitResult = rateLimit(request);
    
    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
            { 
                status: 429,
                headers: {
                    'Retry-After': '60',
                    'X-RateLimit-Remaining': '0'
                }
            }
        );
    }
    
    if (!validateOrigin(request)) {
        return NextResponse.json(
            { error: 'Origine non autorisée' },
            { status: 403 }
        );
    }
    
    try {
        const counter = await getEmailCounter();
        return NextResponse.json(
            counter,
            {
                headers: {
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'Cache-Control': 'public, s-maxage=30, stale-while-revalidate=60'
                }
            }
        );
    } catch (error) {
        console.error('Erreur API counter:', error);
        return NextResponse.json(
            {
                count: 0,
                month: new Date().toISOString().slice(0, 7)
            },
            { status: 500 }
        );
    }
}
