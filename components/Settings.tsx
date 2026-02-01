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

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { useEffect, useState } from 'react';

import { useLocaleContext } from '@/components/LocaleProvider';
import { useTranslations } from 'next-intl';
import { useTheme } from '@/hooks/use-theme';
import { usePathname } from '@/i18n/routing';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasBarleySugar } from '@/components/christmas/ChristmasBarleySugar';
import { cn } from '@/lib/utils';

export default function Settings() {
    const { locale, showLocaleLoading } = useLocaleContext();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations('nav');
    const { theme, setTheme } = useTheme();
    const christmasMode = useChristmasMode();

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    const switchLocale = (newLocale: 'fr' | 'en') => {
        if (!mounted || newLocale === locale) return;

        showLocaleLoading();

        const newPath = newLocale === 'fr' ? pathname : `/${newLocale}${pathname}`;
        window.location.href = newPath;
    };

    const currentLocale: 'fr' | 'en' = mounted ? locale : 'fr';

    if (!mounted) {
        return (
            <button
                className={cn(
                    'group inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer shrink-0 overflow-visible',
                    christmasMode ? 'p-0.5' : 'p-2'
                )}
                aria-label={t('settings')}
                disabled
            >
                {christmasMode ? (
                    <ChristmasBarleySugar size={45} className="transition-transform duration-300"/>
                ) : (
                    <svg
                        className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-90"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                        />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                )}
            </button>
        );
    }

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        'group inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer shrink-0 overflow-visible',
                        christmasMode ? 'p-0.5' : 'p-2'
                    )}
                    aria-label={t('settings')}
                >
                    {christmasMode ? (
                        <ChristmasBarleySugar
                            size={45}
                            className="transition-transform duration-300 group-data-[state=open]:rotate-90"
                        />
                    ) : (
                        <svg
                            className="h-5 w-5 transition-transform duration-300 group-data-[state=open]:rotate-90"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                            />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                        </svg>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => switchLocale('fr')}
                        className={currentLocale === 'fr' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                            />
                        </svg>
                        {t('french')}
                        {currentLocale === 'fr' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={() => switchLocale('en')}
                        className={currentLocale === 'en' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"
                            />
                        </svg>
                        {t('english')}
                        {currentLocale === 'en' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator/>

                <DropdownMenuLabel>{t('theme')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => setTheme('light')} className={theme === 'light' ? 'bg-muted' : ''}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                            />
                        </svg>
                        {t('light')}
                        {theme === 'light' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setTheme('dark')} className={theme === 'dark' ? 'bg-muted' : ''}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
                            />
                        </svg>
                        {t('dark')}
                        {theme === 'dark' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>

                    <DropdownMenuItem onClick={() => setTheme('system')}
                                      className={theme === 'system' ? 'bg-muted' : ''}>
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25"
                            />
                        </svg>
                        {t('system')}
                        {theme === 'system' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                </DropdownMenuGroup>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}