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

import './globals.css';
import { Home } from 'lucide-react';
import { getLocale, getMessages, getTranslations } from 'next-intl/server';
import { defaultLocale, isLocale } from '@/i18n/routing';
import { ContactModalProvider } from '@/hooks/useContactModal';
import Footer from '@/components/home/Footer';
import { NextIntlClientProvider } from 'next-intl';

export default async function NotFound() {
    const rawLocale = await getLocale();
    const locale = isLocale(rawLocale) ? rawLocale : defaultLocale;
    const messages = await getMessages();
    const t = await getTranslations('errors.404');
    const homeHref = locale === defaultLocale ? '/' : `/${locale}`;

    return (
        <NextIntlClientProvider locale={locale} messages={messages} timeZone="Europe/Paris">
            <ContactModalProvider>
                <div className="min-h-screen flex flex-col bg-background text-foreground antialiased">
                    <div className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-16">
                        <div className="pointer-events-none absolute inset-0" aria-hidden="true">
                            <div
                                className="absolute left-1/2 -top-36 h-96 w-96 -translate-x-1/2 rounded-full bg-foreground/8 blur-[56px]" />
                            <div
                                className="absolute -right-32 top-56 h-80 w-80 rounded-full bg-blue-500/10 blur-[56px]" />
                        </div>

                        <article
                            className="relative z-10 w-full max-w-2xl rounded-2xl border border-blue-500/22 border-l-4 border-l-blue-500/55 bg-card/96 shadow-[0_0_25px_rgba(59,130,246,0.08)] backdrop-blur-[10px] px-6 py-8 text-center sm:px-8 sm:py-10">
                            <span
                                className="inline-flex items-center rounded-full border border-blue-500/20 bg-card/90 px-3 py-1 text-xs font-semibold text-muted-foreground">
                                {t('badge')}
                            </span>

                            <h1 className="mt-4 bg-linear-to-br from-violet-500 to-blue-500 bg-clip-text text-[clamp(4rem,11vw,7.5rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-transparent">
                                404
                            </h1>

                            <h2 className="mt-3 text-[clamp(1.45rem,3.6vw,2.3rem)] font-bold leading-snug text-foreground">
                                {t('title')}
                            </h2>

                            <p className="mx-auto mt-4 max-w-prose text-[clamp(0.98rem,1.8vw,1.1rem)] leading-relaxed text-foreground/70">
                                {t('description')}
                            </p>

                            <div className="mt-6 flex justify-center">
                                <a
                                    href={homeHref}
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-background/90 px-4 py-2.5 text-sm font-semibold text-foreground transition-all hover:border-blue-500/35 hover:bg-muted/80 hover:-translate-y-px focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500/55"
                                >
                                    <Home className="h-4 w-4 shrink-0" />
                                    <span>{t('backHome')}</span>
                                </a>
                            </div>
                        </article>
                    </div>

                    <Footer />
                </div>
            </ContactModalProvider>
        </NextIntlClientProvider>
    );
}
