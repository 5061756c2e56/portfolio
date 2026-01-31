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

import { CircleCheckIcon, InfoIcon, Loader2Icon, OctagonXIcon, TriangleAlertIcon } from 'lucide-react';

import { Toaster as Sonner, type ToasterProps } from 'sonner';

import { useIsMobile } from '@/hooks/use-mobile';

const Toaster = ({ ...props }: ToasterProps) => {
    const isMobile = useIsMobile();

    return (
        <Sonner
            theme="system"
            position={isMobile ? 'bottom-center' : 'top-right'}
            className="toaster group"
            icons={{
                success: <CircleCheckIcon className="size-5 text-emerald-600 stroke-[3] drop-shadow-lg"/>,
                info: <InfoIcon className="size-5 text-white stroke-[3] drop-shadow-lg"/>,
                warning: <TriangleAlertIcon className="size-5 text-white stroke-[3] drop-shadow-lg"/>,
                error: <OctagonXIcon className="size-5 text-white stroke-[3] drop-shadow-lg"/>,
                loading: <Loader2Icon className="size-5 animate-spin text-white stroke-[3] drop-shadow-lg"/>
            }}
            toastOptions={{
                classNames: {
                    toast: 'bg-gradient-to-r shadow-xl border-0 backdrop-blur-sm',
                    success: 'bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white',
                    error: 'bg-gradient-to-r from-rose-500 via-pink-500 to-fuchsia-500 text-white',
                    warning: 'bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 text-white',
                    info: 'bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white',
                    loading: 'bg-gradient-to-r from-slate-500 via-slate-600 to-slate-700 text-white'
                }
            }}
            style={
                {
                    '--normal-bg': 'var(--popover)',
                    '--normal-text': 'var(--popover-foreground)',
                    '--normal-border': 'var(--border)',
                    '--border-radius': 'var(--radius)'
                } as React.CSSProperties
            }
            {...props}
        />
    );
};

export { Toaster };