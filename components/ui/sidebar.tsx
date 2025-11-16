'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

interface SidebarContextValue {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SidebarContext = React.createContext<SidebarContextValue | undefined>(undefined);

export function useSidebar() {
    const context = React.useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within SidebarProvider');
    }
    return context;
}

interface SidebarProviderProps {
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export function SidebarProvider({
    children,
    defaultOpen = false
}: SidebarProviderProps) {
    const [open, setOpen] = React.useState(defaultOpen);
    const [initialized, setInitialized] = React.useState(false);

    React.useEffect(() => {
        if (!initialized && typeof window !== 'undefined') {
            const isDesktop = window.innerWidth >= 1024;
            setOpen(isDesktop);
            setInitialized(true);
        }
    }, [initialized]);

    return (
        <SidebarContext.Provider value={{
            open,
            setOpen
        }}>
            {children}
        </SidebarContext.Provider>
    );
}

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
    side?: 'left' | 'right';
}

export function Sidebar({
    side = 'left',
    className,
    children,
    ...props
}: SidebarProps) {
    const { open } = useSidebar();

    return (
        <>
            <div
                className={cn(
                    'fixed inset-y-0 z-50 w-64 border-r border-border bg-card transition-transform duration-300 ease-in-out',
                    side === 'left' ? 'left-0' : 'right-0',
                    open ? 'translate-x-0' : side
                                             === 'left' ? '-translate-x-full lg:translate-x-0' : 'translate-x-full lg:translate-x-0',
                    className
                )}
                {...props}
            >
                {children}
            </div>
            {open && <Backdrop/>}
        </>
    );
}

export function SidebarHeader({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex h-16 shrink-0 items-center gap-2 border-b border-border px-6', className)}
            {...props}
        />
    );
}

export function SidebarContent({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('flex-1 overflow-y-auto px-4 py-4', className)}
            {...props}
        />
    );
}

export function SidebarFooter({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn('mt-auto border-t border-border px-4 pt-2 pb-4', className)}
            {...props}
        />
    );
}

export function SidebarTrigger({
    className,
    ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) {
    const {
        open,
        setOpen
    } = useSidebar();

    return (
        <button
            onClick={() => setOpen(!open)}
            className={cn(
                'inline-flex items-center justify-center rounded-md p-2 text-foreground hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed',
                className
            )}
            {...props}
        >
            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                {open ? (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                )}
            </svg>
            <span className="sr-only">Toggle sidebar</span>
        </button>
    );
}

export function SidebarMenu({
    className,
    ...props
}: React.HTMLAttributes<HTMLUListElement>) {
    return (
        <ul className={cn('space-y-1', className)} {...props} />
    );
}

export function SidebarMenuItem({
    className,
    ...props
}: React.LiHTMLAttributes<HTMLLIElement>) {
    return (
        <li className={cn('', className)} {...props} />
    );
}

interface SidebarMenuButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    active?: boolean;
}

export function SidebarMenuButton({
    active,
    className,
    ...props
}: SidebarMenuButtonProps) {
    return (
        <button
            className={cn(
                'flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted hover:text-foreground cursor-pointer',
                active && 'bg-muted text-foreground',
                className
            )}
            {...props}
        />
    );
}

function Backdrop() {
    const { setOpen } = useSidebar();
    return (
        <div
            className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden"
            onClick={() => setOpen(false)}
        />
    );
}

export function SidebarInset({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'flex flex-1 flex-col transition-all duration-300 lg:ml-64',
                className
            )}
            {...props}
        />
    );
}