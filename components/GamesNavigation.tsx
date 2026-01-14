'use client';

import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Settings from './Settings';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/ChristmasHat';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Home } from 'lucide-react';

export default function GamesNavigation() {
    const t = useTranslations('nav');
    const christmasMode = useChristmasMode();

    return (
        <nav className="w-full border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-xl font-semibold hover:opacity-80 transition-opacity shrink-0"
                        suppressHydrationWarning
                    >
                        {christmasMode ? (
                            <ChristmasHat size={24} className="w-6 h-6 text-primary" />
                        ) : (
                            <div className="relative w-7 h-7 rounded-full overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300 shrink-0">
                                <Image
                                    src="/pfp.png"
                                    alt="Paul Viandier"
                                    fill
                                    className="object-cover"
                                    sizes="28px"
                                />
                            </div>
                        )}
                        <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
                            Paul Viandier
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/"
                            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-accent flex items-center gap-2"
                        >
                            <Home className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('home')}</span>
                        </Link>
                        <Settings />
                    </div>
                </div>
            </div>
        </nav>
    );
}
