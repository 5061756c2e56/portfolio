import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Portfolio de Paul Viandier',
        short_name: 'PV',
        description: 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack',
        start_url: '/',
        display: 'standalone',
        background_color: '#fafafa',
        theme_color: '#fafafa',
        icons: [
            {
                src: '/icon.png',
                sizes: 'any',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/pfp.png',
                sizes: '192x192',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/pfp.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'any'
            },
            {
                src: '/pfp.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable'
            }
        ]
    };
}