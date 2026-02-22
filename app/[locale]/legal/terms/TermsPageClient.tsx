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
import { useContactModal } from '@/hooks/useContactModal';
import { Link } from '@/i18n/routing';
import { useFormatter, useTranslations } from 'next-intl';
import { useCallback } from 'react';

type DefinitionItem = { label: string; text: string };
type ListItem = string;

type Section = {
    id: string;
    title: string;
    content: React.ReactNode;
};

const LAST_UPDATED_ISO = '2026-01-31';

export default function TermsPageClient() {
    const tCommon = useTranslations('legal.common');
    const t = useTranslations('legal.terms');
    const format = useFormatter();
    const { openContact } = useContactModal();

    const handleEmailClick = useCallback(() => {
        void openContact();
    }, [openContact]);

    const lastUpdated = format.dateTime(new Date(LAST_UPDATED_ISO), { dateStyle: 'long' });

    const definitions = t.raw('sections.definitions.items') as DefinitionItem[];
    const acceptableUse = t.raw('sections.acceptableUse.items') as ListItem[];
    const ipNotAllowed = t.raw('sections.ip.notAllowed') as ListItem[];
    const contactRights = t.raw('sections.contact.rights') as ListItem[];

    const sections: Section[] = [
        {
            id: 'editeur',
            title: t('sections.editor.title'),
            content: (
                <>
                    <p>{t('sections.editor.intro')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{t('sections.editor.publisherTitle')}</span>
                            <br />
                            {t('sections.editor.publisherNameLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.editor.publisherNameValue')}</span>
                            <br />
                            {t('sections.editor.publisherEmailLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.editor.publisherEmailValue')}</span>
                        </p>

                        <p className="mt-3 text-sm text-muted-foreground">
                            <span className="font-medium text-foreground">{t('sections.editor.hostTitle')}</span>
                            <br />
                            {t('sections.editor.hostNameLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.editor.hostNameValue')}</span>
                            <br />
                            {t('sections.editor.hostAddressLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.editor.hostAddressValue')}</span>
                            <br />
                            {t('sections.editor.hostWebsiteLabel')}{' '}
                            <span className="text-foreground/90">{t('sections.editor.hostWebsiteValue')}</span>
                        </p>
                    </div>

                    <p className="mt-4">
                        {t.rich('sections.editor.contactLine', {
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
            id: 'objet',
            title: t('sections.purpose.title'),
            content: (
                <>
                    <p>{t('sections.purpose.p1')}</p>
                    <p className="mt-3">{t('sections.purpose.p2')}</p>
                </>
            )
        },
        {
            id: 'acces',
            title: t('sections.access.title'),
            content: (
                <>
                    <p>{t('sections.access.p1')}</p>
                    <p className="mt-3">{t('sections.access.p2')}</p>
                </>
            )
        },
        {
            id: 'definitions',
            title: t('sections.definitions.title'),
            content: (
                <ul className="list-disc pl-5 space-y-2">
                    {definitions.map((it, idx) => (
                        <li key={idx}>
                            <span className="font-medium text-foreground">{it.label}</span> {it.text}
                        </li>
                    ))}
                </ul>
            )
        },
        {
            id: 'usage',
            title: t('sections.acceptableUse.title'),
            content: (
                <>
                    <p>{t('sections.acceptableUse.p1')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">{t('sections.acceptableUse.listIntro')}</p>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                            {acceptableUse.map((it, idx) => (
                                <li key={idx}>{it}</li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-4">{t('sections.acceptableUse.example')}</p>
                </>
            )
        },
        {
            id: 'ip',
            title: t('sections.ip.title'),
            content: (
                <>
                    <p>{t('sections.ip.p1')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">{t('sections.ip.notAllowedIntro')}</p>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                            {ipNotAllowed.map((it, idx) => (
                                <li key={idx}>{it}</li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-4">{t('sections.ip.example')}</p>
                </>
            )
        },
        {
            id: 'liens',
            title: t('sections.externalLinks.title'),
            content: (
                <>
                    <p>{t('sections.externalLinks.p1')}</p>
                    <p className="mt-3">{t('sections.externalLinks.p2')}</p>
                </>
            )
        },
        {
            id: 'contact',
            title: t('sections.contact.title'),
            content: (
                <>
                    <p>{t('sections.contact.p1')}</p>

                    <div className="mt-4 rounded-lg border border-border bg-background/50 p-4">
                        <p className="text-sm text-muted-foreground">{t('sections.contact.rightsIntro')}</p>
                        <ul className="mt-2 list-disc pl-5 space-y-2">
                            {contactRights.map((it, idx) => (
                                <li key={idx}>{it}</li>
                            ))}
                        </ul>
                    </div>

                    <p className="mt-4">{t('sections.contact.example')}</p>
                </>
            )
        },
        {
            id: 'donnees',
            title: t('sections.data.title'),
            content: (
                <>
                    <p>{t('sections.data.p1')}</p>
                    <p className="mt-3">{t('sections.data.p2')}</p>
                    <p className="mt-3">{t('sections.data.p3')}</p>
                    <p className="mt-3">
                        {t.rich('sections.data.p4', {
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
                    <p className="mt-4">{t('sections.liability.example')}</p>
                </>
            )
        },
        {
            id: 'securite',
            title: t('sections.security.title'),
            content: (
                <>
                    <p>{t('sections.security.p1')}</p>
                    <p className="mt-3">{t('sections.security.p2')}</p>
                </>
            )
        },
        {
            id: 'modifs',
            title: t('sections.changes.title'),
            content: (
                <>
                    <p>{t('sections.changes.p1')}</p>
                    <p className="mt-3">{t('sections.changes.p2')}</p>
                </>
            )
        },
        {
            id: 'droit',
            title: t('sections.law.title'),
            content: (
                <>
                    <p>{t('sections.law.p1')}</p>
                    <p className="mt-3">{t('sections.law.p2')}</p>
                </>
            )
        }
    ];

    return (
        <>
            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 mt-24 mb-12">
                <header className="text-center mb-10">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-3 py-1 text-xs text-muted-foreground">
                        <FileText className="w-4 h-4" />
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
                        <div className="mt-4 flex flex-wrap justify-center gap-4 text-xs">
                            <Link
                                href="/legal/legal-notice"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {tCommon('links.readLegalNotice')}
                            </Link>

                            <span className="hidden sm:inline text-muted-foreground" aria-hidden="true">•</span>

                            <Link
                                href="/legal/privacy-policy"
                                className="underline underline-offset-4 hover:text-foreground transition-colors"
                            >
                                {tCommon('links.readPrivacy')}
                            </Link>
                        </div>
                    </div>
                </section>
            </div>
        </>
    );
}