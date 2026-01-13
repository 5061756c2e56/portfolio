'use client';

import { useEffect, useState } from 'react';
import { useTheme } from '@/hooks/use-theme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const { mounted } = useTheme();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (mounted) {
            const root = document.documentElement;

            if (!root.classList.contains('light') && !root.classList.contains('dark')) {
                root.classList.add('dark');
            }

            requestAnimationFrame(() => {
                setIsReady(true);
            });
        }
    }, [mounted]);

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