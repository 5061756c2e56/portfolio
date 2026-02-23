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

import { type MouseEvent, useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import {
    BarChart3, BookOpen, ChevronRight, ChevronsUpDown, Files, FileText, FileUser, FolderOpen, Gamepad2, GitPullRequest,
    Globe, HelpCircle, Home, Mail, MailOpen, Moon, Scale, ScrollText, ShieldCheck, Sparkles, Sun, User, Zap
} from 'lucide-react';

import {
    Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarHeader, SidebarMenu,
    SidebarMenuButton, SidebarMenuItem, SidebarMenuSkeleton, SidebarSeparator, SidebarTrigger, useSidebar
} from '@/components/ui/sidebar';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';

import { Flag } from '@/components/Flag';
import { useLocaleContext } from '@/components/LocaleProvider';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';
import { useChristmasMode } from '@/hooks/use-christmas';
import { HalloweenPumpkin } from '@/components/halloween/HalloweenPumpkin';
import { useHalloweenMode } from '@/hooks/use-halloween';
import { useActiveSection } from '@/hooks/use-active-section';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { defaultLocale, Link, localeFlags, locales, usePathname } from '@/i18n/routing';
import { cn } from '@/lib/utils';

const HOME_SECTIONS = [
    { id: 'about', icon: User },
    { id: 'skills', icon: Zap },
    { id: 'parcours', icon: BookOpen },
    { id: 'projects', icon: FolderOpen },
    { id: 'contact', icon: Mail },
    { id: 'extras', icon: Sparkles }
] as const;

const DOCUMENT_PAGES = [
    { href: '/curriculum-vitae', labelKey: 'curriculumVitae', icon: FileUser },
    { href: '/motivation-letter', labelKey: 'motivationLetter', icon: MailOpen }
] as const;

const OTHER_PAGES = [
    { href: '/faq', labelKey: 'faq', icon: HelpCircle },
    { href: '/stats', labelKey: 'statsGithub', icon: BarChart3 },
    { href: '/games', labelKey: 'games', icon: Gamepad2 }
] as const;

const LEGAL_PAGES = [
    { href: '/legal/terms', labelKey: 'footer.terms', icon: ScrollText },
    { href: '/legal/legal-notice', labelKey: 'footer.legalNotice', icon: FileText },
    { href: '/legal/privacy-policy', labelKey: 'footer.privacy', icon: ShieldCheck }
] as const;

const LS_HOME_EXPANDED_KEY = 'sidebar_home_expanded';
const LS_DOCUMENTS_EXPANDED_KEY = 'sidebar_documents_expanded';
const LS_LEGAL_EXPANDED_KEY = 'sidebar_legal_expanded';
const LS_OTHER_PAGES_EXPANDED_KEY = 'sidebar_other_pages_expanded';
const HOME_SECTION_GAP = 32;
const multilineMenuTextFix =
    '[&>span:last-child]:!whitespace-normal [&>span:last-child]:!break-normal [&>span:last-child]:![overflow-wrap:normal] [&>span:last-child]:!overflow-visible [&>span:last-child]:!text-clip [&>span:last-child]:!leading-snug';

const activeItemClass =
    `!h-auto min-h-8 !items-center py-1.5 text-sidebar-foreground/70 hover:text-sidebar-foreground data-[active=true]:text-blue-600 dark:data-[active=true]:text-blue-400 data-[active=true]:bg-blue-500/10 ${multilineMenuTextFix}`;
const navIconClass =
    'h-4 w-4 shrink-0 transition-[width,height] duration-200 group-data-[collapsible=icon]:h-3.5 group-data-[collapsible=icon]:w-3.5';
const sectionContentInsetClass =
    'mt-1 ml-5 border-l border-sidebar-border/80 pl-2 group-data-[collapsible=icon]:ml-0 group-data-[collapsible=icon]:border-l-0 group-data-[collapsible=icon]:pl-0';
const navLabelClass =
    'block min-w-0 flex-1 text-left leading-snug whitespace-normal break-normal [overflow-wrap:normal] group-data-[collapsible=icon]:hidden';
const brandIconSlotClass =
    'relative grid h-7 w-7 shrink-0 place-items-center transition-opacity duration-200 md:group-data-[state=collapsed]:group-hover:opacity-0 md:group-data-[state=collapsed]:group-focus-within:opacity-0';
const seasonalBrandIconClass = 'h-[22px] w-[22px]';
const normalizeSearchValue = (value: string) =>
    value.toLocaleLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

export function AppSidebar() {
    const t = useTranslations('nav');
    const tAll = useTranslations();
    const { theme, setTheme } = useTheme();
    const christmasMode = useChristmasMode();
    const halloweenMode = useHalloweenMode();
    const pathname = usePathname();
    const activeSection = useActiveSection();
    const { scrollTo } = useSmoothScroll();
    const { setOpenMobile, state: sidebarState } = useSidebar();
    const { locale, showLocaleLoading } = useLocaleContext();
    const router = useRouter();

    const [mounted, setMounted] = useState(false);
    const [navStateReady, setNavStateReady] = useState(false);
    const [langOpen, setLangOpen] = useState(false);
    const [languageSearch, setLanguageSearch] = useState('');
    const [homeExpanded, setHomeExpanded] = useState(true);
    const [documentsExpanded, setDocumentsExpanded] = useState(true);
    const [legalExpanded, setLegalExpanded] = useState(true);
    const [otherPagesExpanded, setOtherPagesExpanded] = useState(true);

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    useEffect(() => {
        if (!mounted) return;

        let nextHomeExpanded = true;
        let nextDocumentsExpanded = true;
        let nextLegalExpanded = true;
        let nextOtherPagesExpanded = true;

        try {
            const savedHome = localStorage.getItem(LS_HOME_EXPANDED_KEY);
            const savedDocuments = localStorage.getItem(LS_DOCUMENTS_EXPANDED_KEY);
            const savedLegal = localStorage.getItem(LS_LEGAL_EXPANDED_KEY);
            const savedOtherPages = localStorage.getItem(LS_OTHER_PAGES_EXPANDED_KEY);
            if (savedHome !== null) {
                nextHomeExpanded = savedHome !== 'false';
            }
            if (savedDocuments !== null) {
                nextDocumentsExpanded = savedDocuments !== 'false';
            }
            if (savedLegal !== null) {
                nextLegalExpanded = savedLegal !== 'false';
            }
            if (savedOtherPages !== null) {
                nextOtherPagesExpanded = savedOtherPages !== 'false';
            }
        } catch {
        }

        const frameId = window.requestAnimationFrame(() => {
            setHomeExpanded(nextHomeExpanded);
            setDocumentsExpanded(nextDocumentsExpanded);
            setLegalExpanded(nextLegalExpanded);
            setOtherPagesExpanded(nextOtherPagesExpanded);
            setNavStateReady(true);
        });

        return () => {
            window.cancelAnimationFrame(frameId);
        };
    }, [mounted]);

    useEffect(() => {
        if (!mounted || !navStateReady) return;

        try {
            localStorage.setItem(LS_HOME_EXPANDED_KEY, String(homeExpanded));
            localStorage.setItem(LS_DOCUMENTS_EXPANDED_KEY, String(documentsExpanded));
            localStorage.setItem(LS_LEGAL_EXPANDED_KEY, String(legalExpanded));
            localStorage.setItem(LS_OTHER_PAGES_EXPANDED_KEY, String(otherPagesExpanded));
        } catch {
        }
    }, [homeExpanded, documentsExpanded, legalExpanded, otherPagesExpanded, mounted, navStateReady]);

    useEffect(() => {
        const id = window.requestAnimationFrame(() => {
            setOpenMobile(false);
        });
        return () => window.cancelAnimationFrame(id);
    }, [pathname, setOpenMobile]);

    const isHome = pathname === '/';
    const isSidebarCollapsed = sidebarState === 'collapsed';
    const currentLocale = mounted ? locale : defaultLocale;
    const isDark = mounted && theme === 'dark';
    const isSidebarLoading = !mounted || !navStateReady;
    const sidebarToggleLabel = isSidebarCollapsed ? t('openSidebar') : t('closeSidebar');
    const filteredLocales = useMemo(() => {
        const normalizedQuery = normalizeSearchValue(languageSearch.trim());
        if (!normalizedQuery) return locales;

        return locales.filter((loc) => {
            const label = tAll(`locales.${loc}` as Parameters<typeof tAll>[0]);
            return normalizeSearchValue(label).includes(normalizedQuery)
                   || normalizeSearchValue(loc).includes(normalizedQuery);
        });
    }, [languageSearch, tAll]);

    const handleSectionClick = (e: MouseEvent<HTMLAnchorElement>, sectionId: string) => {
        if (isHome) {
            e.preventDefault();
            scrollTo(`#${sectionId}`, HOME_SECTION_GAP);
        }
        setOpenMobile(false);
    };

    const handleBrandClick = (e: MouseEvent<HTMLAnchorElement>) => {
        if (isHome) {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        setOpenMobile(false);
    };

    const switchLocale = (newLocale: string) => {
        if (!mounted || newLocale === locale) return;
        showLocaleLoading(t('languageChanging'));
        const newPath = newLocale === defaultLocale ? pathname : `/${newLocale}${pathname}`;
        router.push(newPath);
    };
    const handleLangOpenChange = (open: boolean) => {
        setLangOpen(open);
        if (!open) {
            setLanguageSearch('');
        }
    };

    return (
        <Sidebar
            collapsible="icon"
            className="border-r border-sidebar-border overflow-x-hidden touch-pan-y"
        >
            <SidebarHeader className="px-3 py-0">
                {isSidebarLoading ? (
                    <div className="relative flex items-center gap-2 py-4">
                        <div className="flex min-w-0 flex-1 items-center gap-2.5">
                            <Skeleton className="h-7 w-7 shrink-0 rounded-full" />
                            <Skeleton className="h-4 w-28 group-data-[collapsible=icon]:hidden" />
                        </div>
                        <Skeleton className="hidden h-4 w-4 shrink-0 rounded-sm md:block" />
                    </div>
                ) : (
                    <div className="relative flex items-center gap-2 py-4">
                        <Link
                            href="/"
                            className="flex min-w-0 flex-1 items-center gap-2.5 font-semibold leading-none transition-opacity hover:opacity-80"
                            onClick={handleBrandClick}
                            suppressHydrationWarning
                        >
                            <div className={brandIconSlotClass}>
                                {halloweenMode ? (
                                    <HalloweenPumpkin size={22} className={seasonalBrandIconClass} />
                                ) : christmasMode ? (
                                    <ChristmasHat size={22} className={cn(seasonalBrandIconClass, 'text-primary')} />
                                ) : (
                                    <div
                                        className="relative h-6 w-6 overflow-hidden rounded-full border border-blue-500/30 transition-all duration-300 hover:border-blue-500/50">
                                        <Image
                                            src="/favicon.ico"
                                            alt="Paul Viandier"
                                            fill
                                            className="object-cover"
                                            sizes="24px"
                                        />
                                    </div>
                                )}
                            </div>
                            <span
                                className="truncate bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-base leading-none text-transparent group-data-[collapsible=icon]:hidden">
                                Paul Viandier
                            </span>
                        </Link>

                        <Tooltip>
                            <TooltipTrigger asChild>
                                <SidebarTrigger
                                    aria-label={sidebarToggleLabel}
                                    className="hidden shrink-0 md:inline-flex md:opacity-80 md:transition-opacity md:duration-200 md:hover:opacity-100 md:group-data-[state=collapsed]:invisible md:group-data-[state=collapsed]:opacity-0 md:group-data-[state=collapsed]:pointer-events-none md:group-data-[state=collapsed]:group-hover:absolute md:group-data-[state=collapsed]:group-hover:left-0 md:group-data-[state=collapsed]:group-hover:top-1/2 md:group-data-[state=collapsed]:group-hover:-translate-y-1/2 md:group-data-[state=collapsed]:group-hover:visible md:group-data-[state=collapsed]:group-hover:opacity-100 md:group-data-[state=collapsed]:group-hover:pointer-events-auto md:group-data-[state=collapsed]:group-hover:!h-7 md:group-data-[state=collapsed]:group-hover:!w-7 md:group-data-[state=collapsed]:group-hover:[&>svg]:!size-4 [&>svg]:transition-transform [&>svg]:duration-300 group-data-[state=collapsed]:[&>svg]:rotate-180"
                                />
                            </TooltipTrigger>
                            <TooltipContent side="right" align="center">
                                {sidebarToggleLabel}
                            </TooltipContent>
                        </Tooltip>
                    </div>
                )}
                <SidebarSeparator className="mx-0" />
            </SidebarHeader>

            <SidebarContent className="overflow-x-hidden">
                {isSidebarLoading ? (
                    <SidebarGroup className="px-2 pt-2 pb-2">
                        <SidebarMenu>
                            {Array.from({ length: 9 }, (_, index) => (
                                <SidebarMenuItem key={`sidebar-skeleton-${index}`}>
                                    <SidebarMenuSkeleton showIcon className="h-9" />
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroup>
                ) : (
                    <>
                        {isHome ? (
                            <SidebarGroup className="px-2 pt-2 pb-0">
                                <SidebarMenu>
                                    <SidebarMenuItem>
                                        <SidebarMenuButton
                                            onClick={() => setHomeExpanded((value) => !value)}
                                            tooltip={t('home')}
                                            className="!h-auto min-h-9 py-2 text-black dark:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                                        >
                                            <Home className={navIconClass} />
                                            <span className={navLabelClass}>{t('home')}</span>
                                            <ChevronRight
                                                className={cn(
                                                    'ml-auto h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 group-data-[collapsible=icon]:hidden',
                                                    homeExpanded && 'rotate-90'
                                                )}
                                            />
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                </SidebarMenu>

                                <div
                                    className={cn(
                                        'grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                        homeExpanded
                                        || isSidebarCollapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] -translate-y-1 opacity-0'
                                    )}
                                >
                                    <div className="overflow-hidden">
                                        <SidebarGroupContent className={sectionContentInsetClass}>
                                            <SidebarMenu className="gap-1">
                                                {HOME_SECTIONS.map(({ id, icon: Icon }) => (
                                                    <SidebarMenuItem key={id}>
                                                        <SidebarMenuButton
                                                            asChild
                                                            tooltip={t(id)}
                                                            isActive={activeSection === id}
                                                            className={activeItemClass}
                                                        >
                                                            <a href={`#${id}`}
                                                               onClick={(e) => handleSectionClick(e, id)}>
                                                                <Icon className={navIconClass} />
                                                                <span className={navLabelClass}>{t(id)}</span>
                                                            </a>
                                                        </SidebarMenuButton>
                                                    </SidebarMenuItem>
                                                ))}
                                            </SidebarMenu>
                                        </SidebarGroupContent>
                                    </div>
                                </div>
                            </SidebarGroup>
                        ) : (
                            <SidebarGroup className="px-2 pt-2 pb-0">
                                <SidebarGroupContent className="mt-0">
                                    <SidebarMenu>
                                        <SidebarMenuItem>
                                            <SidebarMenuButton
                                                asChild
                                                tooltip={t('home')}
                                                className="!h-auto min-h-9 py-2 text-black dark:text-sidebar-foreground"
                                            >
                                                <Link href="/" onClick={() => setOpenMobile(false)}>
                                                    <Home className={navIconClass} />
                                                    <span className={navLabelClass}>{t('home')}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        )}

                        <SidebarSeparator />

                        <SidebarGroup className="px-2 pb-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => setDocumentsExpanded((value) => !value)}
                                        tooltip={t('documents')}
                                        className="!h-auto min-h-9 py-2 text-black dark:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                                    >
                                        <Files className={navIconClass} />
                                        <span className={navLabelClass}>{t('documents')}</span>
                                        <ChevronRight
                                            className={cn(
                                                'ml-auto h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 group-data-[collapsible=icon]:hidden',
                                                documentsExpanded && 'rotate-90'
                                            )}
                                        />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <div
                                className={cn(
                                    'grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                    documentsExpanded
                                    || isSidebarCollapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] -translate-y-1 opacity-0'
                                )}
                            >
                                <div className="overflow-hidden">
                                    <SidebarGroupContent className={sectionContentInsetClass}>
                                        <SidebarMenu className="gap-1">
                                            {DOCUMENT_PAGES.map(({ href, labelKey, icon: Icon }) => (
                                                <SidebarMenuItem key={href}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        tooltip={t(labelKey)}
                                                        isActive={pathname === href}
                                                        className={activeItemClass}
                                                    >
                                                        <Link href={href} onClick={() => setOpenMobile(false)}>
                                                            <Icon className={navIconClass} />
                                                            <span className={navLabelClass}>{t(labelKey)}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </div>
                            </div>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup className="px-2 pb-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => setLegalExpanded((value) => !value)}
                                        tooltip={tAll('footer.legalTitle' as Parameters<typeof tAll>[0])}
                                        className="!h-auto min-h-9 py-2 text-black dark:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                                    >
                                        <Scale className={navIconClass} />
                                        <span className={navLabelClass}>
                                            {tAll('footer.legalTitle' as Parameters<typeof tAll>[0])}
                                        </span>
                                        <ChevronRight
                                            className={cn(
                                                'ml-auto h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 group-data-[collapsible=icon]:hidden',
                                                legalExpanded && 'rotate-90'
                                            )}
                                        />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <div
                                className={cn(
                                    'grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                    legalExpanded
                                    || isSidebarCollapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] -translate-y-1 opacity-0'
                                )}
                            >
                                <div className="overflow-hidden">
                                    <SidebarGroupContent className={sectionContentInsetClass}>
                                        <SidebarMenu className="gap-1">
                                            {LEGAL_PAGES.map(({ href, labelKey, icon: Icon }) => (
                                                <SidebarMenuItem key={href}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        tooltip={tAll(labelKey as Parameters<typeof tAll>[0])}
                                                        isActive={pathname === href}
                                                        className={activeItemClass}
                                                    >
                                                        <Link href={href} onClick={() => setOpenMobile(false)}>
                                                            <Icon className={navIconClass} />
                                                            <span className={navLabelClass}>
                                                        {(
                                                            () => {
                                                                const label = tAll(labelKey as Parameters<typeof tAll>[0]);
                                                                if (currentLocale === 'fr' && labelKey
                                                                    === 'footer.privacy') {
                                                                    const lastSpaceIndex = label.lastIndexOf(' ');
                                                                    if (lastSpaceIndex > 0) {
                                                                        return (
                                                                            <>
                                                                                {label.slice(0, lastSpaceIndex)}
                                                                                <br />
                                                                                {label.slice(lastSpaceIndex + 1)}
                                                                            </>
                                                                        );
                                                                    }
                                                                }
                                                                return label;
                                                            }
                                                        )()}
                                                    </span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </div>
                            </div>
                        </SidebarGroup>

                        <SidebarSeparator />

                        <SidebarGroup className="px-2 pb-2">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton
                                        onClick={() => setOtherPagesExpanded((value) => !value)}
                                        tooltip={t('otherPages')}
                                        className="!h-auto min-h-9 py-2 text-black dark:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                                    >
                                        <Globe className={navIconClass} />
                                        <span className={navLabelClass}>{t('otherPages')}</span>
                                        <ChevronRight
                                            className={cn(
                                                'ml-auto h-3.5 w-3.5 shrink-0 opacity-70 transition-transform duration-300 group-data-[collapsible=icon]:hidden',
                                                otherPagesExpanded && 'rotate-90'
                                            )}
                                        />
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>

                            <div
                                className={cn(
                                    'grid overflow-hidden transition-[grid-template-rows,opacity,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                                    otherPagesExpanded
                                    || isSidebarCollapsed ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] -translate-y-1 opacity-0'
                                )}
                            >
                                <div className="overflow-hidden">
                                    <SidebarGroupContent className={sectionContentInsetClass}>
                                        <SidebarMenu className="gap-1">
                                            {OTHER_PAGES.map(({ href, labelKey, icon: Icon }) => (
                                                <SidebarMenuItem key={href}>
                                                    <SidebarMenuButton
                                                        asChild
                                                        tooltip={t(labelKey)}
                                                        isActive={pathname === href}
                                                        className={activeItemClass}
                                                    >
                                                        <Link href={href} onClick={() => setOpenMobile(false)}>
                                                            <Icon className={navIconClass} />
                                                            <span className={navLabelClass}>{t(labelKey)}</span>
                                                        </Link>
                                                    </SidebarMenuButton>
                                                </SidebarMenuItem>
                                            ))}
                                        </SidebarMenu>
                                    </SidebarGroupContent>
                                </div>
                            </div>
                        </SidebarGroup>
                    </>
                )}
            </SidebarContent>

            <SidebarFooter className="gap-1 border-t border-sidebar-border px-2 py-3">
                {isSidebarLoading ? (
                    <>
                        <SidebarMenuSkeleton showIcon className="h-9" />
                        <SidebarMenuSkeleton showIcon className="h-9" />
                    </>
                ) : (
                    <>
                        <DropdownMenu open={langOpen} onOpenChange={handleLangOpenChange} modal={false}>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton
                                    className="!h-auto min-h-9 w-full px-2 py-2 text-sidebar-foreground/80"
                                    tooltip={t('language')}
                                >
                                    {mounted ? (
                                        <Flag
                                            code={localeFlags[currentLocale as keyof typeof localeFlags]}
                                            className="h-4 w-5 shrink-0 object-cover"
                                        />
                                    ) : (
                                        <Globe className="h-4 w-4 shrink-0" />
                                    )}
                                    <span className={cn('flex-1 text-sm', navLabelClass)}>{t('language')}</span>
                                    <ChevronsUpDown
                                        className="h-3.5 w-3.5 shrink-0 opacity-60 group-data-[collapsible=icon]:hidden" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                align="start"
                                sideOffset={8}
                                alignOffset={18}
                                className="w-56 p-0"
                            >
                                <div className="border-b border-border/70 px-2 py-2">
                                    <input
                                        type="text"
                                        value={languageSearch}
                                        onChange={(e) => setLanguageSearch(e.target.value)}
                                        onKeyDown={(e) => e.stopPropagation()}
                                        placeholder={t('searchLanguage')}
                                        aria-label={t('searchLanguage')}
                                        autoFocus
                                        className="h-8 w-full rounded-md border border-border/70 bg-transparent px-2 text-xs outline-hidden placeholder:text-muted-foreground/80 focus-visible:ring-1 focus-visible:ring-ring"
                                    />
                                </div>
                                <div
                                    className="scrollbar-sidebar max-h-48 overflow-y-auto overscroll-contain touch-pan-y [-webkit-overflow-scrolling:touch]"
                                    onWheel={(e) => e.stopPropagation()}
                                    onTouchMove={(e) => e.stopPropagation()}
                                >
                                    {filteredLocales.length === 0 ? (
                                        <div className="px-3 py-2 text-xs text-muted-foreground">
                                            {t('noLanguageFound')}
                                        </div>
                                    ) : (
                                        filteredLocales.map((loc) => (
                                            <DropdownMenuItem
                                                key={loc}
                                                onClick={() => switchLocale(loc)}
                                                className={cn(
                                                    '!h-auto min-h-8 items-center py-2',
                                                    currentLocale === loc && 'bg-muted'
                                                )}
                                            >
                                                <Flag
                                                    code={localeFlags[loc]}
                                                    className="mr-2 h-4 w-5 shrink-0 object-cover"
                                                />
                                                <span
                                                    className="flex-1 leading-snug whitespace-normal break-words">
                                                    {tAll(`locales.${loc}` as Parameters<typeof tAll>[0])}
                                                </span>
                                                {currentLocale === loc && (
                                                    <svg
                                                        className="h-4 w-4 shrink-0"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        viewBox="0 0 24 24"
                                                        strokeWidth={2}
                                                    >
                                                        <path strokeLinecap="round" strokeLinejoin="round"
                                                              d="M5 13l4 4L19 7" />
                                                    </svg>
                                                )}
                                            </DropdownMenuItem>
                                        ))
                                    )}
                                </div>
                                <a
                                    href="https://github.com/5061756c2e56/portfolio/pulls"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="mt-1 flex items-center gap-2 border-t border-border px-3 pt-2 pb-1.5 text-xs text-muted-foreground transition-colors duration-200 hover:text-primary"
                                >
                                    <GitPullRequest className="h-3.5 w-3.5 shrink-0" />
                                    {t('helpTranslate')}
                                </a>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <div
                            className="flex h-9 cursor-pointer items-center justify-between rounded-md px-2 py-1.5 transition-colors hover:bg-sidebar-accent group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
                            onClick={() => setTheme(isDark ? 'light' : 'dark')}
                        >
                            <div className="flex min-w-0 items-center gap-2 group-data-[collapsible=icon]:hidden">
                                {isDark ? <Moon className="h-4 w-4 shrink-0" /> : <Sun className="h-4 w-4 shrink-0" />}
                                <span className={cn('text-sm', navLabelClass)}>{t('theme')}</span>
                            </div>
                            <Switch
                                aria-label={t('theme')}
                                className="h-6 w-11 shrink-0 cursor-pointer border data-[state=checked]:border-indigo-700 data-[state=checked]:bg-indigo-950 data-[state=unchecked]:border-blue-300 data-[state=unchecked]:bg-blue-100"
                                thumbClassName="size-5 data-[state=checked]:bg-indigo-900 data-[state=checked]:shadow-md data-[state=unchecked]:bg-white data-[state=unchecked]:shadow-md"
                                checked={isDark}
                                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                                onClick={(e) => e.stopPropagation()}
                            >
                                {isDark ? <Moon className="h-3 w-3 text-white" /> :
                                    <Sun className="h-3 w-3 text-black" />}
                            </Switch>
                        </div>
                    </>
                )}
            </SidebarFooter>

        </Sidebar>
    );
}
