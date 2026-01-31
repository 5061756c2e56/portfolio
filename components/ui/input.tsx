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

import * as React from 'react';
import { cn } from '@/lib/utils';

function Input({
    className,
    type,
    ...props
}: React.ComponentProps<'input'>) {
    return (
        <input
            type={type}
            data-slot="input"
            className={cn(
                'file:text-foreground placeholder:text-muted-foreground selection:bg-blue-500/20 selection:text-foreground h-11 w-full min-w-0 rounded-xl border border-blue-500/20 bg-card/50 px-4 py-2.5 text-base transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 md:text-sm',
                'focus-visible:border-blue-500/50 focus-visible:bg-card focus-visible:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
                'hover:border-blue-500/40 hover:bg-card',
                'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
                className
            )}
            {...props}
        />
    );
}

export { Input };