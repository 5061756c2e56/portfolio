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

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';
import { LoadingOverlay } from '@/components/LoadingOverlay';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { mounted, theme, isChanging } = useTheme();
    const [bootOverlay, setBootOverlay] = useState(true);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const hasThemeClass =
            root.classList.contains('light') || root.classList.contains('dark');

        if (!hasThemeClass) {
            const effectiveTheme =
                theme === 'system'
                    ? (
                        window.matchMedia('(prefers-color-scheme: dark)').matches
                            ? 'dark'
                            : 'light'
                    )
                    : theme;

            root.classList.add(effectiveTheme);
            root.style.colorScheme = effectiveTheme;
        }
    }, [mounted, theme]);

    useEffect(() => {
        if (!mounted) return;
        const raf = window.requestAnimationFrame(() => setBootOverlay(false));
        return () => window.cancelAnimationFrame(raf);
    }, [mounted]);

    return (
        <>
            {children}
            <LoadingOverlay
                isLoading={isChanging || bootOverlay}
                textKey="themeChanging"
                tone="solid-dark"
                instant
            />
        </>
    );
}
