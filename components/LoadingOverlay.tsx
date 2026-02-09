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

import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';
import { Spinner } from '@/components/ui/spinner';

interface LoadingOverlayProps {
    isLoading: boolean;
    textKey?: 'languageChanging' | 'themeChanging';
    tone?: 'soft' | 'solid' | 'solid-dark';
    instant?: boolean;
}

export function LoadingOverlay({
    isLoading,
    textKey = 'languageChanging',
    tone = 'soft',
    instant = false
}: LoadingOverlayProps) {
    const t = useTranslations('nav');

    const backgroundClass =
        tone === 'solid-dark'
            ? 'bg-black'
            : tone === 'solid'
                ? 'bg-background'
                : 'bg-background/80 backdrop-blur-md';

    const foregroundClass =
        tone === 'solid-dark'
            ? 'text-white/80'
            : 'text-muted-foreground';

    const transitionClass = instant
        ? 'transition-none'
        : 'transition-opacity duration-300';

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center',
                backgroundClass,
                transitionClass,
                isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
        >
            <div className="flex items-center gap-3">
                <Spinner className={cn('h-8 w-8 shrink-0', foregroundClass)}/>
                <p className={cn('text-sm sm:text-base', foregroundClass)}>
                    {t(textKey)}
                </p>
            </div>
        </div>
    );
}
