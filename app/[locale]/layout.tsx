/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';

import StructuredData from '@/components/StructuredData';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocaleProvider } from '@/components/LocaleProvider';
import { Toaster } from '@/components/ui/sonner';
import { Snowflakes } from '@/components/christmas/Snowflakes';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import '../globals.css';
import PatchnotesWidget from '@/components/patchnotes/PatchnotesWidget';
import Footer from '@/components/home/Footer';
import ScrollToTop from '@/components/ScrollToTop';
import SkipLink from '@/components/SkipLink';
import { ContactModalProvider } from '@/hooks/useContactModal';

import { defaultLocale, isLocale, Locale, locales, ogLocaleMap } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';
import { isChristmasMode } from '@/lib/christmas';

const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin']
});

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin']
});

function localeUrl(baseUrl: string, loc: string): string {
    return loc === defaultLocale ? baseUrl : `${baseUrl}/${loc}`;
}

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('pagesMetadata.layout');

    const baseUrl = SITE_URL;
    const url = localeUrl(baseUrl, locale);
    const ogLocale = ogLocaleMap[locale as Locale] ?? 'en_US';
    const alternateOgLocales = locales
        .filter((l) => l !== locale)
        .map((l) => ogLocaleMap[l]);

    const languages: Record<string, string> = {};
    for (const l of locales) {
        languages[l] = localeUrl(baseUrl, l);
    }
    languages['x-default'] = baseUrl;

    return {
        metadataBase: new URL(baseUrl),
        title: {
            default: 'Paul Viandier',
            template: '%s - Paul Viandier'
        },
        description: t('description'),
        authors: [{ name: 'Paul Viandier' }],
        openGraph: {
            type: 'website',
            locale: ogLocale,
            alternateLocale: alternateOgLocales,
            url,
            siteName: t('siteName'),
            title: t('ogTitle'),
            description: t('ogDescription'),
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
            title: t('ogTitle'),
            description: t('ogDescription'),
            images: [`${baseUrl}/vPsl6pa.png`],
            creator: '@paulviandier'
        },
        robots: {
            index: false,
            follow: true
        },
        alternates: {
            canonical: url,
            languages
        },
        verification: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
            ? {
                google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION
            }
            : undefined,
        icons: {
            icon: [
                { url: '/favicon.png', sizes: 'any', type: 'image/png' },
                { url: '/favicon.png', sizes: '192x192', type: 'image/png' },
                { url: '/favicon.png', sizes: '512x512', type: 'image/png' },
                { url: '/favicon.png', sizes: 'any' }
            ],
            apple: [{ url: '/favicon.png', sizes: '180x180', type: 'image/png' }],
            shortcut: '/favicon.ico'
        },
        manifest: `/${locale}/manifest.webmanifest`,
        other: {
            'theme-color': '#fafafa',
            'format-detection': 'telephone=no',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-title': t('siteName')
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

    if (!paramLocale || !isLocale(paramLocale)) {
        notFound();
    }

    const locale: Locale = paramLocale;

    const allMsgs = (
        await import(`@/i18n/locales/${locale}.json`)
    ).default;
    const { _meta, ...messages } = allMsgs;
    void _meta;

    const christmasInitScript = `window.__CHRISTMAS_MODE__ = ${isChristmasMode() ? 'true' : 'false'};`;

    return (
        <html lang={locale} suppressHydrationWarning>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
                suppressHydrationWarning
            >
                <Script id="christmas-init" strategy="beforeInteractive">
                    {christmasInitScript}
                </Script>
                <LocaleProvider initialLocale={locale} messages={messages}>
                    <ThemeProvider>
                        <Snowflakes />
                        <div className="min-h-screen flex flex-col relative z-10">
                            <StructuredData />
                            <SkipLink />
                            <ScrollToTop />

                            <ContactModalProvider>
                                <main id="main-content">{children}</main>
                                <PatchnotesWidget locale={locale} />
                                <Footer />
                            </ContactModalProvider>
                            <Toaster />
                        </div>
                    </ThemeProvider>
                </LocaleProvider>
            </body>
        </html>
    );
}
