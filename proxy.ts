import { NextRequest } from 'next/server';
import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

const intlMiddleware = createMiddleware({
    ...routing,
    localeDetection: false
});

function generateNonce(): string {
    const array = new Uint8Array(16);
    crypto.getRandomValues(array);
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('');
}

export function proxy(request: NextRequest) {
    let nonce = request.cookies.get('csp-nonce')?.value;

    if (!nonce) {
        nonce = generateNonce();
    }

    const response = intlMiddleware(request);

    const cspHeader = response.headers.get('Content-Security-Policy');
    if (cspHeader) {
        const updatedCsp = cspHeader
            .replace(
                /script-src[^;]+/,
                `script-src 'self' 'nonce-${nonce}' https://api.emailjs.com`
            )
            .replace(
                /script-src-elem[^;]+/,
                `script-src-elem 'self' 'nonce-${nonce}' 'unsafe-inline' https://api.emailjs.com`
            );
        response.headers.set('Content-Security-Policy', updatedCsp);
    } else {
        const csp = [
            'default-src \'self\'',
            `script-src 'self' 'nonce-${nonce}' https://api.emailjs.com`,
            `script-src-elem 'self' 'nonce-${nonce}' 'unsafe-inline' https://api.emailjs.com`,
            'worker-src \'self\' blob:',
            'style-src \'self\' \'unsafe-inline\'',
            'img-src \'self\' data: https: blob:',
            'font-src \'self\' data:',
            'connect-src \'self\' https://api.emailjs.com https://api.github.com',
            'frame-src \'none\'',
            'object-src \'none\'',
            'base-uri \'self\'',
            'form-action \'self\'',
            'frame-ancestors \'none\'',
            'upgrade-insecure-requests',
            'block-all-mixed-content'
        ].join('; ');
        response.headers.set('Content-Security-Policy', csp);
    }

    response.cookies.set('csp-nonce', nonce, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24
    });

    response.headers.set('X-CSP-Nonce', nonce);

    return response;
}

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*|sitemap|robots|manifest|icon.png|pfp.png|vPsl6pa.png|.*\\.pdf|.*\\.svg).*)'
    ]
};