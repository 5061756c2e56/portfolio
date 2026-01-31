'use client';

import { useEffect } from 'react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';
import { Home, RefreshCw } from 'lucide-react';

export default function Error({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    const t = useTranslations('errors.500');

    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }, [error]);

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.68_0.15_240/0.1),transparent_50%)] pointer-events-none"/>
            <div className="max-w-2xl mx-auto text-center relative z-10">
                <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                    500
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    {t('title')}
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                    <button
                        onClick={reset}
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                    >
                        <RefreshCw
                            className="w-5 h-5 text-foreground transition-transform duration-300 group-hover:rotate-180"
                        />
                        <span className="text-base font-medium text-foreground">
                            {t('retry')}
                        </span>
                    </button>

                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                    >
                        <Home
                            className="w-5 h-5 text-foreground transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-110"
                        />
                        <span className="text-base font-medium text-foreground">
                            {t('backHome')}
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
}