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

import type { Metadata } from 'next';
import { ArrowLeft, Calendar, GraduationCap, Shield, Timer } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

const PARCOURS_LINKS = [
    { href: '/parcours/tryhackme', label: 'parcoursLinksLabel.thm' },
    { href: '/parcours/oc-technicien', label: 'parcoursLinksLabel.technicien' },
    { href: '/parcours/oc-integrateur-web', label: 'parcoursLinksLabel.webIntegrator' }
] as const;

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pagesMetadata.webIntegrator');

    return {
        title: t('title'),
        description: t('description'),
        robots: { index: false, follow: false }
    };
}

export default async function OcTechnicienDetailPage() {
    const tTopBar = await getTranslations('parcoursDetails');
    const t = await getTranslations('parcoursDetails.technicien');

    return (
        <div className="min-h-screen w-full bg-background">
            <div className="relative mx-auto max-w-6xl px-6 pb-16 pt-28 sm:px-8 lg:px-12">

                <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                    <div
                        className="absolute left-1/2 top-0 h-105 w-105 -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl" />
                    <div className="absolute right-0 top-60 h-80 w-80 rounded-full bg-blue-500/5 blur-3xl" />
                </div>

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <Link
                        href="/"
                        className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
                        <span>{tTopBar('backHome')}</span>
                    </Link>

                    <nav aria-label="Parcours" className="flex gap-1 rounded-xl bg-muted/50 p-1">
                        {PARCOURS_LINKS.map((item) => {
                            const isActive = item.href === '/parcours/oc-technicien';
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={
                                        isActive
                                            ? 'rounded-lg bg-background px-3 py-1.5 text-xs font-semibold text-foreground shadow-sm transition-all'
                                            : 'rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground'
                                    }
                                >
                                    {tTopBar(item.label)}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <header
                    className="rounded-2xl border border-blue-500/20 border-l-4 border-l-blue-500/50 bg-card p-6 sm:p-8">
                    <div
                        className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                        <Shield className="h-3.5 w-3.5 text-blue-500/70" />
                        {tTopBar('details')}
                    </div>

                    <h1 className="mt-4 text-3xl font-bold sm:text-4xl gradient-text">
                        {t('title')}
                    </h1>

                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                        {t('description')}
                    </p>

                    <div className="mt-5 flex flex-wrap gap-2">
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            <GraduationCap className="h-3.5 w-3.5" />
                            {t('badges.1')}
                        </span>
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            {t('badges.2')}
                        </span>
                        <span
                            className="inline-flex items-center gap-1.5 rounded-full bg-muted px-3 py-1 text-xs font-medium text-muted-foreground">
                            <Timer className="h-3.5 w-3.5" />
                            {t('badges.3')}
                        </span>
                    </div>
                </header>

                <section className="mt-6">
                    <article
                        className="rounded-2xl border border-border bg-card p-6 sm:p-7 transition-colors hover:border-blue-500/25">
                        <div className="space-y-8">
                            <div>
                                <h2 className="text-base font-semibold text-foreground">{t('missions.title')}</h2>

                                <p className="mt-3 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    {t.rich('missions.description', {
                                        strong: (chunks) => <strong
                                            className="font-semibold text-foreground">{chunks}</strong>
                                    })}
                                </p>

                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                    <li>{t('missions.puce1')}</li>
                                    <li>{t('missions.puce2')}</li>
                                    <li>{t('missions.puce3')}</li>
                                </ul>
                            </div>

                            <div>
                                <h2 className="text-base font-semibold text-foreground">{t('nextMissions.title')}</h2>
                                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                    <li>{t('nextMissions.puce1')}</li>
                                    <li>{t('nextMissions.puce2')}</li>
                                    <li>{t('nextMissions.puce3')}</li>
                                    <li>{t('nextMissions.puce4')}</li>
                                    <li>{t('nextMissions.puce5')}</li>
                                    <li>{t('nextMissions.puce6')}</li>
                                    <li>{t('nextMissions.puce7')}</li>
                                </ul>
                            </div>
                        </div>
                    </article>
                </section>
            </div>
        </div>
    );
}
