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

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';
import {
    ALLOWED_REPOSITORIES, CHART_TIME_RANGES, LoadingState, MultiRepoStatsResponse, Repository, TimeRange,
    VALID_TIME_RANGES
} from '@/lib/github/types';
import StatsNavigation from '@/components/navbars/Stats/StatsNavigation';
import { StatsOverview } from '@/components/github-stats/StatsOverview';
import { LanguagesChart } from '@/components/github-stats/LanguagesChart';
import { ContributorsSection } from '@/components/github-stats/ContributorsSection';
import { MultiRepoCommitsChart } from '@/components/github-stats/MultiRepoCommitsChart';
import { MultiRepoCommitSearch } from '@/components/github-stats/MultiRepoCommitSearch';
import { PeriodSelector } from '@/components/github-stats/PeriodSelector';
import { ChartSkeleton } from '@/components/github-stats/ChartSkeleton';
import { SiGithub } from 'react-icons/si';

export default function StatsPageClient() {
    const t = useTranslations('githubStats');

    const [selectedRepos, setSelectedRepos] = useState<Repository[]>(ALLOWED_REPOSITORIES);
    const [stats, setStats] = useState<MultiRepoStatsResponse | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);
    const [selectedStatsRange, setSelectedStatsRange] = useState<TimeRange>('12m');
    const [selectedRange, setSelectedRange] = useState<TimeRange>('30d');
    const [chartLoading, setChartLoading] = useState(false);
    const [combinedTimeline, setCombinedTimeline] = useState<MultiRepoStatsResponse['combinedTimeline']>([]);
    const [timelines, setTimelines] = useState<MultiRepoStatsResponse['timelines']>([]);
    const statsAbortRef = useRef<AbortController | null>(null);
    const timelineAbortRef = useRef<AbortController | null>(null);

    const fetchStats = useCallback(async (repos: Repository[], range: TimeRange) => {
        if (repos.length === 0) return;

        setLoadingState('loading');
        setError(null);

        statsAbortRef.current?.abort();
        const controller = new AbortController();
        statsAbortRef.current = controller;

        try {
            const reposParam = repos.map(r => (
                {
                    owner: r.owner,
                    name: r.name
                }
            ));
            const response = await fetch(
                `/api/github/multi-stats?repos=${encodeURIComponent(JSON.stringify(reposParam))}&range=${range}`,
                { signal: controller.signal }
            );

            if (!response.ok) {
                const errBody = await response.json().catch(() => (
                    {}
                ));
                const message = typeof errBody?.error === 'string' ? errBody.error : 'Failed to fetch stats';
                throw new Error(message);
            }

            const data: MultiRepoStatsResponse = await response.json();
            setStats(data);
            setLoadingState('success');
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;

            console.error('Error fetching stats:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setLoadingState('error');
        } finally {
            if (statsAbortRef.current === controller) {
                statsAbortRef.current = null;
            }
        }
    }, []);

    const fetchTimeline = useCallback(async (repos: Repository[], range: TimeRange) => {
        if (repos.length === 0) return;

        setChartLoading(true);

        timelineAbortRef.current?.abort();
        const controller = new AbortController();
        timelineAbortRef.current = controller;

        try {
            const reposParam = repos.map(r => (
                { owner: r.owner, name: r.name }
            ));
            const response = await fetch(
                `/api/github/multi-timeline?repos=${encodeURIComponent(JSON.stringify(reposParam))}&range=${range}`,
                { signal: controller.signal }
            );

            if (!response.ok) throw new Error('Failed to fetch timeline');

            const data = await response.json();
            setCombinedTimeline(data.combinedTimeline ?? []);
            setTimelines(data.timelines ?? []);
        } catch (err) {
            if (err instanceof DOMException && err.name === 'AbortError') return;

            console.error('Error fetching timeline:', err);
        } finally {
            if (timelineAbortRef.current === controller) {
                timelineAbortRef.current = null;
            }

            setChartLoading(false);
        }
    }, []);

    useEffect(() => {
        void fetchStats(selectedRepos, selectedStatsRange);
    }, [selectedRepos, selectedStatsRange, fetchStats]);

    useEffect(() => {
        void fetchTimeline(selectedRepos, selectedRange);
    }, [selectedRepos, selectedRange, fetchTimeline]);

    const handleRepoToggle = (repo: Repository, checked: boolean) => {
        if (checked) {
            setSelectedRepos(prev => [...prev, repo]);
        } else {
            if (selectedRepos.length > 1) {
                setSelectedRepos(prev => prev.filter(r => r.name !== repo.name));
            }
        }
    };

    const isRepoSelected = (repo: Repository) => {
        return selectedRepos.some(r => r.owner === repo.owner && r.name === repo.name);
    };

    const isOnlyOneSelected = selectedRepos.length === 1;

    return (
        <>
            <StatsNavigation/>
            <main className="min-h-screen text-foreground">
                <section className="min-h-[40vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <div className="max-w-5xl mx-auto text-center w-full">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-blue-500/20 bg-blue-500/5 text-sm text-blue-500 mb-8">
                            <SiGithub className="w-4 h-4"/>
                            {t('homeSubtitle')}
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
                            <span className="gradient-text">{t('title')}</span>
                        </h1>
                    </div>
                </section>

                {error && loadingState === 'error' ? (
                    <section className="py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto">
                            <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-6 text-center">
                                <p className="text-red-400">{error}</p>
                            </div>
                        </div>
                    </section>
                ) : (
                    <section className="py-12 px-4 sm:px-6 lg:px-8">
                        <div className="max-w-4xl mx-auto space-y-8">
                            {ALLOWED_REPOSITORIES.length > 1 && (
                                <div className="animate-fade-in-up">
                                    <div className="flex items-center gap-2 mb-4">
                                        <SiGithub className="w-4 h-4 text-muted-foreground"/>
                                        <span className="text-sm font-medium text-muted-foreground">
                                            {t('selectRepos')}
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-3">
                                        {ALLOWED_REPOSITORIES.map((repo) => {
                                            const selected = isRepoSelected(repo);
                                            const disabled = selected && isOnlyOneSelected;

                                            return (
                                                <label
                                                    key={`${repo.owner}/${repo.name}`}
                                                    className={cn(
                                                        'flex items-center gap-3 px-4 py-3 rounded-xl border cursor-pointer',
                                                        'transition-all duration-300',
                                                        selected
                                                            ? 'border-blue-500/50 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                                            : 'border-border/50 bg-card/50 hover:border-blue-500/30 hover:bg-blue-500/5',
                                                        disabled && 'cursor-not-allowed opacity-70'
                                                    )}
                                                >
                                                    <Checkbox
                                                        checked={selected}
                                                        disabled={disabled}
                                                        onCheckedChange={(checked) =>
                                                            handleRepoToggle(repo, checked === true)
                                                        }
                                                        className={cn(
                                                            'data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500',
                                                            disabled && 'cursor-not-allowed'
                                                        )}
                                                    />
                                                    <div className="flex flex-col">
                                                        <span className={cn(
                                                            'font-medium text-sm',
                                                            selected && 'text-blue-500'
                                                        )}>
                                                            {repo.displayName || repo.name}
                                                        </span>
                                                        <span className="text-xs text-muted-foreground">
                                                            {repo.owner}/{repo.name}
                                                        </span>
                                                    </div>
                                                </label>
                                            );
                                        })}
                                    </div>
                                    {isOnlyOneSelected && (
                                        <p className="text-xs text-amber-500/80 mt-2 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"/>
                                            {t('minOneRepo')}
                                        </p>
                                    )}
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                <p className="text-sm text-muted-foreground">
                                    {t('periodForStats')}
                                </p>
                                <PeriodSelector
                                    selectedRange={selectedStatsRange}
                                    availablePeriods={[...VALID_TIME_RANGES]}
                                    onRangeChange={setSelectedStatsRange}
                                    isLoading={loadingState === 'loading'}
                                />
                            </div>

                            <StatsOverview
                                stats={stats?.stats ?? null}
                                isLoading={loadingState === 'loading'}
                            />

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <LanguagesChart
                                    languages={stats?.languages ?? []}
                                    isLoading={loadingState === 'loading'}
                                />
                                <ContributorsSection
                                    contributors={stats?.contributors ?? []}
                                    isLoading={loadingState === 'loading'}
                                    totalCommits={stats?.stats?.totalCommits}
                                />
                            </div>

                            <div className="rounded-2xl border border-blue-500/10 bg-card/50 overflow-hidden">
                                <div className="p-4 sm:p-6 border-b border-blue-500/10 bg-blue-500/5">
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                                                <TrendingUp className="w-4 h-4 text-blue-500"/>
                                            </div>
                                            <div>
                                                <h3 className="font-medium">{t('chartTitle')}</h3>
                                                <p className="text-xs text-muted-foreground mt-0.5">
                                                    {t('chartSubtitle')}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="w-full sm:w-auto">
                                            <PeriodSelector
                                                selectedRange={selectedRange}
                                                availablePeriods={[...CHART_TIME_RANGES]}
                                                onRangeChange={setSelectedRange}
                                                isLoading={chartLoading}
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 sm:p-6">
                                    {chartLoading ? (
                                        <ChartSkeleton/>
                                    ) : combinedTimeline.length > 0 && timelines.length > 0 ? (
                                        <MultiRepoCommitsChart
                                            combinedTimeline={combinedTimeline}
                                            timelines={timelines}
                                        />
                                    ) : null}
                                </div>
                            </div>

                            <MultiRepoCommitSearch selectedRepos={selectedRepos}/>
                        </div>
                    </section>
                )}
            </main>
        </>
    );
}