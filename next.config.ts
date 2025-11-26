import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./i18n/config.ts');

const nextConfig: NextConfig = {
    compress: true,
    poweredByHeader: false,
    reactStrictMode: true,
    images: {
        formats: ['image/avif', 'image/webp'],
        deviceSizes: [640, 750, 828, 1080, 1200],
        imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
        minimumCacheTTL: 60,
        dangerouslyAllowSVG: false
    },
    experimental: {
        optimizePackageImports: ['lucide-react', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu']
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
                            'script-src \'self\' \'unsafe-inline\' \'unsafe-eval\' https://api.emailjs.com https://va.vercel-scripts.com https://vercel.live',
                            'script-src-elem \'self\' \'unsafe-inline\' https://api.emailjs.com https://va.vercel-scripts.com https://vercel.live',
                            'worker-src \'self\' blob:',
                            'style-src \'self\' \'unsafe-inline\'',
                            'img-src \'self\' data: https: blob:',
                            'font-src \'self\' data:',
                            'connect-src \'self\' https://api.emailjs.com https://va.vercel-scripts.com https://vercel.live',
                            'frame-src \'self\' https://vercel.live',
                            'object-src \'none\'',
                            'base-uri \'self\'',
                            'form-action \'self\'',
                            'frame-ancestors \'self\'',
                            'upgrade-insecure-requests'
                        ].join('; ')
                    }
                ]
            },
            {
                source: '/api/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, s-maxage=3600, stale-while-revalidate=86400'
                    },
                    {
                        key: 'Vary',
                        value: 'Origin, Accept-Encoding'
                    }
                ]
            },
            {
                source: '/_next/static/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            },
            {
                source: '/:path*\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=31536000, immutable'
                    }
                ]
            }
        ];
    }
};

export default withNextIntl(nextConfig);