import {
    Geist,
    Geist_Mono
} from 'next/font/google';

import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from '@/components/ThemeProvider';
import StructuredData from '@/components/StructuredData';
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
        verification: {
            google: 'your-google-verification-code'
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
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <StructuredData/>
        <ThemeProvider>
            <NextIntlClientProvider messages={messages}>
                {children}
            </NextIntlClientProvider>
        </ThemeProvider>
        </body>
        </html>
    );
}