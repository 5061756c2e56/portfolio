import {
    cva,
    type VariantProps
} from 'class-variance-authority';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@/lib/utils';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 ease-out cursor-pointer disabled:pointer-events-none disabled:opacity-40 disabled:cursor-not-allowed [&_svg]:pointer-events-none [&_svg:not([class*=\'size-\'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
    {
        variants: {
            variant: {
                default: 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]',
                gradient: 'bg-foreground text-background hover:bg-foreground/90 hover:shadow-[0_0_20px_rgba(255,255,255,0.1)] active:scale-[0.98]',
                destructive: 'bg-destructive text-white hover:bg-destructive/90 active:scale-[0.98]',
                outline: 'border border-border bg-transparent hover:bg-foreground/5 hover:border-foreground/30 active:scale-[0.98]',
                secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 active:scale-[0.98]',
                ghost: 'hover:bg-foreground/5 active:bg-foreground/10 active:scale-[0.98]',
                link: 'text-foreground/70 underline-offset-4 hover:underline hover:text-foreground transition-colors duration-200'
            },
            size: {
                default: 'h-10 px-5 py-2.5 has-[>svg]:px-4',
                sm: 'h-9 rounded-lg gap-1.5 px-4 has-[>svg]:px-3 text-sm',
                lg: 'h-12 rounded-lg px-8 has-[>svg]:px-6 text-base',
                icon: 'size-10 rounded-lg',
                'icon-sm': 'size-9 rounded-lg',
                'icon-lg': 'size-12 rounded-lg'
            }
        },
        defaultVariants: {
            variant: 'default',
            size: 'default'
        }
    }
);

function Button({
    className,
    variant,
    size,
    asChild = false,
    ...props
}: React.ComponentProps<'button'> &
    VariantProps<typeof buttonVariants> & {
    asChild?: boolean
}) {
    const Comp = asChild ? Slot : 'button';

    return (
        <Comp
            data-slot="button"
            className={cn(buttonVariants({
                variant,
                size,
                className
            }))}
            {...props}
        />
    );
}

export {
    Button,
    buttonVariants
};