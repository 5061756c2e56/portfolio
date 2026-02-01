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

import { useCallback, useEffect, useState, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

function readStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'system';

    try {
        const raw = window.localStorage.getItem('theme');
        if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;

        window.localStorage.setItem('theme', 'system');
        return 'system';
    } catch {
        return 'system';
    }
}

function subscribeNoop(): () => void {
    return () => {
    };
}

function useHydrated(): boolean {
    return useSyncExternalStore(
        subscribeNoop,
        () => true,
        () => false
    );
}

export function useTheme() {
    const mounted = useHydrated();
    const [theme, setTheme] = useState<Theme>(() => readStoredTheme());

    const applyTheme = useCallback((themeValue: Theme) => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        const effectiveTheme: 'light' | 'dark' =
            themeValue === 'system'
                ? window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light'
                : themeValue;

        root.classList.add(effectiveTheme);

        if (effectiveTheme === 'dark') {
            root.style.backgroundColor = '#000000';
            root.style.color = '#ededed';
            root.style.colorScheme = 'dark';
        } else {
            root.style.backgroundColor = '#fafafa';
            root.style.color = '#262626';
            root.style.colorScheme = 'light';
        }

        try {
            window.localStorage.setItem('theme', themeValue);
        } catch {
        }
    }, []);

    useEffect(() => {
        applyTheme(theme);
    }, [applyTheme, theme]);

    useEffect(() => {
        if (!mounted) return;
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mounted, theme, applyTheme]);

    const setThemeValue = useCallback((newTheme: Theme) => {
        setTheme((prev) => (
            prev === newTheme ? prev : newTheme
        ));
    }, []);

    return { theme, setTheme: setThemeValue, mounted };
}