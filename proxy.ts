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
    if (!nonce) nonce = generateNonce();

    const response = intlMiddleware(request);

    const CF = 'https://challenges.cloudflare.com';
    const EMAILJS = 'https://api.emailjs.com';

    const cspHeader = response.headers.get('Content-Security-Policy');

    if (cspHeader) {
        const updatedCsp = cspHeader
            .replace(
                /script-src[^;]+/,
                `script-src 'self' 'nonce-${nonce}' ${EMAILJS} ${CF}`
            )
            .replace(
                /script-src-elem[^;]+/,
                `script-src-elem 'self' 'nonce-${nonce}' ${EMAILJS} ${CF}`
            )
            .replace(
                /connect-src[^;]+/,
                `connect-src 'self' ${EMAILJS} https://api.github.com ${CF}`
            )
            .replace(
                /frame-src[^;]+/,
                `frame-src ${CF}`
            );

        response.headers.set('Content-Security-Policy', updatedCsp);
    } else {
        const csp = [
            'default-src \'self\'',
            `script-src 'self' 'nonce-${nonce}' ${EMAILJS} ${CF}`,
            `script-src-elem 'self' 'nonce-${nonce}' ${EMAILJS} ${CF}`,
            'worker-src \'self\' blob:',
            'style-src \'self\' \'unsafe-inline\'',
            'img-src \'self\' data: blob: https://img.shields.io https://avatars.githubusercontent.com',
            'font-src \'self\' data:',
            `connect-src 'self' ${EMAILJS} https://api.github.com ${CF}`,
            `frame-src ${CF}`,
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