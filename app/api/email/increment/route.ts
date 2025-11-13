import { NextRequest, NextResponse } from 'next/server';
import { incrementEmailCounter } from '@/lib/db';
import { rateLimit, validateOrigin } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
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
        const newCount = await incrementEmailCounter();
        return NextResponse.json(
            { count: newCount },
            {
                headers: {
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString()
                }
            }
        );
    } catch (error) {
        console.error('Erreur API increment:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'incrémentation' },
            { status: 500 }
        );
    }
}
