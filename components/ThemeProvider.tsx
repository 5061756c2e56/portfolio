'use client';

import { useEffect } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { mounted } = useTheme();

    useEffect(() => {
        if (mounted) {
            const root = document.documentElement;
            if (!root.classList.contains('light') && !root.classList.contains('dark')) {
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
                    ? 'dark'
                    : 'light';
                root.classList.add(systemTheme);
            }
        }
    }, [mounted]);

    return <>{children}</>;
}



