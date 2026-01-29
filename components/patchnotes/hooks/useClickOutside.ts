'use client';

import React, { useEffect } from 'react';

export function useClickOutside(
    ref: React.RefObject<HTMLElement | null>,
    onOutside: () => void,
    enabled: boolean
) {
    useEffect(() => {
        if (!enabled) return;
        const onDown = (e: MouseEvent | TouchEvent) => {
            const el = ref.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) onOutside();
        };
        document.addEventListener('mousedown', onDown, { passive: true });
        document.addEventListener('touchstart', onDown, { passive: true });
        return () => {
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
        };
    }, [ref, onOutside, enabled]);
}