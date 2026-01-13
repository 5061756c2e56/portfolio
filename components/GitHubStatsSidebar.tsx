'use client';

import { useEffect, useState } from 'react';

import { useTranslations } from 'next-intl';

interface GitHubStats {
    publicRepos: number;
    totalStars: number;
    totalForks: number;
    followers: number;
}

export default function GitHubStatsSidebar() {
    const t = useTranslations('github');
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

    if (loading || !stats) {
        return (
            <div className="px-3 py-2">
                <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t('title')}</p>
                <div className="text-xs text-muted-foreground">{t('loading')}</div>
            </div>
        );
    }

    return (
        <div className="px-3 py-2">
            <p className="mb-3 text-xs font-semibold text-muted-foreground uppercase">{t('title')}</p>
            <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('repositories')}</span>
                    <span className="font-semibold text-foreground">{stats.publicRepos}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('stars')}</span>
                    <span className="font-semibold text-foreground">{stats.totalStars}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('forks')}</span>
                    <span className="font-semibold text-foreground">{stats.totalForks}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">{t('followers')}</span>
                    <span className="font-semibold text-foreground">{stats.followers}</span>
                </div>
            </div>
        </div>
    );
}


