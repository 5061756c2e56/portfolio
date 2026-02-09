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

import { useCallback } from 'react';

const NAV_SELECTOR = '[data-site-nav]';
const DEFAULT_GAP = 64;

function getNavOffset(extraOffset: number) {
    if (typeof document === 'undefined') return extraOffset;
    const nav = document.querySelector(NAV_SELECTOR);
    const navHeight =
        nav instanceof HTMLElement ? nav.getBoundingClientRect().height : 0;
    return Math.max(0, Math.round(navHeight + extraOffset));
}

function getElementPaddingTop(element: Element): number {
    if (typeof window === 'undefined') return 0;
    const padding = window.getComputedStyle(element).paddingTop;
    const parsed = Number.parseFloat(padding);
    return Number.isFinite(parsed) ? parsed : 0;
}

export function useSmoothScroll() {
    const scrollTo = useCallback(
        (targetId: string, extraOffset: number = DEFAULT_GAP) => {
            const element = document.querySelector(targetId);
            if (!element) return;

            const elementPosition = element.getBoundingClientRect().top;
            const paddingTop = getElementPaddingTop(element);
            const offsetPosition =
                elementPosition +
                window.pageYOffset -
                getNavOffset(extraOffset) +
                paddingTop;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },
        []
    );

    return { scrollTo };
}
