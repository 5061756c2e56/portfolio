'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { mounted, theme } = useTheme();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (!mounted) return;

        const root = document.documentElement;
        const hasThemeClass = root.classList.contains('light') || root.classList.contains('dark');

        if (!hasThemeClass) {
            const effectiveTheme =
                theme === 'system'
                    ? (
                        window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
                    )
                    : theme;

            root.classList.add(effectiveTheme);
            root.style.colorScheme = effectiveTheme;
        }

        requestAnimationFrame(() => {
            setIsReady(true);
        });
    }, [mounted, theme]);

    return (
        <div
            style={{
                opacity: isReady ? 1 : 0,
                transition: 'opacity 0.15s ease-in'
            }}
        >
            {children}
        </div>
    );
}