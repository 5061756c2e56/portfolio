import { NextRequest, NextResponse } from 'next/server';
import { incrementEmailCounter } from '@/lib/db';
import { isServerSideRequest } from '@/lib/rate-limit';
import {
    getSecurityHeaders,
    createSecurityResponse
} from '@/lib/api-security';

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return createSecurityResponse('Méthode non autorisée', 405, { 'Allow': 'POST' });
    }

    if (!isServerSideRequest(request)) {
        return createSecurityResponse('Accès non autorisé', 403);
    }

    try {
        const newCount = await incrementEmailCounter();
        return NextResponse.json(
            { count: newCount },
            {
                headers: {
                    ...getSecurityHeaders(),
                    'Cache-Control': 'no-store'
                }
            }
        );
    } catch (error) {
        console.error('Erreur API increment:', error);
        return NextResponse.json(
            { error: 'Erreur lors de l\'incrémentation' },
            { 
                status: 500,
                headers: getSecurityHeaders()
            }
        );
    }
}

