'use client';

import {
    useEffect,
    useState
} from 'react';

import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';

interface AnalyticsData {
    totalVisits: number;
    uniqueVisitors: number;
    pageViews: number;
    averageTime: string;
    topPages: Array<{ path: string; views: number }>;
}

export default function AdminDashboard() {
    const t = useTranslations('admin');
    const router = useRouter();
    const [data, setData] = useState<AnalyticsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            try {
                const apiSecret = process.env.NEXT_PUBLIC_API_SECRET;
                const headers: HeadersInit = {};
                
                if (apiSecret) {
                    headers['Authorization'] = `Bearer ${apiSecret}`;
                }
                
                const response = await fetch('/api/analytics', {
                    headers
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch analytics');
                }
                const analyticsData = await response.json();
                setData(analyticsData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unknown error');
            } finally {
                setLoading(false);
            }
        };

        fetchAnalytics();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-muted-foreground">{t('loading')}</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-destructive">{t('error')}: {error}</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-2">{t('title')}</h1>
                    <p className="text-muted-foreground">{t('description')}</p>
                </div>

                {data ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
                        <div
                            className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6">
                            <div className="text-sm sm:text-base text-muted-foreground mb-2">{t('totalVisits')}</div>
                            <div className="text-2xl sm:text-3xl font-bold text-foreground">{data.totalVisits}</div>
                        </div>
                        <div
                            className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6">
                            <div className="text-sm sm:text-base text-muted-foreground mb-2">{t('uniqueVisitors')}</div>
                            <div className="text-2xl sm:text-3xl font-bold text-foreground">{data.uniqueVisitors}</div>
                        </div>
                        <div
                            className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6">
                            <div className="text-sm sm:text-base text-muted-foreground mb-2">{t('pageViews')}</div>
                            <div className="text-2xl sm:text-3xl font-bold text-foreground">{data.pageViews}</div>
                        </div>
                        <div
                            className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6">
                            <div className="text-sm sm:text-base text-muted-foreground mb-2">{t('averageTime')}</div>
                            <div className="text-2xl sm:text-3xl font-bold text-foreground">{data.averageTime}</div>
                        </div>
                    </div>
                ) : (
                    <div
                        className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-8 text-center">
                        <p className="text-muted-foreground">{t('noData')}</p>
                    </div>
                )}

                {data && data.topPages && data.topPages.length > 0 && (
                    <div
                        className="rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-4 sm:p-6">
                        <h2 className="text-xl sm:text-2xl font-semibold mb-4">{t('topPages')}</h2>
                        <div className="space-y-2">
                            {data.topPages.map((page, index) => (
                                <div key={index}
                                     className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                                    <span className="text-foreground">{page.path}</span>
                                    <span className="text-muted-foreground">{page.views} {t('views')}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mt-8">
                    <button
                        onClick={() => router.push('/')}
                        className="text-foreground hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 transition-all duration-300"
                    >
                        {t('backToHome')}
                    </button>
                </div>
            </div>
        </div>
    );
}