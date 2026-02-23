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
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';
import { motion, useReducedMotion } from 'framer-motion';

type Category = 'all' | 'frontend' | 'backend' | 'tools' | 'other';

interface Skill {
    name: string;
    category: Category;
    iconId: string;
}

const skills: Skill[] = [
    { name: 'HTML5', category: 'frontend', iconId: 'html5' },
    { name: 'JavaScript', category: 'frontend', iconId: 'javascript' },
    { name: 'TypeScript', category: 'frontend', iconId: 'typescript' },
    { name: 'CSS', category: 'frontend', iconId: 'css' },
    { name: 'React', category: 'frontend', iconId: 'react' },
    { name: 'Tailwind CSS', category: 'frontend', iconId: 'tailwind' },
    { name: 'NextJS', category: 'frontend', iconId: 'nextjs' },
    { name: 'Responsive Design', category: 'frontend', iconId: 'responsive' },
    { name: 'NodeJS', category: 'backend', iconId: 'nodejs' },
    { name: 'PostgreSQL', category: 'backend', iconId: 'postgresql' },
    { name: 'API REST', category: 'backend', iconId: 'api' },
    { name: 'Git', category: 'tools', iconId: 'git' },
    { name: 'GitHub', category: 'tools', iconId: 'github' },
    { name: 'EmailJS', category: 'tools', iconId: 'emailjs' },
    { name: 'Cybersecurity', category: 'other', iconId: 'cybersecurity' },
    { name: 'SEO', category: 'other', iconId: 'seo' }
];

const MOBILE_PAGE_SIZE = 4;
const DESKTOP_PAGE_SIZE = 8;

type PageItem = number | 'ellipsis';

function getPageItems(current: number, total: number): PageItem[] {
    if (total <= 5) return Array.from({ length: total }, (_, i) => i);

    const last = total - 1;

    if (current <= 2) return [0, 1, 2, 3, 'ellipsis', last];
    if (current >= total - 3) return [0, 'ellipsis', last - 3, last - 2, last - 1, last];

    return [0, 'ellipsis', current - 1, current, current + 1, 'ellipsis', last];
}

