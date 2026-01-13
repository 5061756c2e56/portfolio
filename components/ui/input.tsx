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
                'file:text-foreground placeholder:text-muted-foreground selection:bg-foreground/20 selection:text-foreground h-11 w-full min-w-0 rounded-lg border border-border bg-card/50 px-4 py-2.5 text-base transition-all duration-300 outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-40 md:text-sm',
                'focus-visible:border-foreground/30 focus-visible:bg-card focus-visible:ring-2 focus-visible:ring-foreground/10',
                'hover:border-foreground/20 hover:bg-card',
                'aria-invalid:ring-destructive/20 aria-invalid:border-destructive',
                className
            )}
            {...props}
        />
    );
}

export { Input };