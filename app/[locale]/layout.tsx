import {
    Geist,
    Geist_Mono
} from 'next/font/google';

import StructuredData from '@/components/StructuredData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import { Toaster } from '@/components/ui/sonner';
import { Snowflakes } from '@/components/Snowflakes';
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
                    url: 'https://imgur.com/vPsl6pa.png',
                    width: 1200,
                    height: 630,
                    alt: 'Paul Viandier - Développeur Web & Cybersécurité',
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
                'https://imgur.com/vPsl6pa.png'
            ],
            creator: '@paulviandier'
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
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
                { url: '/pfp.png', sizes: 'any', type: 'image/png' },
                { url: '/pfp.png', sizes: '192x192', type: 'image/png' },
                { url: '/pfp.png', sizes: '512x512', type: 'image/png' },
                { url: '/icon.png', sizes: 'any' }
            ],
            apple: [
                { url: '/pfp.png', sizes: '180x180', type: 'image/png' }
            ],
            shortcut: '/pfp.png'
        },
        manifest: '/manifest.webmanifest',
        other: {
            'dns-prefetch': 'https://api.emailjs.com',
            'theme-color': '#000000',
            'format-detection': 'telephone=no',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'black-translucent',
            'apple-mobile-web-app-title': 'Portfolio de Paul Viandier'
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
                                const storedTheme = localStorage.getItem('theme');
                                let theme = storedTheme || 'light';
                                let effectiveTheme = theme;
                                
                                if (theme === 'system') {
                                    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                }
                                
                                document.documentElement.classList.add(effectiveTheme);
                                
                                window.__CHRISTMAS_MODE__ = ${process.env.NEXT_PUBLIC_CHRISTMAS_MODE === 'true' ? 'true' : 'false'};
                            } catch (e) {
                                document.documentElement.classList.add('light');
                                window.__CHRISTMAS_MODE__ = false;
                            }
                        })();
                    `
                }}
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
            <Snowflakes />
            <div className="min-h-screen flex flex-col relative z-10">
                <StructuredData/>
                <LocaleProvider initialLocale={locale as 'fr' | 'en'} messages={{ fr: messagesFr, en: messagesEn }}>
                    {children}
                </LocaleProvider>
                <Toaster />
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}