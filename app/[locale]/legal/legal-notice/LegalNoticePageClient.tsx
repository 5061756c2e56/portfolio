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

import { FileText } from 'lucide-react';
import LegalNavigation from '@/components/navbars/Legal/LegalNavigation';
import { useContactModal } from '@/hooks/useContactModal';
import { Link } from '@/i18n/routing';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback } from 'react';

type Section = {
    id: string;
    title: string;
    content: React.ReactNode;
};

const LAST_UPDATED_ISO = '2026-01-31';

export default function LegalNoticePageClient() {
    const tCommon = useTranslations('legal.common');
    const t = useTranslations('legal.legal-notice');
    const format = useFormatter();
    const { openContact } = useContactModal();

    const handleEmailClick = useCallback(() => {
        void openContact();
    }, [openContact]);

    const lastUpdated = format.dateTime(new Date(LAST_UPDATED_ISO), { dateStyle: 'long' });

    const sections: Section[] = [
        {
            id: 'editeur',
            title: t('sections.publisher.title'),
            content: (
                <>
                    <p>{t('sections.publisher.p1')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">
                            <span
                                className="font-medium text-foreground">{t('sections.publisher.publisherTitle')}</span>
                            <br/>
                            {t('sections.publisher.publisherNameLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.publisher.publisherNameValue')}</span>
                            <br/>
                            {t('sections.publisher.publisherEmailLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.publisher.publisherEmailValue')}</span>
                        </p>
                    </div>

                    <p className="mt-4">
                        {t.rich('sections.publisher.contactLine', {
                            contactBtn: (chunks) => (
                                <button
                                    type="button"
                                    onClick={handleEmailClick}
                                    className="underline underline-offset-4 hover:text-foreground transition-colors"
                                >
                                    {chunks}
                                </button>
                            )
                        })}
                    </p>
                </>
            )
        },
        {
            id: 'hebergeur',
            title: t('sections.hosting.title'),
            content: (
                <div className="rounded-lg border border-border bg-background/50 p-4">
                    <p className="text-sm text-muted-foreground">
                        <span className="font-medium text-foreground">{t('sections.hosting.hostTitle')}</span>
                        <br/>
                        {t('sections.hosting.hostNameLabel')}{' '}
                        <span className="text-foreground/90">{t('sections.hosting.hostNameValue')}</span>
                        <br/>
                        {t('sections.hosting.hostAddressLabel')}{' '}
                        <span className="text-foreground/90">{t('sections.hosting.hostAddressValue')}</span>
                        <br/>
                        {t('sections.hosting.hostWebsiteLabel')}{' '}
                        <span className="text-foreground/90">{t('sections.hosting.hostWebsiteValue')}</span>
                    </p>
                </div>
            )
        },
        {
            id: 'propriete',
            title: t('sections.ip.title'),
            content: (
                <>
                    <p>{t('sections.ip.p1')}</p>
                    <p className="mt-3">{t('sections.ip.p2')}</p>
                </>
            )
        },
        {
            id: 'responsabilite',
            title: t('sections.liability.title'),
            content: (
                <>
                    <p>{t('sections.liability.p1')}</p>
                    <p className="mt-3">{t('sections.liability.p2')}</p>
                </>
            )
        },
        {
            id: 'liens',
            title: t('sections.links.title'),
            content: <p>{t('sections.links.p1')}</p>
        },
        {
            id: 'donnees',
            title: t('sections.data.title'),
            content: (
                <p>
                    {t.rich('sections.data.p1', {
                        privacyLink: (chunks) => (
                            <Link
                                href="/legal/privacy-policy"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {chunks}
                            </Link>
                        )
                    })}
                </p>
            )
        },
        {
            id: 'droit',
            title: t('sections.law.title'),
            content: <p>{t('sections.law.p1')}</p>
        }
    ];

    return (
        <>
            <LegalNavigation/>

            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 mt-24 mb-12">
                <header className="text-center mb-10">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                        <FileText className="w-4 h-4"/>
                        {tCommon('badge')}
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold mt-4 gradient-text">{t('title')}</h1>

                    <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">{t('description')}</p>

                    <p className="text-xs text-muted-foreground mt-4">
                        {tCommon('lastUpdatedLabel')}{' '}
                        <span className="text-foreground/80">{lastUpdated}</span>
                    </p>
                </header>

                <section className="max-w-3xl mx-auto space-y-6">
                    {sections.map((s) => (
                        <article
                            key={s.id}
                            id={s.id}
                            className="rounded-xl border border-border bg-background/60 backdrop-blur p-6 shadow-sm hover:shadow-md transition-shadow scroll-mt-28"
                        >
                            <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                            <div
                                className="mt-3 text-sm sm:text-base text-muted-foreground leading-relaxed break-words [hyphens:none]">
                                {s.content}
                            </div>
                        </article>
                    ))}

                    <div className="rounded-xl border border-border bg-background/60 backdrop-blur p-6">
                        <div className="mt-1 flex flex-wrap justify-center gap-4 text-xs">
                            <Link
                                href="/legal/privacy-policy"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {tCommon('links.readPrivacy')}
                            </Link>

                            <span className="hidden sm:inline text-muted-foreground" aria-hidden="true">•</span>

                            <Link
                                href="/legal/terms"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {tCommon('links.readTerms')}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}