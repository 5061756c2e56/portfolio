/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/config.ts');

const nextConfig: NextConfig = {
    output: 'standalone',
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        qualities: [75, 90, 95, 100],
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'img.shields.io',
                port: '',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'avatars.githubusercontent.com',
                pathname: '/**'
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                pathname: '/**'
            }
        ]
    },
    async redirects() {
        return [
            {
                source: '/:path*',
                has: [
                    {
                        type: 'host',
                        value: 'www.paulviandier.com'
                    }
                ],
                destination: 'https://paulviandier.com/:path*',
                permanent: true
            }
        ];
    },
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'X-DNS-Prefetch-Control',
                        value: 'on'
                    },
                    {
                        key: 'Strict-Transport-Security',
                        value: 'max-age=63072000; includeSubDomains; preload'
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'SAMEORIGIN'
                    },
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff'
                    },
                    {
                        key: 'X-XSS-Protection',
                        value: '1; mode=block'
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin'
                    },
                    {
                        key: 'Permissions-Policy',
                        value: 'camera=(), microphone=(), geolocation=()'
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-origin'
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: [
                            'default-src \'self\'',
                            'base-uri \'self\'',
                            'form-action \'self\'',
                            'frame-ancestors \'self\'',
                            'img-src \'self\' data: https: blob:',
                            'connect-src \'self\' https: wss:',
                            'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://challenges.cloudflare.com https://*.emailjs.com',
                            'style-src \'self\' \'unsafe-inline\'',
                            'frame-src https://challenges.cloudflare.com',
                            'object-src \'none\''
                        ].join('; ')
                    }
                ]
            }
        ];
    }
};

export default withNextIntl(nextConfig);