'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface GitHubStats {
    publicRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
}

export default function GitHubStats() {
    const t = useTranslations('github');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.1 });
    const [stats, setStats] = useState<GitHubStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await fetch('/api/github/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        publicRepos: data.publicRepos,
                        totalStars: data.totalStars,
                        totalForks: data.totalForks,
                        followers: data.followers
                    });
                }
            } catch (err) {
                console.error('Error fetching GitHub stats:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    const statCards = [
        {
            label: t('repositories'),
            value: stats?.publicRepos ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            )
        },
        {
            label: t('stars'),
            value: stats?.totalStars ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
            )
        },
        {
            label: t('forks'),
            value: stats?.totalForks ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            )
        },
        {
            label: t('followers'),
            value: stats?.followers ?? 0,
            icon: (
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                </svg>
            )
        }
    ];

    return (
        <section ref={ref as React.RefObject<HTMLElement>} id="github-stats"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 tracking-tight transition-all duration-700 gradient-text',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    {t('title')}
                </h2>

                {loading ? (
                    <div className={cn(
                        'text-center py-12 text-muted-foreground transition-all duration-700',
                        isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    )}>
                        <p className="text-lg">{t('loading')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6">
                        {statCards.map((card, index) => (
                            <div
                                key={card.label}
                                className={cn(
                                    'group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 sm:p-8 hover:border-primary/50 hover:-translate-y-1 transition-all duration-500',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/12 group-hover:via-accent/12 group-hover:to-primary/10 transition-all duration-500 pointer-events-none"/>
                                <div className="relative z-10">
                                    <div
                                        className="flex items-center gap-3 mb-4 text-foreground/70 group-hover:text-primary transition-colors duration-300">
                                        {card.icon}
                                        <span className="text-sm sm:text-base font-medium">{card.label}</span>
                                    </div>
                                    <div
                                        className="text-3xl sm:text-4xl md:text-5xl font-bold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">
                                        {card.value.toLocaleString()}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}