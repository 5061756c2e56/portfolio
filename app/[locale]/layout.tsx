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
                : 'Portfolio de Paul Viandier',
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
            url: baseUrl,
            siteName: 'Paul Viandier Portfolio',
            title: isFrench
                ? 'Paul Viandier - Développeur Web & Cybersécurité'
                : 'Paul Viandier - Web Developer & Cybersecurity',
            description: isFrench
                ? 'Portfolio de Paul Viandier, développeur web en formation'
                : 'Portfolio of Paul Viandier, web developer in training'
        },
        twitter: {
            card: 'summary_large_image',
            title: isFrench
                ? 'Paul Viandier - Développeur Web & Cybersécurité'
                : 'Paul Viandier - Web Developer & Cybersecurity',
            description: isFrench
                ? 'Portfolio de Paul Viandier, développeur web en formation'
                : 'Portfolio of Paul Viandier, web developer in training'
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
            canonical: baseUrl,
            languages: {
                'fr': `${baseUrl}/fr`,
                'en': `${baseUrl}/en`
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