import * as Sentry from '@sentry/nextjs';

Sentry.init({
    dsn: process.env.SENTRY_DSN,

    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,

    enableLogs: true,

    environment: process.env.NODE_ENV || 'development',

    beforeSend(event, hint) {
        if (process.env.NODE_ENV === 'development') {
            console.error('Sentry Edge Event:', event);
        }
        return event;
    },

    ignoreErrors: [
        'ResizeObserver loop limit exceeded',
        'Non-Error promise rejection captured',
        'NetworkError',
        'Failed to fetch'
    ],

    sendDefaultPii: false
});