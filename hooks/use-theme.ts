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

import { useCallback, useEffect, useSyncExternalStore } from 'react';

type Theme = 'light' | 'dark' | 'system';

type ThemeState = {
    theme: Theme;
    isChanging: boolean;
};

const listeners = new Set<() => void>();
let state: ThemeState = { theme: 'light', isChanging: false };
let initialized = false;
let lastApplied: Theme | null = null;
let changingTimeout: number | null = null;
let applyTimeout: number | null = null;

function readStoredTheme(): Theme {
    if (typeof window === 'undefined') return 'light';

    try {
        const raw = window.localStorage.getItem('theme');
        if (raw === 'light' || raw === 'dark' || raw === 'system') return raw;

        window.localStorage.setItem('theme', 'light');
        return 'light';
    } catch {
        return 'light';
    }
}

function initState() {
    if (initialized || typeof window === 'undefined') return;
    state = { ...state, theme: readStoredTheme() };
    initialized = true;
}

function emit() {
    listeners.forEach((listener) => listener());
}

function applyTheme(themeValue: Theme) {
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
        document.cookie = `theme=${themeValue}; path=/; max-age=31536000; samesite=lax`;
    } catch {
    }
}

function ensureApplied(themeValue: Theme) {
    if (typeof window === 'undefined') return;
    if (lastApplied === themeValue) return;
    applyTheme(themeValue);
    lastApplied = themeValue;
}

function setThemeState(next: Theme) {
    initState();
    if (state.theme === next) return;

    state = { theme: next, isChanging: true };
    emit();

    if (typeof window !== 'undefined') {
        if (applyTimeout !== null) {
            window.clearTimeout(applyTimeout);
        }
        if (changingTimeout !== null) {
            window.clearTimeout(changingTimeout);
        }

        applyTimeout = window.setTimeout(() => {
            applyTheme(next);
            lastApplied = next;
        }, 80);

        changingTimeout = window.setTimeout(() => {
            state = { theme: next, isChanging: false };
            emit();
        }, 380);
    }
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

function getSnapshot(): ThemeState {
    initState();
    return state;
}

const serverSnapshot: ThemeState = { theme: 'light', isChanging: false };

function getServerSnapshot(): ThemeState {
    return serverSnapshot;
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
    const { theme, isChanging } = useSyncExternalStore(
        subscribe,
        getSnapshot,
        getServerSnapshot
    );

    useEffect(() => {
        if (!mounted || isChanging) return;
        ensureApplied(theme);
    }, [mounted, theme, isChanging]);

    useEffect(() => {
        if (!mounted) return;
        if (theme !== 'system') return;

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = () => {
            applyTheme('system');
            lastApplied = 'system';
        };

        mediaQuery.addEventListener('change', handleChange);
        return () => mediaQuery.removeEventListener('change', handleChange);
    }, [mounted, theme]);

    const setThemeValue = useCallback((newTheme: Theme) => {
        setThemeState(newTheme);
    }, []);

    return { theme, setTheme: setThemeValue, mounted, isChanging };
}
