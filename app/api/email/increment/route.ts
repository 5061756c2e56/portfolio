import { NextRequest, NextResponse } from 'next/server';
import { incrementEmailCounter } from '@/lib/db';
import { isServerSideRequest } from '@/lib/rate-limit';

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return NextResponse.json(
            { error: 'Méthode non autorisée' },
            {
                status: 405,
                headers: {
                    'Allow': 'POST',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    if (!isServerSideRequest(request)) {
        return NextResponse.json(
            { error: 'Accès non autorisé' },
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
        const newCount = await incrementEmailCounter();
        return NextResponse.json(
            { count: newCount },
            {
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Cache-Control': 'no-store'
                }
            }
        );
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Increment API] Error');
        }
        return NextResponse.json(
            { error: 'Erreur lors de l\'incrémentation' },
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