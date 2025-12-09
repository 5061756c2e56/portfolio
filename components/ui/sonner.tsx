'use client';

import {
    CircleCheckIcon,
    InfoIcon,
    Loader2Icon,
    OctagonXIcon,
    TriangleAlertIcon
} from 'lucide-react';

import {
    Toaster as Sonner,
    type ToasterProps
} from 'sonner';

const Toaster = ({ ...props }: ToasterProps) => {
    return (
        <Sonner
            theme="light"
            position="top-center"
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-4 text-green-600"/>,
                info: <InfoIcon className="size-4"/>,
                warning: <TriangleAlertIcon className="size-4"/>,
                error: <OctagonXIcon className="size-4"/>,
                loading: <Loader2Icon className="size-4 animate-spin"/>
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)',
                    '--success-bg': 'hsl(142.1 76.2% 36.3%)',
                    '--success-border': 'hsl(142.1 70.6% 45.3%)',
                    '--success-text': 'hsl(355.7 100% 97.3%)'
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };