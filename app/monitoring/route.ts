import {
    NextRequest,
    NextResponse
} from 'next/server';

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN || process.env.SENTRY_DSN;

export async function POST(request: NextRequest) {
    if (!SENTRY_DSN) {
        return NextResponse.json(
            { error: 'Sentry DSN not configured' },
            { status: 500 }
        );
    }

    try {
        const envelope = await request.text();
        const pieces = envelope.split('\n');
        const header = JSON.parse(pieces[0]);
        const dsn = new URL(header.dsn);
        const projectId = dsn.pathname.substring(1);
        const sentryHost = dsn.host;
        const sentryProtocol = dsn.protocol === 'https:' ? 'https' : 'http';
        const sentryUrl = `${sentryProtocol}://${sentryHost}/api/${projectId}/envelope/`;

        const response = await fetch(sentryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-sentry-envelope'
            },
            body: envelope
        });

        if (!response.ok) {
            return NextResponse.json(
                { error: 'Failed to forward to Sentry' },
                { status: response.status }
            );
        }

        return new NextResponse(null, {
            status: response.status,
            headers: {
                'Content-Type': 'text/plain'
            }
        });
    } catch (error) {
        console.error('Sentry tunnel error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}