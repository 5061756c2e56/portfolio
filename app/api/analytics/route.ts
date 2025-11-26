import {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    getSecurityHeaders,
    validateOrigin,
    validateUserAgent,
    validatePayloadSize,
    validateApiSecret,
    getCorsHeaders,
    createSecurityResponse
} from '@/lib/api-security';
import { rateLimit } from '@/lib/rate-limit';

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') {
        return createSecurityResponse('Méthode non autorisée', 405, { 'Allow': 'GET' });
    }

    if (!validateApiSecret(request)) {
        return createSecurityResponse('Accès non autorisé', 401);
    }

    if (!validateUserAgent(request)) {
        return createSecurityResponse('Requête non autorisée', 403);
    }

    if (!validateOrigin(request)) {
        return createSecurityResponse('Origine non autorisée', 403);
    }

    if (!validatePayloadSize(request)) {
        return createSecurityResponse('Requête trop volumineuse', 413);
    }

    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
            {
                status: 429,
                headers: {
                    ...getSecurityHeaders(),
                    'Retry-After': '60',
                    'X-RateLimit-Remaining': '0'
                }
            }
        );
    }

    try {
        const analyticsData = {
            totalVisits: 0,
            uniqueVisitors: 0,
            pageViews: 0,
            averageTime: '0m',
            topPages: [
                {
                    path: '/',
                    views: 0
                },
                {
                    path: '/curriculum-vitae',
                    views: 0
                }
            ]
        };

        const origin = request.headers.get('origin');
        return NextResponse.json(
            analyticsData,
            {
                headers: {
                    ...getCorsHeaders(origin),
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'Cache-Control': 'no-store, no-cache, must-revalidate, max-age=0'
                }
            }
        );
    } catch (error) {
        console.error('Error in analytics API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            {
                status: 500,
                headers: getSecurityHeaders()
            }
        );
    }
}