'use client';

import { useTranslations } from 'next-intl';
import { Code2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { LanguageStats } from '@/lib/github/types';

interface LanguagesChartProps {
    languages: LanguageStats[];
    isLoading: boolean;
}

export function LanguagesChart({ languages, isLoading }: LanguagesChartProps) {
    const t = useTranslations('githubStats.languages');

    if (isLoading) {
        return (
            <div className="rounded-xl border border-blue-500/10 bg-card/50 p-4 sm:p-6 min-h-50 flex flex-col items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-3" />
                <span className="text-sm text-muted-foreground">{t('title')}...</span>
            </div>
        );
    }

    if (languages.length === 0) {
        return null;
    }

    const topLanguages = languages.slice(0, 8);
    const otherPercentage = languages.slice(8).reduce((sum, l) => sum + l.percentage, 0);

    return (
        <div className="rounded-xl border border-blue-500/10 bg-card/50 p-4 sm:p-6">
            <div className="flex items-center gap-2 mb-4">
                <Code2 className="w-4 h-4 text-blue-500" />
                <h3 className="text-lg font-medium">{t('title')}</h3>
            </div>

            <div className="h-3 bg-muted/30 rounded-full overflow-hidden flex">
                {topLanguages.map((lang, idx) => (
                    <div
                        key={lang.name}
                        className={cn(
                            'h-full transition-all duration-500',
                            idx === 0 && 'rounded-l-full',
                            idx === topLanguages.length - 1 && otherPercentage === 0 && 'rounded-r-full'
                        )}
                        style={{
                            width: `${lang.percentage}%`,
                            backgroundColor: lang.color
                        }}
                        title={`${lang.name}: ${lang.percentage}%`}
                    />
                ))}
                {otherPercentage > 0 && (
                    <div
                        className="h-full rounded-r-full bg-muted-foreground/30"
                        style={{ width: `${otherPercentage}%` }}
                        title={`${t('other')}: ${otherPercentage.toFixed(1)}%`}
                    />
                )}
            </div>

            <div className="flex flex-wrap gap-x-4 gap-y-2 mt-4">
                {topLanguages.map(lang => (
                    <div key={lang.name} className="flex items-center gap-2 text-sm">
                        <span
                            className="w-3 h-3 rounded-full shrink-0"
                            style={{ backgroundColor: lang.color }}
                        />
                        <span className="text-foreground/80">{lang.name}</span>
                        <span className="text-muted-foreground">{lang.percentage}%</span>
                    </div>
                ))}
                {otherPercentage > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                        <span className="w-3 h-3 rounded-full shrink-0 bg-muted-foreground/30" />
                        <span className="text-foreground/80">{t('other')}</span>
                        <span className="text-muted-foreground">{otherPercentage.toFixed(1)}%</span>
                    </div>
                )}
            </div>
        </div>
    );
}
