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

import { Flag } from '@/components/Flag';
import { useLocaleContext } from '@/components/LocaleProvider';
import { useTranslations } from 'next-intl';
import { useTheme } from 'next-themes';
import { defaultLocale, localeFlags, locales, usePathname } from '@/i18n/routing';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasBarleySugar } from '@/components/christmas/ChristmasBarleySugar';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { Switch } from '@/components/ui/switch';
import { GitPullRequest, Moon, Sun } from 'lucide-react';

export default function Settings() {
    const { locale, showLocaleLoading } = useLocaleContext();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);
    const t = useTranslations('nav');
    const tAll = useTranslations();
    const { theme, setTheme } = useTheme();
    const christmasMode = useChristmasMode();
    const router = useRouter();

    useEffect(() => {
        const id = window.requestAnimationFrame(() => setMounted(true));
        return () => window.cancelAnimationFrame(id);
    }, []);

    const switchLocale = (newLocale: string) => {
        if (!mounted || newLocale === locale) return;

        showLocaleLoading(t('languageChanging'));

        const newPath = newLocale === defaultLocale ? pathname : `/${newLocale}${pathname}`;
        router.push(newPath);
    };

    const currentLocale = mounted ? locale : defaultLocale;

    if (!mounted) {
        return (
            <button
                className={cn(
                    'group inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer shrink-0 overflow-visible',
                    christmasMode ? 'p-0.5' : 'p-2 w-9 h-9'
                )}
                aria-label={t('settings')}
                disabled
            >
                {christmasMode ? (
                    <ChristmasBarleySugar size={45} className="transition-transform duration-300" />
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
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                )}
            </button>
        );
    }

    return (
        <DropdownMenu modal={false} open={settingsOpen} onOpenChange={setSettingsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        'group inline-flex items-center justify-center rounded-xl border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer shrink-0 overflow-visible',
                        christmasMode ? 'p-0.5' : 'p-2 w-9 h-9'
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
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <div
                        className="max-h-36 overflow-y-auto overscroll-contain scrollbar-custom"
                        onWheel={e => e.stopPropagation()}
                    >
                        {locales.map(loc => (
                            <DropdownMenuItem
                                key={loc}
                                onClick={() => switchLocale(loc)}
                                className={currentLocale === loc ? 'bg-muted' : ''}
                            >
                                <Flag code={localeFlags[loc]} className="mr-2 h-5 w-5 shrink-0" />
                                {tAll(`locales.${loc}` as Parameters<typeof tAll>[0])}
                                {currentLocale === loc && (
                                    <svg
                                        className="ml-auto h-4 w-4"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        strokeWidth={2}
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                )}
                            </DropdownMenuItem>
                        ))}
                    </div>
                </DropdownMenuGroup>

                <a
                    href="https://github.com/5061756c2e56/portfolio/pulls"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                    <GitPullRequest className="h-3.5 w-3.5" />
                    {t('helpTranslate')}
                </a>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onSelect={(e) => e.preventDefault()}
                    className="flex items-center justify-between cursor-default"
                >
                    <span>{t('theme')}</span>
                    <Switch
                        className="h-6 w-11 cursor-pointer data-[state=unchecked]:bg-blue-100 data-[state=unchecked]:border-blue-300 data-[state=checked]:bg-indigo-950 data-[state=checked]:border-indigo-700 border"
                        thumbClassName="size-5 data-[state=unchecked]:bg-white data-[state=unchecked]:shadow-md data-[state=checked]:bg-indigo-900 data-[state=checked]:shadow-md"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => {
                            setTheme(checked ? 'dark' : 'light');
                        }}
                    >
                        {theme === 'dark'
                            ? <Moon className="w-3 h-3 text-white" />
                            : <Sun className="w-3 h-3 text-black" />
                        }
                    </Switch>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
