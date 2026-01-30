'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { ArrowRight, GitCommit, GitFork, Loader2, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useInView } from '@/hooks/use-in-view';
import { Link } from '@/i18n/routing';
import { ALLOWED_REPOSITORIES, LoadingState, MultiRepoStatsResponse } from '@/lib/github/types';
import { SiGithub } from 'react-icons/si';

export function GitHubActivities() {
    const t = useTranslations('githubStats');
    const { ref, isInView } = useInView({ threshold: 0.1 });

    const [stats, setStats] = useState<MultiRepoStatsResponse | null>(null);
    const [loadingState, setLoadingState] = useState<LoadingState>('idle');
    const [error, setError] = useState<string | null>(null);

    const fetchStats = useCallback(async () => {
        setLoadingState('loading');
        setError(null);

        try {
            const reposParam = ALLOWED_REPOSITORIES.map(r => (
                {
                    owner: r.owner,
                    name: r.name
                }
            ));
            const response = await fetch(
                `/api/github/multi-stats?repos=${encodeURIComponent(JSON.stringify(reposParam))}&range=12m`
            );

            if (!response.ok) {
                throw new Error('Failed to fetch stats');
            }

            const data: MultiRepoStatsResponse = await response.json();
            setStats(data);
            setLoadingState('success');
        } catch (err) {
            console.error('Error fetching stats:', err);
            setError(err instanceof Error ? err.message : 'Une erreur est survenue');
            setLoadingState('error');
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    if (error && loadingState === 'error') {
        return null;
    }

    const commits = stats?.stats?.totalCommits ?? 0;
    const stars = stats?.stats?.stars ?? 0;
    const forks = stats?.stats?.forks ?? 0;

    const statItems = [
        { icon: GitCommit, labelKey: 'overview.commits' as const, value: commits },
        { icon: Star, labelKey: 'overview.stars' as const, value: stars },
        { icon: GitFork, labelKey: 'overview.forks' as const, value: forks }
    ];

    return (
        <section
            ref={ref as React.RefObject<HTMLElement>}
            id="github-activities"
            className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative"
        >
            <div className="max-w-4xl mx-auto relative z-10">
                <div className={cn(
                    'flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 sm:mb-10 transition-all duration-500',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    <div>
                        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight gradient-text">
                            {t('homeTitle')}
                        </h2>
                        <p className="text-muted-foreground mt-2">{t('homeSubtitle')}</p>
                    </div>

                </div>

                <div className={cn(
                    'rounded-2xl border border-blue-500/10 bg-card/50 p-6 sm:p-8 transition-all duration-500',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )} style={{ animationDelay: '100ms' }}>
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <SiGithub className="w-5 h-5 text-blue-500"/>
                        </div>
                        <div>
                            <span className="text-sm text-muted-foreground">
                                {t('repoCount', { count: ALLOWED_REPOSITORIES.length })}
                            </span>
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                        {statItems.map((item, index) => (
                            <div
                                key={item.labelKey}
                                className={cn(
                                    'text-center p-4 rounded-xl bg-background/50 border border-blue-500/5',
                                    'transition-all duration-300 hover:border-blue-500/20 hover:bg-blue-500/5'
                                )}
                                style={{ animationDelay: `${150 + index * 50}ms` }}
                            >
                                {loadingState === 'loading' ? (
                                    <div className="flex flex-col items-center justify-center py-2">
                                        <Loader2 className="w-6 h-6 text-blue-500 animate-spin mb-2"/>
                                        <span className="text-xs text-muted-foreground">{t('loading')}</span>
                                    </div>
                                ) : (
                                    <>
                                        <item.icon className="w-5 h-5 text-blue-500 mx-auto mb-2"/>
                                        <div className="text-2xl sm:text-3xl font-bold text-foreground">
                                            {item.value.toLocaleString()}
                                        </div>
                                        <div className="text-xs sm:text-sm text-muted-foreground mt-1">
                                            {t(item.labelKey, { count: item.value })}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <Link
                        href="/stats"
                        className={cn(
                            'group flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl',
                            'bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 hover:border-blue-500/40',
                            'text-blue-500 font-medium text-sm',
                            'transition-all duration-300'
                        )}
                    >
                        <span>{t('viewAllStats')}</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1"/>
                    </Link>
                </div>
            </div>
        </section>
    );
}
