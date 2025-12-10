import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const middleware = createMiddleware({
    ...routing,
    localeDetection: false
});

export const proxy = middleware;

export const config = {
    matcher: ['/((?!api|_next|_vercel|.*\\..*|sitemap|robots|manifest).*)']
};