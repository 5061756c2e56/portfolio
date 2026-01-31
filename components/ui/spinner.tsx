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

import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
    return (
        <div
            role="status"
            aria-label="Loading"
            className={cn(
                'h-10 w-10 rounded-full border-4 border-primary/25 border-t-primary animate-spin',
                className
            )}
        />
    );
}