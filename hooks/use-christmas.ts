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

import { useState } from 'react';
import { isChristmasMode } from '@/lib/christmas';

declare global {
    interface Window {
        __CHRISTMAS_MODE__?: boolean;
    }
}

function getInitialChristmasMode(): boolean {
    if (typeof window !== 'undefined' && typeof window.__CHRISTMAS_MODE__ !== 'undefined') {
        return window.__CHRISTMAS_MODE__;
    }
    return isChristmasMode();
}

export function useChristmasMode(): boolean {
    const [christmasMode] = useState(getInitialChristmasMode);

    return christmasMode;
}
