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
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384]
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
                        key: 'Content-Security-Policy',
                        value: [
                            'default-src \'self\'',
                            'script-src \'self\' https://api.emailjs.com',
                            'script-src-elem \'self\' https://api.emailjs.com',
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
                        ].join('; ')
                    },
                    {
                        key: 'Cross-Origin-Embedder-Policy',
                        value: 'require-corp'
                    },
                    {
                        key: 'Cross-Origin-Opener-Policy',
                        value: 'same-origin'
                    },
                    {
                        key: 'Cross-Origin-Resource-Policy',
                        value: 'same-origin'
                    }
                ]
            }
        ];
    }
};

export default withNextIntl(nextConfig);