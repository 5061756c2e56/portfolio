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

type ListItem = string;

type Section = {
    id: string;
    title: string;
    content: React.ReactNode;
};

const LAST_UPDATED_ISO = '2026-01-31';

export default function PolitiqueConfidentialitePage() {
    const tCommon = useTranslations('legal.common');
    const t = useTranslations('legal.privacy-policy');
    const format = useFormatter();
    const { openContact } = useContactModal();

    const lastUpdated = format.dateTime(new Date(LAST_UPDATED_ISO), { dateStyle: 'long' });

    const purposes = t.raw('sections.purposes.items') as ListItem[];
    const recipients = t.raw('sections.recipients.items') as ListItem[];
    const retention = t.raw('sections.retention.items') as ListItem[];

    const sections: Section[] = [
        {
            id: 'intro',
            title: t('sections.intro.title'),
            content: (
                <>
                    <p>{t('sections.intro.p1')}</p>
                    <p className="mt-3">{t('sections.intro.p2')}</p>
                </>
            )
        },
        {
            id: 'responsable',
            title: t('sections.controller.title'),
            content: (
                <>
                    <p>{t('sections.controller.p1')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">
                            {t('sections.controller.nameLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.controller.nameValue')}</span>
                            <br/>
                            {t('sections.controller.emailLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.controller.emailValue')}</span>
                        </p>
                    </div>

                    <p className="mt-4">
                        {t.rich('sections.controller.contactLine', {
                            contactBtn: (chunks) => (
                                <button
                                    type="button"
                                    onClick={() => openContact()}
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
            id: 'donnees',
            title: t('sections.data.title'),
            content: (
                <>
                    <p>{t('sections.data.p1')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{t('sections.data.ipTitle')}</span>{' '}
                            {t('sections.data.ipText')}
                        </p>
                        <p className="mt-3 text-sm text-muted-foreground">
                            <span
                                className="font-medium text-foreground">{t('sections.data.cloudflareTitle')}</span>{' '}
                            {t('sections.data.cloudflareText')}
                        </p>
                    </div>

                    <p className="mt-4">{t('sections.data.p2')}</p>
                </>
            )
        },
        {
            id: 'finalites',
            title: t('sections.purposes.title'),
            content: (
                <>
                    <p>{t('sections.purposes.p1')}</p>
                    <ul className="mt-3 list-disc pl-5 space-y-2">
                        {purposes.map((it, idx) => (
                            <li key={idx}>{it}</li>
                        ))}
                    </ul>
                    <p className="mt-3">{t('sections.purposes.p2')}</p>
                </>
            )
        },
        {
            id: 'destinataires',
            title: t('sections.recipients.title'),
            content: (
                <>
                    <p>{t('sections.recipients.p1')}</p>
                    <ul className="mt-3 list-disc pl-5 space-y-2">
                        {recipients.map((it, idx) => (
                            <li key={idx}>{it}</li>
                        ))}
                    </ul>
                </>
            )
        },
        {
            id: 'conservation',
            title: t('sections.retention.title'),
            content: (
                <ul className="list-disc pl-5 space-y-2">
                    {retention.map((it, idx) => (
                        <li key={idx}>{it}</li>
                    ))}
                </ul>
            )
        },
        {
            id: 'droits',
            title: t('sections.rights.title'),
            content: (
                <>
                    <p>{t('sections.rights.p1')}</p>
                    <p className="mt-3">{t('sections.rights.p2')}</p>
                    <p className="mt-3">{t('sections.rights.p3')}</p>
                </>
            )
        },
        {
            id: 'cookies',
            title: t('sections.cookies.title'),
            content: <p>{t('sections.cookies.p1')}</p>
        },
        {
            id: 'securite',
            title: t('sections.security.title'),
            content: <p>{t('sections.security.p1')}</p>
        },
        {
            id: 'modifs',
            title: t('sections.changes.title'),
            content: <p>{t('sections.changes.p1')}</p>
        }
    ];

    return (
        <>
            <LegalNavigation/>

            <main className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 mt-24 mb-12">
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
                                href="/legal/legal-notice"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {tCommon('links.readLegalNotice')}
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
            </main>
        </>
    );
}