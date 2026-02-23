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

import { getParisDayMonth, isEnvEnabled } from '@/lib/seasonal';

const HALLOWEEN_MODE_ENV_KEYS = ['HALLOWEEN_MODE', 'NEXT_PUBLIC_HALLOWEEN_MODE'] as const;

export function isHalloweenMode(): boolean {
    if (isEnvEnabled(HALLOWEEN_MODE_ENV_KEYS)) {
        return true;
    }

    const { month } = getParisDayMonth();
    return month === 10 || month === 11;
}
