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

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';
import { useTranslations } from 'next-intl';

interface LoadingOverlayProps {
    isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
    const t = useTranslations('nav');

    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-300',
                isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
        >
            <div className="flex flex-col items-center text-center gap-3">
                <Spinner className="h-12 w-12"/>
                <p className="text-sm sm:text-base text-muted-foreground">{t('languageChanging')}</p>
            </div>
        </div>
    );
}