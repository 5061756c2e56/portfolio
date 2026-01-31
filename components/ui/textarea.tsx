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

export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({
        className,
        ...props
    }, ref) => {
        return (
            <textarea
                className={cn(
                    'flex min-h-20 w-full rounded-xl border border-blue-500/20 bg-card/50 px-4 py-3 text-sm placeholder:text-muted-foreground transition-all duration-300',
                    'focus-visible:outline-none focus-visible:border-blue-500/50 focus-visible:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
                    'hover:border-blue-500/40 hover:bg-card',
                    'disabled:cursor-not-allowed disabled:opacity-50',
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = 'Textarea';

export { Textarea };