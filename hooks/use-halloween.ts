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
import { isHalloweenMode } from '@/lib/halloween';

declare global {
    interface Window {
        __HALLOWEEN_MODE__?: boolean;
    }
}

function getInitialHalloweenMode(): boolean {
    if (typeof window !== 'undefined' && typeof window.__HALLOWEEN_MODE__ !== 'undefined') {
        return window.__HALLOWEEN_MODE__;
    }
    return isHalloweenMode();
}

export function useHalloweenMode(): boolean {
    const [halloweenMode] = useState(getInitialHalloweenMode);

    return halloweenMode;
}
