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

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Briefcase, Code, ExternalLink, GraduationCap, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TimelineLink {
    label: string;
    href: string;
}

interface TimelineDetailLink {
    labelKey: string;
    href: string;
}

type TextSpan = { type: 'text' | 'bold'; value: string };
type TextValue = string | TextSpan[];

type DescriptionBlock =
    | { type: 'text'; value: TextValue }
    | { type: 'bullets'; items: string[] };

interface TimelineItem {
    id: string;
    type: 'formation' | 'experience';
    titleKey: string;
    descriptionKey: string;
    organization: string;
    period: string;
    icon: 'graduation' | 'briefcase' | 'code' | 'shield';
    links?: TimelineLink[];
    detailLink?: TimelineDetailLink;
}

const timelineData: TimelineItem[] = [
    {
        id: '1',
        type: 'formation',
        titleKey: 'timelineData.1.title',
        descriptionKey: 'timelineData.1.description',
        organization: 'Lycée Louis Rascol | 10 Rue de la République | 81000 Albi',
        period: 'timelineData.1.period',
        icon: 'graduation'
    },
    {
        id: '2',
        type: 'experience',
        titleKey: 'timelineData.2.title',
        descriptionKey: 'timelineData.2.description',
        organization: 'TryHackMe',
        period: 'timelineData.2.period',
        icon: 'graduation',
        links: [{ label: 'TryHackMe', href: 'https://tryhackme.com' }],
        detailLink: { labelKey: 'seeDetails', href: '/parcours/tryhackme' }
    },
    {
        id: '3',
        type: 'formation',
        titleKey: 'timelineData.3.title',
        descriptionKey: 'timelineData.3.description',
        organization: 'OpenClassrooms & Coursera',
        period: 'timelineData.3.period',
        icon: 'graduation',
        links: [
            { label: 'OpenClassrooms', href: 'https://openclassrooms.com/fr/paths/1051-technicien-informatique' }
        ],
        detailLink: { labelKey: 'seeDetails', href: '/parcours/oc-technicien' }
    },
    {
        id: '4',
        type: 'formation',
        titleKey: 'timelineData.4.title',
        descriptionKey: 'timelineData.4.description',
        organization: 'OpenClassrooms & Coursera',
        period: 'timelineData.4.period',
        icon: 'graduation',
        links: [
            { label: 'OpenClassrooms', href: 'https://openclassrooms.com' },
            { label: 'Coursera', href: 'https://www.coursera.org' }
        ]
    },
    {
        id: '5',
        type: 'formation',
        titleKey: 'timelineData.5.title',
        descriptionKey: 'timelineData.5.description',
        organization: 'OpenClassrooms',
        period: 'timelineData.5.period',
        icon: 'graduation',
        links: [{ label: 'OpenClassrooms', href: 'https://openclassrooms.com/fr/paths/900-integrateur-web' }],
        detailLink: { labelKey: 'seeDetails', href: '/parcours/oc-integrateur-web' }
    }
];

const iconMap = {
    graduation: GraduationCap,
    briefcase: Briefcase,
    code: Code,
    shield: Shield
} as const;

type FilterType = 'all' | 'formation' | 'experience';

function isTextSpanArray(value: unknown): value is TextSpan[] {
    return Array.isArray(value) && value.every(v => {
        if (!v || typeof v !== 'object') return false;
        const s = v as any;
        return (
                   s.type === 'text' || s.type === 'bold'
               ) && typeof s.value === 'string';
    });
}

function isDescriptionBlocks(value: unknown): value is DescriptionBlock[] {
    return Array.isArray(value) && value.every(block => {
        if (!block || typeof block !== 'object') return false;
        const b = block as any;

        if (b.type === 'text') {
            return typeof b.value === 'string' || isTextSpanArray(b.value);
        }

        if (b.type === 'bullets') {
            return Array.isArray(b.items) && b.items.every((x: any) => typeof x === 'string');
        }

        return false;
    });
}

function renderTextValue(value: TextValue, keyPrefix: string) {
    if (typeof value === 'string') return value;

    return value.map((span, idx) => {
        if (span.type === 'bold') {
            return (
                <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-foreground">
                    {span.value}
                </strong>
            );
        }

        return <span key={`${keyPrefix}-t-${idx}`}>{span.value}</span>;
    });
}

