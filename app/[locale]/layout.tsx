import {
    Geist,
    Geist_Mono
} from 'next/font/google';

import StructuredData from '@/components/StructuredData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import type { Metadata } from 'next';
import '../globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;

    const baseUrl = 'https://paulviandier.com';
    const isFrench = locale === 'fr';

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: isFrench
                ? 'Portfolio de Paul Viandier'
                : 'Portfolio of Paul Viandier',
            template: '%s | Portfolio de Paul Viandier'
        },
        description: isFrench
            ? 'Portfolio de Paul Viandier, développeur web fullstack en formation. Découvrez mes projets, compétences en TypeScript, React, Next.js, cybersécurité et développement web moderne.'
            : 'Portfolio of Paul Viandier, fullstack web developer in training. Discover my projects, skills in TypeScript, React, Next.js, cybersecurity and modern web development.',
        keywords: isFrench
            ? ['Paul Viandier', 'développeur web', 'cybersécurité', 'fullstack', 'portfolio', 'développement web']
            : ['Paul Viandier', 'web developer', 'cybersecurity', 'fullstack', 'portfolio', 'web development'],
        authors: [{ name: 'Paul Viandier' }],
        creator: 'Paul Viandier',
        openGraph: {
            type: 'website',
            locale: isFrench ? 'fr_FR' : 'en_US',
            alternateLocale: isFrench ? 'en_US' : 'fr_FR',
            url: `${baseUrl}${isFrench ? '/fr' : '/en'}`,
            siteName: 'Portfolio de Paul Viandier',
            title: isFrench
                ? 'Portfolio de Paul Viandier - Développeur Web & Cybersécurité'
                : 'Portfolio of Paul Viandier - Web Developer & Cybersecurity',
            description: isFrench
                ? 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack'
                : 'Portfolio of Paul Viandier, web developer in training, passionate about cybersecurity and fullstack development',
            images: [
                {
                    url: `${baseUrl}/banner.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Paul Viandier - Développeur Web & Cybersécurité',
                    type: 'image/png'
                },
                {
                    url: `${baseUrl}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: 'Paul Viandier - Développeur Web & Cybersécurité',
                    type: 'image/png'
                },
                {
                    url: `${baseUrl}/pfp.png`,
                    width: 512,
                    height: 512,
                    alt: 'Paul Viandier',
                    type: 'image/png'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: isFrench
                ? 'Portfolio de Paul Viandier - Développeur Web & Cybersécurité'
                : 'Portfolio of Paul Viandier - Web Developer & Cybersecurity',
            description: isFrench
                ? 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack'
                : 'Portfolio of Paul Viandier, web developer in training, passionate about cybersecurity and fullstack development',
            images: [
                `${baseUrl}/banner.png`,
                `${baseUrl}/opengraph-image`,
                `${baseUrl}/pfp.png`
            ],
            creator: '@paulviandier'
        },
        robots: {
            index: true,
            follow: true,
            googleBot: {
                index: true,
                follow: true,
                'max-video-preview': -1,
                'max-image-preview': 'large',
                'max-snippet': -1
            }
        },
        alternates: {
            canonical: `${baseUrl}${isFrench ? '' : '/en'}`,
            languages: {
                'fr': `${baseUrl}`,
                'fr-FR': `${baseUrl}`,
                'en': `${baseUrl}/en`,
                'en-US': `${baseUrl}/en`,
                'x-default': `${baseUrl}`
            }
        },
        verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION ? {
            google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
        } : undefined,
        icons: {
            icon: [
                { url: '/icon.png', sizes: 'any' },
                { url: '/pfp.png', sizes: '512x512', type: 'image/png' }
            ],
            apple: [
                { url: '/pfp.png', sizes: '180x180', type: 'image/png' }
            ],
            shortcut: '/icon.png'
        },
        other: {
            'dns-prefetch': 'https://api.emailjs.com',
            'theme-color': '#000000',
            'format-detection': 'telephone=no'
        }
    };
}

export default async function RootLayout({
    children,
    params
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    const messagesFr = (await import('@/i18n/locales/fr.json')).default;
    const messagesEn = (await import('@/i18n/locales/en.json')).default;

    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://api.emailjs.com" />
            <link rel="dns-prefetch" href="https://api.emailjs.com" />
            <link rel="me" href="https://github.com/5061756c2e56/" />
            <link rel="me" href="https://www.linkedin.com/in/paul-viandier-648837397/" />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                const savedLocale = localStorage.getItem('locale');
                                if (savedLocale === 'fr' || savedLocale === 'en') {
                                    document.documentElement.lang = savedLocale;
                                }
                            } catch (e) {}
                        })();
                    `
                }}
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
            <StructuredData/>
            <LocaleProvider initialLocale={locale as 'fr' | 'en'} messages={{ fr: messagesFr, en: messagesEn }}>
                {children}
            </LocaleProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}