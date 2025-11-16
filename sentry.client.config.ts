import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,

    integrations: [
        Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true
        })
    ],

    environment: process.env.NODE_ENV || 'development',

    beforeSend(event, hint) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Sentry Client Event:', event);
        }
        return event;
    },

    ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'NetworkError',
        'Failed to fetch',
        'ChunkLoadError'
    ],

    sendDefaultPii: false
});