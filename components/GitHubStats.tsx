'use client';

import {
    useEffect,
    useState
} from 'react';

import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface GitHubStats {
    username: string;
    publicRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
    following: number;
    recentRepos: Array<{
        name: string;
        description: string;
        url: string;
        stars: number;
        forks: number;
        language: string;
        updatedAt: string;
    }>;
}

export default function GitHubStats() {
    const t = useTranslations('github');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.1 });
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/github/stats');
                if (!response.ok) {
                    throw new Error('Failed to fetch GitHub stats');
                }
                const data = await response.json();
                setStats(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) {
        return (
            <section ref={ref as React.RefObject<HTMLElement>} id="github-stats"
                     className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/10 relative overflow-hidden">
                <div className="max-w-6xl mx-auto relative z-10">
                    <div className="text-center text-muted-foreground">{t('loading')}</div>
                </div>
            </section>
        );
    }

    if (error || !stats) {
        return null;
    }

    return (
        <section ref={ref as React.RefObject<HTMLElement>} id="github-stats"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 via-muted/20 to-background relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none"/>
            <div className="max-w-6xl mx-auto relative z-10">
                <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    <span
                        className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                        {t('title')}
                    </span>
                </h2>

                <div className={cn(
                    'grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-12 transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )} style={{ animationDelay: '100ms' }}>
                    <div
                        className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stats.publicRepos}</div>
                        <div className="text-sm sm:text-base text-muted-foreground">{t('repositories')}</div>
                    </div>
                    <div
                        className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stats.totalStars}</div>
                        <div className="text-sm sm:text-base text-muted-foreground">{t('stars')}</div>
                    </div>
                    <div
                        className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stats.totalForks}</div>
                        <div className="text-sm sm:text-base text-muted-foreground">{t('forks')}</div>
                    </div>
                    <div
                        className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6 text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-foreground mb-2">{stats.followers}</div>
                        <div className="text-sm sm:text-base text-muted-foreground">{t('followers')}</div>
                    </div>
                </div>

                <div className={cn(
                    'transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )} style={{ animationDelay: '200ms' }}>
                    <h3 className="text-xl sm:text-2xl font-semibold mb-6 text-foreground">{t('recentRepos')}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        {stats.recentRepos.map((repo, index) => (
                            <a
                                key={repo.name}
                                href={repo.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={cn(
                                    'group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-5 hover:border-foreground/30 hover:shadow-lg hover:-translate-y-1 cursor-pointer transition-all duration-300',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${300 + index * 50}ms` }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h4 className="font-semibold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                                        {repo.name}
                                    </h4>
                                    <svg
                                        className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                                    </svg>
                                </div>
                                {repo.description && (
                                    <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{repo.description}</p>
                                )}
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    {repo.language && (
                                        <span className="flex items-center gap-1">
                                            <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                                            {repo.language}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1">
                                        <svg className="w-4 h-4 fill-yellow-500" viewBox="0 0 24 24">
                                            <path
                                                d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                                        </svg>
                                        {repo.stars}
                                    </span>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>

                <div className={cn(
                    'mt-8 text-center transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )} style={{ animationDelay: '400ms' }}>
                    <a
                        href={`https://github.com/${stats.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 text-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                    >
                        {t('viewProfile')}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                        </svg>
                    </a>
                </div>
            </div>
        </section>
    );
}