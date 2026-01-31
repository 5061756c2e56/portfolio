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

'use client';

import { Link } from '@/i18n/routing';
import { FileText, Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FinalCTA() {
    const t = useTranslations('finalCTA');

    return (
        <section id="extras" className="scroll-mt-24 py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text">
                    {t('title')}
                </h2>

                <div
                    className="text-base sm:text-lg text-foreground/80 leading-relaxed bg-card rounded-xl p-6 sm:p-8 border border-border hover:border-foreground/20 transition-all duration-300">
                    <p className="mb-8">
                        {t('description')}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/faq"
                            className="btn-fill-primary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <FileText
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 md:group-hover:rotate-3"
                                aria-hidden="true"
                            />
                            <span>{t('faqButton')}</span>
                        </Link>

                        <Link
                            href="/games"
                            className="btn-fill-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <Gamepad2
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:scale-110 md:group-hover:-translate-y-0.5 md:group-hover:rotate-6"
                                aria-hidden="true"
                            />
                            <span>{t('gamesButton')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}