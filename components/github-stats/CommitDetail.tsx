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

import { useTranslations } from 'next-intl';
import { Calendar, ExternalLink, FileText, GitCommit, Minus, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommitDetail as CommitDetailType } from '@/lib/github/types';
import { Spinner } from '@/components/ui/spinner';

interface CommitDetailPanelProps {
    commit: CommitDetailType | null;
    isLoading: boolean;
}

export function CommitDetailPanel({ commit, isLoading }: CommitDetailPanelProps) {
    const t = useTranslations('githubStats.commitDetail');

    if (isLoading) {
        return (
            <div className={cn(
                'rounded-xl border border-blue-500/20 bg-card/80 backdrop-blur-sm',
                'p-8 flex flex-col items-center justify-center min-h-[200px]',
                'shadow-[0_0_30px_rgba(59,130,246,0.05)]'
            )}>
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"/>
                    <Spinner className="w-10 h-10 text-blue-500 relative"/>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{t('loading')}</p>
            </div>
        );
    }

    if (!commit) return null;

    return (
        <div className={cn(
            'rounded-xl border border-blue-500/20 bg-card/80 backdrop-blur-sm overflow-hidden',
            'shadow-[0_0_30px_rgba(59,130,246,0.05)]',
            'transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]'
        )}>
            <div className="p-4 sm:p-5 border-b border-blue-500/10 bg-blue-500/5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <GitCommit className="w-4 h-4 text-blue-500"/>
                            </div>
                            <code
                                className="text-sm font-mono bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg border border-blue-500/20">
                                {commit.shortSha}
                            </code>
                        </div>
                        <p className="font-medium text-base sm:text-lg break-words leading-relaxed">
                            {commit.messageTitle}
                        </p>
                        {commit.message !== commit.messageTitle && (
                            <p className="text-sm text-muted-foreground mt-3 whitespace-pre-wrap break-words leading-relaxed">
                                {commit.message.replace(commit.messageTitle, '').trim()}
                            </p>
                        )}
                    </div>

                    {commit.htmlUrl && (
                        <a
                            href={commit.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                'shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl',
                                'text-sm font-medium text-blue-500',
                                'bg-blue-500/10 hover:bg-blue-500/20',
                                'border border-blue-500/20 hover:border-blue-500/40',
                                'transition-all duration-300',
                                'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
                                'w-full sm:w-auto cursor-pointer select-none'
                            )}
                        >
                            <span>{t('viewOnGithub')}</span>
                            <ExternalLink className="w-4 h-4"/>
                        </a>
                    )}
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 text-blue-500/70 shrink-0"/>
                        <span className="truncate">{commit.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-blue-500/70 shrink-0"/>
                        <span>{new Date(commit.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4 text-blue-500/70 shrink-0"/>
                        <span>{t('filesChanged', { count: commit.filesChanged })}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-blue-500/10">
                    <div className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                        'bg-emerald-500/10 border border-emerald-500/20'
                    )}>
                        <Plus className="w-4 h-4 text-emerald-500"/>
                        <span className="font-medium text-emerald-500">{commit.additions.toLocaleString()}</span>
                    </div>
                    <div className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                        'bg-rose-500/10 border border-rose-500/20'
                    )}>
                        <Minus className="w-4 h-4 text-rose-500"/>
                        <span className="font-medium text-rose-500">{commit.deletions.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
