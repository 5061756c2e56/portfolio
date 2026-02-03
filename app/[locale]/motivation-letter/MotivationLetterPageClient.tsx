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

import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Great_Vibes } from 'next/font/google';
import LegalNavigation from '@/components/navbars/Legal/LegalNavigation';
import { cn } from '@/lib/utils';
import { FileText } from 'lucide-react';
import { useContactModal } from '@/hooks/useContactModal';
import { CvDownloadButton } from '@/components/cv/ProfileBlock';

const LAST_UPDATED_ISO = '2026-01-31';
const MOTIVATION_PDF_PATH = '/Lettre de motivation - Viandier Paul.pdf';
const MOTIVATION_PDF_FILENAME = 'Lettre de motivation - Viandier Paul.pdf';

const signatureFont = Great_Vibes({
    subsets: ['latin'],
    weight: '400',
    display: 'swap'
});

export default function MotivationLetterPageClient() {
    const t = useTranslations('motivation-letter');
    const { openContact } = useContactModal();

    const handleEmailClick = useCallback(() => {
        void openContact();
    }, [openContact]);

    const lastUpdated = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long' }).format(new Date(LAST_UPDATED_ISO));

    const topCenteredTop = t('topCentered.top');
    const topCenteredBottom = t('topCentered.bottom');

    const bodyKeys = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8'] as const;

    return (
        <>
            <LegalNavigation/>
            <div className="min-h-screen w-full bg-background">
                <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-24 mb-12 relative">
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div
                            className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl"/>
                        <div
                            className="absolute right-[-120px] top-[220px] h-[360px] w-[360px] rounded-full bg-blue-500/5 blur-3xl"/>
                    </div>

                    <header className="mb-12">
                        <div className="text-center mt-6">
                            <div
                                className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                                <FileText className="h-4 w-4"/>
                                {t('badge')}
                            </div>

                            <h1 className="text-4xl sm:text-5xl font-bold mt-5 gradient-text">{t('title')}</h1>

                            <div className="mt-5 flex justify-center">
                                <CvDownloadButton
                                    label={t('actions.downloadPdf')}
                                    loadingLabel={t('actions.downloadPdfLoading')}
                                    href={MOTIVATION_PDF_PATH}
                                    filename={MOTIVATION_PDF_FILENAME}
                                />
                            </div>

                            <p className="text-xs text-muted-foreground mt-4">
                                {t('lastUpdatedLabel')}{' '}
                                <span className="text-foreground/80 font-medium">{lastUpdated}</span>
                            </p>
                        </div>
                    </header>

                    <article
                        className="glass-card rounded-2xl border border-blue-500/20 border-l-4 border-l-blue-500/50 p-8 sm:p-10 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-all duration-300">
                        <div className="text-center">
                            <p className="text-sm sm:text-base font-semibold text-foreground/80 leading-relaxed">
                                {topCenteredTop}
                            </p>

                            <button
                                type="button"
                                onClick={handleEmailClick}
                                className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed underline underline-offset-4 hover:text-foreground/80 transition-colors cursor-pointer"
                            >
                                {topCenteredBottom}
                            </button>
                        </div>

                        <div className="mt-8">
                            <div className="-mx-8 sm:-mx-10">
                                <div
                                    className="w-full sm:w-[60%] rounded-r-2xl border border-blue-500/25 bg-blue-500/10 px-6 py-3">
                                    <p className="text-center text-sm sm:text-base font-medium text-foreground/80">
                                        {t('bannerText')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
                            {bodyKeys.map((k) => (
                                <p key={k}>
                                    {t.rich(`body.${k}`, {
                                        b: (chunks) => (
                                            <strong className="font-semibold text-foreground/90">{chunks}</strong>
                                        )
                                    })}
                                </p>
                            ))}
                        </div>

                        <div className="mt-12 flex justify-end">
                            <div className="text-right">
                                <div
                                    className={cn(signatureFont.className, 'text-4xl sm:text-5xl text-foreground/80 leading-none')}>
                                    Paul Viandier
                                </div>
                            </div>
                        </div>
                    </article>
                </main>
            </div>
        </>
    );
}