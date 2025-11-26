import {
    Geist,
    Geist_Mono
} from 'next/font/google';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider';
import StructuredData from '@/components/StructuredData';
import ScrollProgressBar from '@/components/ScrollProgressBar';
import { AnalyticsWrapper } from '@/components/AnalyticsWrapper';
import { Toaster } from '@/components/ui/sonner';
import type { Metadata } from 'next';
import '../globals.css';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
    display: 'swap',
    preload: true,
    fallback: ['system-ui', '-apple-system', 'sans-serif']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
    display: 'swap',
    preload: false,
    fallback: ['monospace']
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
            ? 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack'
            : 'Portfolio of Paul Viandier, web developer in training, passionate about cybersecurity and fullstack development',
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
                    url: `${baseUrl}/opengraph-image`,
                    width: 1200,
                    height: 630,
                    alt: 'Paul Viandier - Développeur Web & Cybersécurité',
                    type: 'image/png',
                    secureUrl: `${baseUrl}/opengraph-image`
                },
                {
                    url: `${baseUrl}/pfp.png`,
                    width: 512,
                    height: 512,
                    alt: 'Paul Viandier',
                    type: 'image/png',
                    secureUrl: `${baseUrl}/pfp.png`
                }
            ],
            countryName: 'France'
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
            canonical: `${baseUrl}${isFrench ? '/fr' : '/en'}`,
            languages: {
                'fr': `${baseUrl}/fr`,
                'en': `${baseUrl}/en`,
                'x-default': `${baseUrl}/fr`
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
            'dns-prefetch': 'https://api.emailjs.com https://fonts.googleapis.com https://fonts.gstatic.com',
            'preconnect': 'https://fonts.googleapis.com https://fonts.gstatic.com',
            'theme-color': '#000000',
            'color-scheme': 'dark light'
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
    const messages = await getMessages();

    return (
        <html lang={locale} suppressHydrationWarning>
        <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link rel="dns-prefetch" href="https://api.emailjs.com" />
            <link rel="dns-prefetch" href="https://va.vercel-scripts.com" />
        </head>
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StructuredData/>
        <ScrollProgressBar/>
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </ThemeProvider>
        <Toaster />
        <AnalyticsWrapper />
        </body>
        </html>
    );
}