export default function Skills() {
    const t = useTranslations('skills');
    const tLabels = useTranslations('skills.labels');
    const tDescriptions = useTranslations('skills.descriptions');
    const isMobile = useIsMobile();
    const shouldReduceMotion = useReducedMotion();

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 16,
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

    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [page, setPage] = useState(0);

    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const filteredSkills = useMemo(() => {
        return selectedCategory === 'all'
            ? skills
            : skills.filter((s) => s.category === selectedCategory);
    }, [selectedCategory]);

    const pages = useMemo(() => {
        const out: Skill[][] = [];
        for (let i = 0; i < filteredSkills.length; i += pageSize) {
            out.push(filteredSkills.slice(i, i + pageSize));
        }
        return out.length ? out : [[]];
    }, [filteredSkills, pageSize]);

    const pageCount = pages.length;

    const clampedPage = page >= pageCount && pageCount > 0 ? Math.max(0, pageCount - 1) : page;
    if (clampedPage !== page) {
        setPage(clampedPage);
    }

    const categories: { key: Category; label: string }[] = [
        { key: 'all', label: t('categories.all') },
        { key: 'frontend', label: t('categories.frontend') },
        { key: 'backend', label: t('categories.backend') },
        { key: 'tools', label: t('categories.tools') },
        { key: 'other', label: t('categories.other') }
    ];

    const handleSelectCategory = (key: Category) => {
        if (key === selectedCategory) return;
        setSelectedCategory(key);
        setPage(0);
    };

    const safePage = Math.max(0, Math.min(page, pageCount - 1));
    const canPrev = safePage > 0;
    const canNext = safePage < pageCount - 1;

    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));

    const pageItems = useMemo(() => getPageItems(safePage, pageCount), [safePage, pageCount]);

    type LabelKey = Parameters<typeof tLabels>[0];
    type DescKey = Parameters<typeof tDescriptions>[0];

    return (
        <section id="skills" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <motion.div
                className="max-w-4xl mx-auto relative z-10"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
            >
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h2>

                <motion.div className="flex flex-wrap gap-2 mb-6 sm:mb-8" variants={fadeUp}>
                    {categories.map((category) => (
                        <Button
                            key={category.key}
                            variant={selectedCategory === category.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleSelectCategory(category.key)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </motion.div>

                <motion.div variants={fadeUp}>
                    <TooltipProvider delayDuration={300}>
                        <div className="relative">
                            <div className="overflow-hidden pt-1 -mt-1">
                                <div
                                    className="flex transition-transform duration-500 ease-out"
                                    style={{ transform: `translateX(-${safePage * 100}%)` }}
                                >
                                    {pages.map((skillsPage, pageIndex) => {
                                        const fillers = Math.max(0, pageSize - skillsPage.length);

                                        return (
                                            <div key={pageIndex} className="w-full shrink-0">
                                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                    {skillsPage.map((skill) => {
                                                        let label = skill.name;
                                                        let description: string | undefined;

                                                        try {
                                                            const translatedLabel = tLabels(skill.name as unknown as LabelKey);

                                                            if (
                                                                translatedLabel &&
                                                                translatedLabel !== skill.name &&
                                                                !translatedLabel.startsWith('skills.labels.')
                                                            ) {
                                                                label = translatedLabel;
                                                            }
                                                        } catch {
                                                            label = skill.name;
                                                        }

                                                        try {
                                                            description = tDescriptions(skill.name as unknown as DescKey);

                                                            if (
                                                                !description ||
                                                                description === skill.name ||
                                                                description.startsWith('skills.descriptions.')
                                                            ) {
                                                                description = undefined;
                                                            }
                                                        } catch {
                                                            description = undefined;
                                                        }

                                                        return (
                                                            <Tooltip key={skill.name}>
                                                                <TooltipTrigger asChild>
                                                                    <div
                                                                        className="card-accent group rounded-lg border border-border bg-card/80 backdrop-blur-sm p-4 hover:border-foreground/20 hover:border-t-blue-500/40 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer"
                                                                    >
                                                                        <div
                                                                            className="p-2 rounded-lg bg-muted group-hover:bg-linear-to-br group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300"
                                                                        >
                                                                            <svg
                                                                                className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition-colors duration-300">
                                                                                <use
                                                                                    href={`/icons.svg#icon-${skill.iconId}`}/>
                                                                            </svg>
                                                                        </div>
                                                                        <h3 className="text-sm font-medium text-foreground/80 text-center group-hover:text-foreground transition-colors duration-300">
                                                                            {label}
                                                                        </h3>
                                                                    </div>
                                                                </TooltipTrigger>

                                                                {description && (
                                                                    <TooltipContent side="bottom" sideOffset={8}>
                                                                        <p className="leading-relaxed">{description}</p>
                                                                    </TooltipContent>
                                                                )}
                                                            </Tooltip>
                                                        );
                                                    })}

                                                    {Array.from({ length: fillers }).map((_, i) => (
                                                        <div
                                                            key={`f-${pageIndex}-${i}`}
                                                            className="invisible pointer-events-none rounded-lg border border-border bg-card p-4 flex flex-col items-center justify-center gap-3"
                                                        >
                                                            <div className="p-2 rounded-lg bg-muted">
                                                                <div className="w-6 h-6"/>
                                                            </div>
                                                            <div className="text-sm">.</div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {pageCount > 1 && (
                                <Pagination className="mt-6">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (canPrev) goPrev();
                                                }}
                                                className={!canPrev ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>

                                        {pageItems.map((it, idx) =>
                                            it === 'ellipsis' ? (
                                                <PaginationItem key={`e-${idx}`}>
                                                    <PaginationEllipsis/>
                                                </PaginationItem>
                                            ) : (
                                                <PaginationItem key={it}>
                                                    <PaginationLink
                                                        href="#"
                                                        isActive={it === safePage}
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            setPage(it);
                                                        }}
                                                    >
                                                        {it + 1}
                                                    </PaginationLink>
                                                </PaginationItem>
                                            )
                                        )}

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (canNext) goNext();
                                                }}
                                                className={!canNext ? 'pointer-events-none opacity-50' : ''}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </div>
                    </TooltipProvider>
                </motion.div>
            </motion.div>
        </section>
    );
}
