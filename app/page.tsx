import { redirect } from 'next/navigation';
import { routing } from '@/i18n/routing';
import type { Metadata } from 'next';

const baseUrl = 'https://paulviandier.com';

export const metadata: Metadata = {
    title: 'Portfolio de Paul Viandier',
    description: 'Développeur web fullstack en formation. Découvrez mes projets, compétences en TypeScript, React, Next.js, cybersécurité et développement web moderne.',
    alternates: {
        canonical: baseUrl,
        languages: {
            'fr': baseUrl,
            'en': `${baseUrl}/en`,
            'x-default': baseUrl
        }
    },
    openGraph: {
        type: 'website',
        locale: 'fr_FR',
        alternateLocale: 'en_US',
        url: baseUrl,
        siteName: 'Portfolio de Paul Viandier',
        title: 'Développeur Web fullstack',
        description: 'Développeur web en formation, passionné de cybersécurité et de développement fullstack',
        images: [
            {
                url: `${baseUrl}/vPsl6pa.png`,
                width: 1200,
                height: 630,
                alt: 'Paul Viandier - Développeur Web fullstack',
                type: 'image/png'
            }
        ]
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Portfolio de Paul Viandier - Développeur Web fullstack',
        description: 'Développeur web en formation, passionné de cybersécurité et de développement fullstack',
        images: [`${baseUrl}/vPsl6pa.png`]
    }
};

export default function RootPage() {
    redirect(`/${routing.defaultLocale}`);
}