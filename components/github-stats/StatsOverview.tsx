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
import { Code2, GitCommit, GitFork, Loader2, Minus, Plus, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { RepoStats } from '@/lib/github/types';

interface StatsOverviewProps {
    stats: RepoStats | null;
    isLoading: boolean;
}

type ColorVariant = 'blue' | 'purple' | 'emerald' | 'rose' | 'amber' | 'cyan' | 'indigo' | 'orange';

const colorClasses: Record<ColorVariant, { border: string; bg: string; icon: string; spinner: string }> = {
    blue: {
        border: 'border-blue-500/20 hover:border-blue-500/40', bg: 'bg-blue-500', icon: 'text-blue-500',
        spinner: 'text-blue-500'
    },
    purple: {
        border: 'border-purple-500/20 hover:border-purple-500/40', bg: 'bg-purple-500', icon: 'text-purple-500',
        spinner: 'text-purple-500'
    },
    emerald: {
        border: 'border-emerald-500/20 hover:border-emerald-500/40', bg: 'bg-emerald-500', icon: 'text-emerald-500',
        spinner: 'text-emerald-500'
    },
    rose: {
        border: 'border-rose-500/20 hover:border-rose-500/40', bg: 'bg-rose-500', icon: 'text-rose-500',
        spinner: 'text-rose-500'
    },
    amber: {
        border: 'border-amber-500/20 hover:border-amber-500/40', bg: 'bg-amber-500', icon: 'text-amber-500',
        spinner: 'text-amber-500'
    },
    cyan: {
        border: 'border-cyan-500/20 hover:border-cyan-500/40', bg: 'bg-cyan-500', icon: 'text-cyan-500',
        spinner: 'text-cyan-500'
    },
    indigo: {
        border: 'border-indigo-500/20 hover:border-indigo-500/40', bg: 'bg-indigo-500', icon: 'text-indigo-500',
        spinner: 'text-indigo-500'
    },
    orange: {
        border: 'border-orange-500/20 hover:border-orange-500/40', bg: 'bg-orange-500', icon: 'text-orange-500',
        spinner: 'text-orange-500'
    }
};

interface StatCardProps {
    icon: React.ReactNode;
    label: string;
    value: string | number;
    color: ColorVariant;
    isLoading?: boolean;
}

function StatCard({ icon, label, value, color, isLoading }: StatCardProps) {
    const classes = colorClasses[color];

    if (isLoading) {
        return (
            <div
                className={cn('rounded-xl border bg-card/50 p-4 flex flex-col items-center justify-center', classes.border)}>
                <Loader2 className={cn('w-6 h-6 animate-spin mb-2', classes.spinner)}/>
                <span className="text-xs text-muted-foreground">{label}</span>
            </div>
        );
    }

    return (
        <div className={cn('rounded-xl border bg-card/50 p-3 sm:p-4 transition-all', classes.border)}>
            <p className="text-[11px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider truncate">
                {label}
            </p>

            <div className="mt-1 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                    <div className="sm:hidden">
                        <div className={cn(classes.icon, '[&>svg]:w-4 [&>svg]:h-4')}>{icon}</div>
                    </div>
                    <p className="text-xl sm:text-2xl font-bold tracking-tight leading-none">
                        {typeof value === 'number' ? value.toLocaleString() : value}
                    </p>
                </div>

                <div className="hidden sm:flex">
                    <div className={cn('rounded-xl p-2.5', classes.bg, 'bg-opacity-10')}>
                        <div className={cn(classes.icon, '[&>svg]:w-5 [&>svg]:h-5')}>{icon}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export function StatsOverview({ stats, isLoading }: StatsOverviewProps) {
    const t = useTranslations('githubStats.overview');

    const formatSize = (kb: number) => (
        kb >= 1024 ? `${(
            kb / 1024
        ).toFixed(1)} MB` : `${kb} KB`
    );

    const commits = stats?.totalCommits ?? 0;
    const additions = stats?.totalAdditions ?? 0;
    const deletions = stats?.totalDeletions ?? 0;
    const stars = stats?.stars ?? 0;
    const forks = stats?.forks ?? 0;

    return (
        <div className="flex justify-center">
            <div className="grid w-full max-w-4xl grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
                <StatCard icon={<GitCommit/>} label={t('commits', { count: isLoading ? 0 : commits })} value={commits}
                          color="blue"
                          isLoading={isLoading}/>

                <StatCard icon={<Plus/>} label={t('additions', { count: isLoading ? 0 : additions })} value={additions}
                          color="emerald"
                          isLoading={isLoading}/>

                <StatCard icon={<Minus/>} label={t('deletions', { count: isLoading ? 0 : deletions })} value={deletions}
                          color="rose"
                          isLoading={isLoading}/>

                <StatCard icon={<Star/>} label={t('stars', { count: isLoading ? 0 : stars })} value={stars}
                          color="amber"
                          isLoading={isLoading}/>

                <StatCard icon={<GitFork/>} label={t('forks', { count: isLoading ? 0 : forks })} value={forks}
                          color="cyan"
                          isLoading={isLoading}/>

                <StatCard icon={<Code2/>} label={t('size')} value={stats ? formatSize(stats.size) : '0 KB'}
                          color="indigo"
                          isLoading={isLoading}/>
            </div>
        </div>
    );
}