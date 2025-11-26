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
import GitHubStatsSidebar from '@/components/GitHubStatsSidebar';
import { cn } from '@/lib/utils';

export function AppSidebar() {
    const t = useTranslations('nav');
    const {
        theme,
        setTheme
    } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [activeSection, setActiveSection] = useState('home');
    const [isPending, startTransition] = useTransition();
    const {
        open,
        setOpen
    } = useSidebar();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            const sections = ['home', 'about', 'skills', 'projects', 'github-stats', 'contact'];
            const scrollPosition = window.scrollY;
            const windowHeight = window.innerHeight;
            const viewportThreshold = scrollPosition + windowHeight * 0.5;

            if (scrollPosition < 100) {
                setActiveSection('home');
                return;
            }

            let active = 'home';

            for (let i = 0; i < sections.length; i++) {
                const section = sections[i];
                const element = document.getElementById(section);
                if (element) {
                    const {
                        offsetTop,
                        offsetHeight
                    } = element;
                    const elementTop = offsetTop;
                    const elementBottom = offsetTop + offsetHeight;

                    if (viewportThreshold >= elementTop) {
                        if (i === sections.length - 1) {
                            if (viewportThreshold <= elementBottom) {
                                active = section;
                                break;
                            }
                        } else {
                            const nextElement = document.getElementById(sections[i + 1]);
                            if (nextElement) {
                                const nextElementTop = nextElement.offsetTop;
                                if (viewportThreshold < nextElementTop) {
                                    active = section;
                                    break;
                                }
                            } else {
                                active = section;
                                break;
                            }
                        }
                    }
                }
            }
            setActiveSection(active);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
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

    const scrollToSection = (sectionId: string) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
            if (window.innerWidth < 1024) {
                setOpen(false);
            }
        }
    };

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
                                active={activeSection === 'home'}
                                onClick={() => scrollToSection('home')}
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
                                onClick={() => {
                                    startTransition(() => {
                                        router.push('/curriculum-vitae');
                                    });
                                    if (window.innerWidth < 1024) {
                                        setOpen(false);
                                    }
                                }}
                                className="pl-6"
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                                </svg>
                                {t('cv')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                active={activeSection === 'about'}
                                onClick={() => scrollToSection('about')}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/>
                                </svg>
                                {t('about')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                active={activeSection === 'skills'}
                                onClick={() => scrollToSection('skills')}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"/>
                                </svg>
                                {t('skills')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                active={activeSection === 'projects'}
                                onClick={() => scrollToSection('projects')}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                                </svg>
                                {t('projects')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                active={activeSection === 'github-stats'}
                                onClick={() => scrollToSection('github-stats')}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/>
                                </svg>
                                {t('stats')}
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                active={activeSection === 'contact'}
                                onClick={() => scrollToSection('contact')}
                            >
                                <svg className="h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                </svg>
                                {t('contact')}
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
                        <div className="border-t border-border my-2"></div>
                        <GitHubStatsSidebar />
                    </div>
                </SidebarFooter>
            </Sidebar>
        </>
    );
}