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
import { ArrowLeft, ExternalLink, FileCheck2, GraduationCap, Shield } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Link } from '@/i18n/routing';
import { CvDownloadButton } from '@/components/cv/ProfileBlock';
import { getTranslations } from 'next-intl/server';

const CERTIFICATE_PATH = '/parcours/tryhackme/pre-security-certificat.pdf';
const CERTIFICATE_PREVIEW_PATH = '/parcours/tryhackme/pre-security-certificat.webp';
const CERTIFICATE_FILE_NAME = 'pre-security-certificat.pdf';

const PARCOURS_LINKS = [
    { href: '/parcours/tryhackme', label: 'parcoursLinksLabel.thm' },
    { href: '/parcours/oc-technicien', label: 'parcoursLinksLabel.technicien' },
    { href: '/parcours/oc-integrateur-web', label: 'parcoursLinksLabel.webIntegrator' }
] as const;

const MODULE_KEY_REGEX = /^module(\d+)$/;
const BULLET_KEY_REGEX = /^puce(\d+)$/;
const SUB_BULLET_KEY_REGEX = /^puce(\d+)-(\d+)$/;

type ModuleBullet = {
    text: string;
    subBullets: string[];
};

type ModuleItem = {
    id: string;
    title: string;
    bullets: ModuleBullet[];
};

function getNumericSuffix(value: string): number {
    const matches = value.match(/\d+$/);
    if (!matches) return Number.MAX_SAFE_INTEGER;
    return Number.parseInt(matches[0], 10);
}

function getModuleSubBullets(moduleData: Record<string, unknown>, bulletIndex: number): string[] {
    return Object.entries(moduleData)
                 .filter(([key, value]) => {
                     const match = key.match(SUB_BULLET_KEY_REGEX);
                     return Boolean(match && Number.parseInt(match[1], 10) === bulletIndex && typeof value
                                    === 'string');
                 })
                 .sort((a, b) => {
                     const aMatch = a[0].match(SUB_BULLET_KEY_REGEX);
                     const bMatch = b[0].match(SUB_BULLET_KEY_REGEX);
                     const aIndex = aMatch ? Number.parseInt(aMatch[2], 10) : 0;
                     const bIndex = bMatch ? Number.parseInt(bMatch[2], 10) : 0;
                     return aIndex - bIndex;
                 })
                 .map(([, value]) => value as string);
}

function getModulesFromTranslations(articleData: Record<string, unknown>): ModuleItem[] {
    return Object.entries(articleData)
                 .filter(([moduleKey, moduleValue]) => MODULE_KEY_REGEX.test(moduleKey) && Boolean(moduleValue)
                                                       && typeof moduleValue === 'object')
                 .sort((a, b) => getNumericSuffix(a[0]) - getNumericSuffix(b[0]))
                 .map(([moduleKey, moduleValue]) => {
                     const moduleData = moduleValue as Record<string, unknown>;
                     const title = typeof moduleData.title === 'string' ? moduleData.title : moduleKey;

                     const bullets = Object.entries(moduleData)
                                           .filter(([key, value]) => BULLET_KEY_REGEX.test(key) && typeof value
                                                                     === 'string')
                                           .sort((a, b) => getNumericSuffix(a[0]) - getNumericSuffix(b[0]))
                                           .map(([key, value]) => {
                                               const match = key.match(BULLET_KEY_REGEX);
                                               const bulletIndex = match ? Number.parseInt(match[1], 10) : 0;

                                               return {
                                                   text: value as string,
                                                   subBullets: getModuleSubBullets(moduleData, bulletIndex)
                                               };
                                           });

                     return {
                         id: moduleKey,
                         title,
                         bullets
                     };
                 });
}

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pagesMetadata.tryhackme');

    return {
        title: 'TryHackMe',
        description: t('description'),
        robots: { index: false, follow: false }
    };
}

export default async function TryHackMeDetailPage() {
    const tTopBar = await getTranslations('parcoursDetails');
    const t = await getTranslations('parcoursDetails.tryhackme');
    const articleData = t.raw('article');
    const safeArticleData = (
        articleData && typeof articleData === 'object'
    )
        ? (
            articleData as Record<string, unknown>
        )
        : {};
    const modules = getModulesFromTranslations(safeArticleData);

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
                            const isActive = item.href === '/parcours/tryhackme';
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
                            className="inline-flex items-center gap-1.5 rounded-full bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-600 dark:text-blue-400">
                            <FileCheck2 className="h-3.5 w-3.5" />
                            {t('badges.2')}
                        </span>
                    </div>
                </header>

                <section className="mt-6">
                    <article
                        className="rounded-2xl border border-border bg-card p-6 sm:p-7 transition-colors hover:border-blue-500/25">
                        <Accordion type="single" collapsible className="w-full space-y-3">
                            {modules.map((module) => (
                                <AccordionItem
                                    key={module.id}
                                    value={module.id}
                                    className="rounded-xl border-2 border-border/85 border-b-0 bg-background/30 shadow-sm transition-colors data-[state=open]:border-blue-500/45 data-[state=open]:bg-background"
                                >
                                    <AccordionTrigger
                                        className="px-4 py-3 text-left text-sm font-semibold text-foreground transition-colors hover:bg-muted/40 hover:no-underline sm:text-base"
                                    >
                                        {module.title}
                                    </AccordionTrigger>

                                    <AccordionContent className="border-t-2 border-border/80 px-4 pb-4 pt-3">
                                        <ul className="list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                                            {module.bullets.map((bullet, bulletIndex) => (
                                                <li key={`${module.id}-bullet-${bulletIndex}`}>
                                                    <span>{bullet.text}</span>
                                                    {bullet.subBullets.length > 0 ? (
                                                        <ul className="mt-2 list-[circle] space-y-1 pl-5">
                                                            {bullet.subBullets.map((subBullet, subBulletIndex) => (
                                                                <li key={`${module.id}-sub-bullet-${bulletIndex}-${subBulletIndex}`}>
                                                                    {subBullet}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    ) : null}
                                                </li>
                                            ))}
                                        </ul>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </article>
                </section>

                <section
                    className="mt-6 rounded-2xl border border-border bg-card p-6 sm:p-7 transition-colors hover:border-blue-500/25">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                        <h2 className="text-base font-semibold text-foreground">{t('certificat.title')}</h2>
                        <div className="flex flex-wrap gap-2">
                            <CvDownloadButton
                                label={t('certificat.buttonDownload')}
                                loadingLabel={t('certificat.buttonDownloading')}
                                href={CERTIFICATE_PATH}
                                filename={CERTIFICATE_FILE_NAME}
                            />
                            <Button asChild size="sm" variant="outline">
                                <a href={CERTIFICATE_PATH} target="_blank" rel="noreferrer">
                                    <ExternalLink className="h-4 w-4" />
                                    {t('certificat.buttonOpenPDF')}
                                </a>
                            </Button>
                        </div>
                    </div>

                    <div className="mt-5 overflow-hidden rounded-xl border border-border bg-muted/30">
                        <Image
                            src={CERTIFICATE_PREVIEW_PATH}
                            alt="AperÃ§u du certificat TryHackMe Pre-Security"
                            width={1400}
                            height={980}
                            className="h-auto w-full object-contain"
                            priority
                        />
                    </div>
                </section>
            </div>
        </div>
    );
}
