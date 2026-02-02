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
import Image from 'next/image';
import { ExternalLink, GitCommit, Users } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Contributor } from '@/lib/github/types';
import {
    Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious
} from '@/components/ui/pagination';
import { Spinner } from '@/components/ui/spinner';

interface ContributorsSectionProps {
    contributors: Contributor[];
    isLoading: boolean;
    totalCommits?: number;
}

const ITEMS_PER_PAGE = 3;

export function ContributorsSection({
    contributors, isLoading, totalCommits: totalCommitsProp
}: ContributorsSectionProps) {
    const t = useTranslations('githubStats.contributors');
    const [currentPage, setCurrentPage] = useState(0);

    const totalPages = Math.ceil(contributors.length / ITEMS_PER_PAGE);
    const totalCommits = useMemo(
        () => totalCommitsProp ?? contributors.reduce((sum, c) => sum + c.commits, 0),
        [contributors, totalCommitsProp]
    );

    const paginatedContributors = useMemo(() => {
        const start = currentPage * ITEMS_PER_PAGE;
        return contributors.slice(start, start + ITEMS_PER_PAGE);
    }, [contributors, currentPage]);

    const canPrev = currentPage > 0;
    const canNext = currentPage < totalPages - 1;

    const goPrev = () => setCurrentPage((p) => Math.max(0, p - 1));
    const goNext = () => setCurrentPage((p) => Math.min(totalPages - 1, p + 1));

    if (isLoading) {
        return (
            <div
                className="rounded-xl border border-blue-500/10 bg-card/50 p-4 sm:p-6 min-h-50 flex flex-col items-center justify-center">
                <Spinner className="w-8 h-8 text-purple-500 mb-3"/>
                <span className="text-sm text-muted-foreground">{t('title', { count: 0 })}...</span>
            </div>
        );
    }

    if (contributors.length === 0) {
        return null;
    }

    return (
        <div className="rounded-xl border border-blue-500/10 bg-card/50 p-4 sm:p-6">
            <div className="flex items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-500"/>
                    <h3 className="text-lg font-medium">{t('title', { count: contributors.length })}</h3>
                </div>
                <span className="text-sm text-muted-foreground">
                    {t('total', { count: contributors.length })}
                </span>
            </div>

            <div className="space-y-2">
                {paginatedContributors.map((contributor, idx) => {
                    const globalIndex = currentPage * ITEMS_PER_PAGE + idx;
                    const percentage = totalCommits > 0
                        ? Math.round((
                                         contributor.commits / totalCommits
                                     ) * 100)
                        : 0;

                    return (
                        <a
                            key={contributor.username}
                            href={contributor.profileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                                'group flex items-center gap-3 p-3 rounded-xl w-full',
                                'bg-linear-to-r from-purple-500/5 to-transparent',
                                'border border-purple-500/10 hover:border-purple-500/30',
                                'transition-all duration-300',
                                'hover:shadow-lg hover:shadow-purple-500/5'
                            )}
                        >
                            <div className="relative shrink-0">
                                <Image
                                    src={contributor.avatar}
                                    alt={contributor.username}
                                    width={44}
                                    height={44}
                                    className="rounded-full ring-2 ring-purple-500/20 group-hover:ring-purple-500/40 transition-all"
                                />
                                {globalIndex === 0 && (
                                    <span
                                        className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                        1
                                    </span>
                                )}
                            </div>

                            <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium text-sm group-hover:text-purple-500 transition-colors">
                                        {contributor.username}
                                    </span>
                                    <ExternalLink
                                        className="w-3 h-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0"/>
                                </div>
                                <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                                    <GitCommit className="w-3 h-3 shrink-0"/>
                                    <span>{contributor.commits.toLocaleString()} commits</span>
                                    <span className="text-purple-500/70">({percentage}%)</span>
                                </div>
                            </div>
                        </a>
                    );
                })}
            </div>

            {totalPages > 1 && (
                <Pagination className="mt-4">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (canPrev) goPrev();
                                }}
                                className={cn(
                                    'h-8 px-2',
             !canPrev && 'pointer-events-none opacity-50'
                                )}
                            />
                        </PaginationItem>

                        {Array.from({ length: totalPages }, (_, i) => (
                            <PaginationItem key={i}>
                                <PaginationLink
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setCurrentPage(i);
                                    }}
                                    isActive={currentPage === i}
                                    className="h-8 w-8"
                                >
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault();
                                    if (canNext) goNext();
                                }}
                                className={cn(
                                    'h-8 px-2',
             !canNext && 'pointer-events-none opacity-50'
                                )}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
}
