'use client';

import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ChartSkeleton() {
    const t = useTranslations('githubStats');

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 rounded bg-blue-500/20 animate-pulse"/>
                    <div className="h-4 w-32 rounded bg-muted/50 animate-pulse"/>
                </div>
                <div className="h-10 w-40 rounded-xl bg-blue-500/10 border border-blue-500/20 animate-pulse"/>
            </div>

            <div className={cn(
                'h-65 sm:h-75 md:h-85 w-full rounded-xl',
                'bg-linear-to-b from-blue-500/5 to-transparent',
                'border border-blue-500/10',
                'relative flex items-center justify-center'
            )}>
                <div className="flex flex-col items-center gap-2">
                    <div className="relative">
                        <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"/>
                        <Loader2 className="w-10 h-10 animate-spin text-blue-500 relative"/>
                    </div>

                    <p className="text-sm text-muted-foreground font-medium">
                        {t('loadingData')}
                    </p>

                    <p className="text-xs text-muted-foreground/70">
                        {t('takeTime')}
                    </p>
                </div>
            </div>
        </div>
    );
}