export default function Timeline() {
    const t = useTranslations('parcours');
    const shouldReduceMotion = useReducedMotion();
    const [filter, setFilter] = useState<FilterType>('all');

    const filtered = useMemo(
        () => (
            filter === 'all' ? timelineData : timelineData.filter(i => i.type === filter)
        ),
        [filter]
    );

    const typeCounts = useMemo(
        () => (
            {
                formation: timelineData.filter(i => i.type === 'formation').length,
                experience: timelineData.filter(i => i.type === 'experience').length
            }
        ),
        []
    );

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
            filter: shouldReduceMotion ? 'blur(0px)' : 'blur(8px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
        }
    };

    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
                delayChildren: shouldReduceMotion ? 0 : 0.08
            }
        }
    };

    const itemVariant = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 16,
            filter: shouldReduceMotion ? 'blur(0px)' : 'blur(6px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
            transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : -8,
            filter: shouldReduceMotion ? 'blur(0px)' : 'blur(4px)',
            transition: { duration: 0.2 }
        }
    };

    const filters: { key: FilterType; label: string; disabled: boolean }[] = [
        { key: 'all', label: t('filterAll'), disabled: false },
        { key: 'formation', label: t('filterFormation'), disabled: typeCounts.formation === 0 },
        { key: 'experience', label: t('filterExperience'), disabled: typeCounts.experience === 0 }
    ];

    const renderDescription = (key: string) => {
        const raw = t.raw(key) as unknown;

        if (typeof raw === 'string') {
            return <p className="text-sm text-foreground/80 leading-relaxed">{raw}</p>;
        }

        if (isDescriptionBlocks(raw)) {
            return (
                <div className="text-sm text-foreground/80 leading-relaxed space-y-2">
                    {raw.map((block, idx) => {
                        if (block.type === 'text') {
                            return (
                                <p key={`${key}-text-${idx}`}>
                                    {renderTextValue(block.value, `${key}-text-${idx}`)}
                                </p>
                            );
                        }

                        return (
                            <ul key={`${key}-bullets-${idx}`} className="list-disc pl-5 space-y-1">
                                {block.items.map((it, j) => (
                                    <li key={`${key}-li-${idx}-${j}`}>{it}</li>
                                ))}
                            </ul>
                        );
                    })}
                </div>
            );
        }

        return <p className="text-sm text-foreground/80 leading-relaxed">{t(key)}</p>;
    };

    return (
        <section id="parcours" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <motion.div
                className="max-w-4xl mx-auto relative z-10"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.15 }}
            >
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h2>

                <motion.div className="flex flex-wrap gap-2 mb-10" variants={fadeUp}>
                    {filters.map(f => (
                        <Button
                            key={f.key}
                            variant={filter === f.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setFilter(f.key)}
                            disabled={f.disabled}
                        >
                            {f.label}
                        </Button>
                    ))}
                </motion.div>

                <motion.div className="relative" variants={fadeUp}>
                    <div
                        className="absolute left-3.75 md:left-1/2 md:-translate-x-px top-0 bottom-0 w-0.5 bg-linear-to-b from-gradient-start via-gradient-end to-transparent opacity-30" />

                    <AnimatePresence mode="popLayout" initial={false}>
                        {filtered.map((item, index) => {
                            const Icon = iconMap[item.icon];
                            const isEven = index % 2 === 0;

                            return (
                                <motion.div
                                    key={item.id}
                                    className="relative mb-10 last:mb-0"
                                    variants={itemVariant}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    layout
                                >
                                    <div
                                        className="absolute left-3.75 md:left-1/2 -translate-x-1/2 top-6 w-3 h-3 rounded-full z-10"
                                        style={{
                                            background: `linear-gradient(135deg, var(--gradient-start), var(--gradient-end))`,
                                            boxShadow: `0 0 0 4px var(--background)`
                                        }}
                                    />

                                    <div
                                        className={`
                                            pl-10 md:pl-0
                                            md:flex md:items-start
                                            ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}
                                        `}
                                    >
                                        <div className="hidden md:block md:w-1/2" />

                                        <div className={`md:w-1/2 ${isEven ? 'md:pl-8' : 'md:pr-8'}`}>
                                            <div
                                                className="card-accent group relative rounded-xl border border-border bg-card p-5 hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300">
                                                {item.detailLink ? (
                                                    <Link
                                                        href={item.detailLink.href}
                                                        className="absolute right-5 top-5 inline-flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground cursor-pointer"
                                                    >
                                                        <span>{t(item.detailLink.labelKey)}</span>
                                                        <span
                                                            className="transition-transform duration-200 group-hover:translate-x-0.5">
                                                            <ExternalLink className="w-3.5 h-3.5" />
                                                        </span>
                                                    </Link>
                                                ) : null}

                                                <div className="flex items-center gap-3 mb-3">
                                                    <div
                                                        className="p-2 rounded-lg bg-muted group-hover:bg-linear-to-br group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300">
                                                        <Icon
                                                            className="w-4 h-4 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                                                    </div>

                                                    <span
                                                        className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                        {item.type
                                                         === 'formation' ? t('typeFormation') : t('typeExperience')}
                                                    </span>
                                                </div>

                                                <h3 className="text-base font-semibold text-foreground mb-1">
                                                    {t(item.titleKey)}
                                                </h3>

                                                {item.links?.length ? (
                                                    <div className="text-sm mb-1 inline-flex flex-wrap items-center">
                                                        {item.links.slice(0, 2).map((l, idx) => {
                                                            const isTwo = item.links!.length >= 2;
                                                            const showIconLeft = !isTwo || idx === 0;
                                                            const showIconRight = isTwo && idx === 1;

                                                            return (
                                                                <span key={`${item.id}-link-${idx}`}
                                                                      className="inline-flex items-center">
                                                                    <a
                                                                        href={l.href}
                                                                        target="_blank"
                                                                        rel="noreferrer"
                                                                        className="inline-flex items-center text-blue-500 hover:text-blue-400 transition-colors cursor-pointer"
                                                                    >
                                                                        {showIconLeft ? <ExternalLink
                                                                            className="w-3.5 h-3.5 mr-1.5" /> : null}
                                                                        <span>{l.label}</span>
                                                                        {showIconRight ? <ExternalLink
                                                                            className="w-3.5 h-3.5 ml-1.5" /> : null}
                                                                    </a>

                                                                    {idx === 0 && isTwo ? (
                                                                        <span
                                                                            className="mx-2 text-muted-foreground/70">&amp;</span>
                                                                    ) : null}
                                                                </span>
                                                            );
                                                        })}
                                                    </div>
                                                ) : (
                                                    <p className="text-sm text-muted-foreground mb-1">{item.organization}</p>
                                                )}

                                                <p className="text-xs text-muted-foreground/70 mb-3">{t(item.period)}</p>

                                                {renderDescription(item.descriptionKey)}
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </AnimatePresence>
                </motion.div>
            </motion.div>
        </section>
    );
}