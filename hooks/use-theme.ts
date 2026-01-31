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

import { useCallback, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

export function useTheme() {
    const [theme, setTheme] = useState<Theme>('light');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const stored = localStorage.getItem('theme') as Theme | null;
        if (stored) {
            setTheme(stored);
        } else {
            setTheme('light');
            localStorage.setItem('theme', 'light');
        }
    }, []);

    const applyTheme = useCallback((themeValue: Theme) => {
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');

        let effectiveTheme: 'light' | 'dark';

        if (themeValue === 'system') {
            effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                ? 'dark'
                : 'light';
        } else {
            effectiveTheme = themeValue;
        }

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

        localStorage.setItem('theme', themeValue);
    }, []);

    useEffect(() => {
        if (!mounted) return;
        applyTheme(theme);
    }, [theme, mounted, applyTheme]);

    useEffect(() => {
        if (!mounted || theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => applyTheme('system');

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [theme, mounted, applyTheme]);

    const setThemeValue = (newTheme: Theme) => {
        if (newTheme === theme) return;
        setTheme(newTheme);
    };

    return { theme, setTheme: setThemeValue, mounted };
}