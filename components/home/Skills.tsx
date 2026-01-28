'use client';

import { useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import SkillIcon from './SkillIcon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useIsMobile } from '@/hooks/use-mobile';
import {
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

type Category = 'all' | 'frontend' | 'backend' | 'tools' | 'other';

interface Skill {
    name: string;
    category: Category;
}

const skills: Skill[] = [
    { name: 'HTML5', category: 'frontend' },
    { name: 'JavaScript', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'CSS', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'NextJS', category: 'frontend' },
    { name: 'Responsive Design', category: 'frontend' },
    { name: 'NodeJS', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'API REST', category: 'backend' },
    { name: 'Git', category: 'tools' },
    { name: 'GitHub', category: 'tools' },
    { name: 'EmailJS', category: 'tools' },
    { name: 'Cybersecurity', category: 'other' },
    { name: 'SEO', category: 'other' }
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
    const tDescriptions = useTranslations('skills.descriptions');
    const isMobile = useIsMobile();

    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [page, setPage] = useState(0);

    const filteredSkills = useMemo(() => {
        return selectedCategory === 'all' ? skills : skills.filter((s) => s.category === selectedCategory);
    }, [selectedCategory]);

    const pageSize = isMobile ? MOBILE_PAGE_SIZE : DESKTOP_PAGE_SIZE;

    const pages = useMemo(() => {
        const out: Skill[][] = [];
        for (let i = 0; i < filteredSkills.length; i += pageSize) {
            out.push(filteredSkills.slice(i, i + pageSize));
        }
        return out.length ? out : [[]];
    }, [filteredSkills, pageSize]);

    const pageCount = pages.length;

    useEffect(() => {
        setPage(0);
    }, [selectedCategory, pageSize]);

    useEffect(() => {
        if (page > pageCount - 1) setPage(Math.max(0, pageCount - 1));
    }, [page, pageCount]);

    const categories: { key: Category; label: string }[] = [
        { key: 'all', label: t('categories.all') },
        { key: 'frontend', label: t('categories.frontend') },
        { key: 'backend', label: t('categories.backend') },
        { key: 'tools', label: t('categories.tools') },
        { key: 'other', label: t('categories.other') }
    ];

    const canPrev = page > 0;
    const canNext = page < pageCount - 1;

    const goPrev = () => setPage((p) => Math.max(0, p - 1));
    const goNext = () => setPage((p) => Math.min(pageCount - 1, p + 1));

    const pageItems = useMemo(() => getPageItems(page, pageCount), [page, pageCount]);

    return (
        <section id="skills" className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text">
                    {t('title')}
                </h2>

                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                    {categories.map((category) => (
                        <Button
                            key={category.key}
                            variant={selectedCategory === category.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedCategory(category.key)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>

                <TooltipProvider delayDuration={300}>
                    <div className="relative">
                        <div className="overflow-hidden">
                            <div
                                className="flex transition-transform duration-500 ease-out"
                                style={{ transform: `translateX(-${page * 100}%)` }}
                            >
                                {pages.map((skillsPage, pageIndex) => {
                                    const fillers = Math.max(0, pageSize - skillsPage.length);
                                    return (
                                        <div key={pageIndex} className="w-full shrink-0">
                                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                                                {skillsPage.map((skill, index) => {
                                                    let description: string | undefined;
                                                    try {
                                                        description = tDescriptions(skill.name as any);
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
                                                        <Tooltip key={`${pageIndex}-${index}`}>
                                                            <TooltipTrigger asChild>
                                                                <div
                                                                    className="group rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer">
                                                                    <div
                                                                        className="p-2 rounded-lg bg-muted group-hover:bg-foreground/10 transition-all duration-300">
                                                                        <SkillIcon
                                                                            name={skill.name}
                                                                            className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition-colors duration-300"
                                                                        />
                                                                    </div>
                                                                    <h3 className="text-sm font-medium text-foreground/80 text-center group-hover:text-foreground transition-colors duration-300">
                                                                        {skill.name}
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
                                                    isActive={it === page}
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
            </div>
        </section>
    );
}