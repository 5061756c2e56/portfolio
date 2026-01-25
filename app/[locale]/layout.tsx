import { Geist, Geist_Mono } from 'next/font/google';

import StructuredData from '@/components/StructuredData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import { Toaster } from '@/components/ui/sonner';
import { Snowflakes } from '@/components/christmas/Snowflakes';
import type { Metadata } from 'next';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import '../globals.css';
import { isChristmasMode } from '@/lib/christmas';

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
                ? 'Paul Viandier - Portfolio'
                : 'Paul Viandier - Portfolio',
            template: '%s | Paul Viandier - Développeur Web'
        },
        description: isFrench
            ? 'Développeur web passionné de cybersécurité. Dans ce portfolio, je présente mes projets, compétences en développement web, TypeScript, React, Next.js et cybersécurité. Découvrez le portfolio de Paul Viandier, développeur web fullstack en formation.'
            : 'Web developer passionate about cybersecurity. In this portofolio, I show my projects, web development skills, TypeScript, React, Next.js and cybersecurity.',
        keywords: isFrench
            ? [
                'Paul Viandier', 'Viandier', 'Paul', 'développeur', 'développeur web', 'portfolio', 'Portfolio',
                'cybersécurité', 'fullstack', 'développement web', 'TypeScript', 'React', 'Next.js', 'NextJS',
                'Node.js', 'PostgreSQL', 'Redis', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS', 'Git', 'GitHub',
                'API REST', 'intégrateur web', 'développeur frontend', 'développeur backend', 'alternance',
                'formation développeur', 'développeur France', 'développeur web France', 'portfolio développeur',
                'Paul Viandier développeur', 'Viandier développeur', 'Paul développeur web'
            ]
            : [
                'Paul Viandier', 'Viandier', 'Paul', 'developer', 'web developer', 'portfolio', 'Portfolio',
                'cybersecurity', 'fullstack', 'web development', 'TypeScript', 'React', 'Next.js', 'NextJS',
                'Node.js', 'PostgreSQL', 'Redis', 'Tailwind CSS', 'JavaScript', 'HTML5', 'CSS', 'Git', 'GitHub',
                'REST API', 'web integrator', 'frontend developer', 'backend developer', 'apprenticeship',
                'developer training', 'developer France', 'web developer France', 'developer portfolio',
                'Paul Viandier developer', 'Viandier developer', 'Paul web developer'
            ],
        authors: [{ name: 'Paul Viandier' }],
        creator: 'Paul Viandier',
        publisher: 'Paul Viandier',
        openGraph: {
            type: 'website',
            locale: isFrench ? 'fr_FR' : 'en_US',
            alternateLocale: isFrench ? 'en_US' : 'fr_FR',
            url: `${baseUrl}${isFrench ? '' : '/en'}`,
            siteName: 'Portfolio de Paul Viandier',
            title: isFrench
                ? 'Paul Viandier - Développeur Web & Passionné de Cybersécurité\n'
                : 'Paul Viandier - Web Developer & Cybersecurity Enthusiast',
            description: isFrench
                ? 'Autodidacte depuis plusieurs années, je me forme au développement, à la cybersécurité et à l’administration systèmes, trois domaines que je relie entre eux.'
                : 'Self-taught for several years, I am training in development, cybersecurity, and systems administration, three fields that I link together.',
            images: [
                {
                    url: `${baseUrl}/vPsl6pa.png`,
                    width: 1200,
                    height: 630,
                    alt: 'Paul Viandier',
                    type: 'image/png'
                }
            ]
        },
        twitter: {
            card: 'summary_large_image',
            title: isFrench
                ? 'Paul Viandier - Développeur Web & Passionné de Cybersécurité\n'
                : 'Paul Viandier - Web Developer & Cybersecurity Enthusiast',
            description: isFrench
                ? 'Autodidacte depuis plusieurs années, je me forme au développement, à la cybersécurité et à l’administration systèmes, trois domaines que je relie entre eux.'
                : 'Self-taught for several years, I am training in development, cybersecurity, and systems administration, three fields that I link together.',
            images: [
                `${baseUrl}/vPsl6pa.png`
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
    const { locale: paramLocale } = await params;

    if (!paramLocale || !routing.locales.includes(paramLocale as any)) {
        notFound();
    }

    const locale = paramLocale as 'fr' | 'en';
    const messagesFr = (
        await import('@/i18n/locales/fr.json')
    ).default;
    const messagesEn = (
        await import('@/i18n/locales/en.json')
    ).default;

    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://api.emailjs.com"/>
            <link rel="dns-prefetch" href="https://api.emailjs.com"/>
            <link rel="me" href="https://github.com/5061756c2e56/"/>
            <link rel="me" href="https://www.linkedin.com/in/paul-viandier-648837397/"/>
            <script
                dangerouslySetInnerHTML={{
                    __html: `
                        (function() {
                            try {
                                var d = document.documentElement;
                                var s = d.style;
                                s.backgroundColor = '#000000';
                                s.colorScheme = 'dark';
                                var storedTheme = localStorage.getItem('theme');
                                var theme = storedTheme || 'dark';
                                var effectiveTheme = theme;

                                if (theme === 'system') {
                                    effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                                }

                                d.classList.add(effectiveTheme);

                                if (effectiveTheme === 'dark') {
                                    s.backgroundColor = '#000000';
                                    s.color = '#ededed';
                                } else {
                                    s.backgroundColor = '#fafafa';
                                    s.color = '#262626';
                                    s.colorScheme = 'light';
                                }

                                window.__CHRISTMAS_MODE__ = ${isChristmasMode() ? 'true' : 'false'};

                                window.__THEME_READY__ = true;
                            } catch (e) {
                                document.documentElement.classList.add('dark');
                                document.documentElement.style.backgroundColor = '#000000';
                                document.documentElement.style.color = '#ededed';
                                window.__CHRISTMAS_MODE__ = false;
                            }
                        })();
                    `
                }}
            />
            <style
                dangerouslySetInnerHTML={{
                    __html: `
                        html {
                            background-color: #000000;
                            color-scheme: dark;
                        }
                        html:not(.dark):not(.light) {
                            background-color: #000000 !important;
                            color: #ededed !important;
                        }
                        html:not(.dark):not(.light) body {
                            background-color: #000000 !important;
                            color: #ededed !important;
                            opacity: 0;
                        }
                        html.dark, html.dark body {
                            background-color: #000000 !important;
                            color: #ededed !important;
                        }
                        html.light, html.light body {
                            background-color: #fafafa !important;
                            color: #262626 !important;
                        }
                        body {
                            transition: opacity 0.15s ease-out;
                        }
                        html.dark body, html.light body {
                            opacity: 1;
                        }
                    `
                }}
            />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning>
        <ThemeProvider>
            <Snowflakes/>
            <div className="min-h-screen flex flex-col relative z-10">
                <StructuredData/>
                <LocaleProvider initialLocale={locale as 'fr' | 'en'} messages={{ fr: messagesFr, en: messagesEn }}>
                    {children}
                </LocaleProvider>
                <Toaster/>
            </div>
        </ThemeProvider>
        </body>
        </html>
    );
}