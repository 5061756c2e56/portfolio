'use client';

import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    useSidebar
} from '@/components/ui/sidebar';

import {
    usePathname,
    useRouter
} from '@/i18n/routing';

import {
    useCallback,
    useEffect,
    useState,
    useTransition
} from 'react';

import {
    useLocale,
    useTranslations
} from 'next-intl';

import { useTheme } from 'next-themes';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

export function CVSidebar() {
    const t = useTranslations('nav');
    const tCV = useTranslations('cv');
    const {
        theme,
        setTheme
    } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [isPending, startTransition] = useTransition();
    const {
        open,
        setOpen
    } = useSidebar();

    useEffect(() => {
        setMounted(true);
    }, []);

    const switchLocale = (newLocale: string) => {
        if (mounted && newLocale !== currentLocale) {
            startTransition(() => {
                router.replace(pathname, { locale: newLocale });
            });
        }
    };

    const handleThemeChange = (newTheme: string) => {
        if (mounted && newTheme !== currentTheme) {
            startTransition(() => {
                setTheme(newTheme);
            });
        }
    };

    const currentTheme = mounted ? theme : 'dark';
    const currentLocale = mounted ? locale : 'fr';

    const handleDownloadCV = useCallback(async () => {
        try {
            const response = await fetch('/Curriculum Vitae - Viandier Paul.pdf');
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = 'Curriculum Vitae - Viandier Paul.pdf';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Erreur lors du téléchargement:', error);
        }
    }, []);

    return (
        <>
            {isPending && (
                <div
                    className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in-0">
                    <div className="flex flex-col items-center gap-4">
                        <Spinner className="size-8 text-foreground"/>
                        <p className="text-sm text-muted-foreground">{t('loading')}</p>
                    </div>
                </div>
            )}
            {open && (
                <button
                    onClick={() => setOpen(false)}
                    className="fixed top-4 right-4 z-[60] lg:hidden inline-flex items-center justify-center rounded-md p-2 text-foreground bg-background border border-border hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring shadow-lg"
                    aria-label={t('closeMenu')}
                >
                    <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                </button>
            )}
            <Sidebar side="left">
                <SidebarHeader>
                    <div className="flex items-center gap-3 w-full">
                        <div className="relative flex-shrink-0">
                            <Image
                                src="/pfp.png"
                                alt="Paul Viandier"
                                width={40}
                                height={40}
                                className="h-10 w-10 rounded-full object-cover ring-2 ring-border"
                                priority
                            />
                        </div>
                        <span className="font-semibold text-foreground">Paul Viandier</span>
                    </div>
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={() => router.push('/')}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>
                                </svg>
                                {t('home')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                onClick={handleDownloadCV}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                                </svg>
                                {tCV('downloadCV')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter>
                    <div className="space-y-0">
                        <div className="px-3 pb-2">
                            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t('language')}</p>
                            <div className="space-y-1">
                                <button
                                    onClick={() => switchLocale('fr')}
                                    disabled={isPending}
                                    className={cn(
                                        'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                                        currentLocale === 'fr'
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                                    </svg>
                                    {t('french')}
                                    {currentLocale === 'fr' && !isPending && (
                                        <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                    {isPending && currentLocale !== 'fr' && (
                                        <Spinner className="ml-auto h-4 w-4"/>
                                    )}
                                </button>
                                <button
                                    onClick={() => switchLocale('en')}
                                    disabled={isPending}
                                    className={cn(
                                        'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                                        currentLocale === 'en'
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
                                    </svg>
                                    {t('english')}
                                    {currentLocale === 'en' && !isPending && (
                                        <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                    {isPending && currentLocale !== 'en' && (
                                        <Spinner className="ml-auto h-4 w-4"/>
                                    )}
                                </button>
                            </div>
                        </div>
                        <div className="border-t border-border my-2"></div>
                        <div className="px-3 pt-2">
                            <p className="mb-2 text-xs font-semibold text-muted-foreground uppercase">{t('theme')}</p>
                            <div className="space-y-1">
                                <button
                                    onClick={() => handleThemeChange('dark')}
                                    disabled={isPending}
                                    className={cn(
                                        'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                                        currentTheme === 'dark'
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                                    </svg>
                                    {t('dark')}
                                    {currentTheme === 'dark' && !isPending && (
                                        <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                    {isPending && currentTheme !== 'dark' && (
                                        <Spinner className="ml-auto h-4 w-4"/>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleThemeChange('light')}
                                    disabled={isPending}
                                    className={cn(
                                        'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                                        currentTheme === 'light'
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                                    </svg>
                                    {t('light')}
                                    {currentTheme === 'light' && !isPending && (
                                        <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                    {isPending && currentTheme !== 'light' && (
                                        <Spinner className="ml-auto h-4 w-4"/>
                                    )}
                                </button>
                                <button
                                    onClick={() => handleThemeChange('system')}
                                    disabled={isPending}
                                    className={cn(
                                        'w-full flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
                                        currentTheme === 'system'
                                            ? 'bg-muted text-foreground'
                                            : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                    )}
                                >
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                         strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                    </svg>
                                    {t('system')}
                                    {currentTheme === 'system' && !isPending && (
                                        <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor"
                                             viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                                        </svg>
                                    )}
                                    {isPending && currentTheme !== 'system' && (
                                        <Spinner className="ml-auto h-4 w-4"/>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}