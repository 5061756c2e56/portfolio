'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import {
    useEffect,
    useState
} from 'react';

import {
    usePathname,
    useRouter
} from '@/i18n/routing';

import { useTheme } from 'next-themes';
import { useLocale, useTranslations } from 'next-intl';

export default function Settings() {
    const {
        theme,
        setTheme
    } = useTheme();
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();
    const [mounted, setMounted] = useState(false);
    const t = useTranslations('nav');

    useEffect(() => {
        setMounted(true);
    }, []);

    const switchLocale = (newLocale: string) => {
        router.replace(pathname, { locale: newLocale });
    };

    const currentTheme = mounted ? theme : 'dark';
    const currentLocale = mounted ? locale : 'fr';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button
                    className="group inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-foreground hover:bg-muted hover:border-foreground/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-95 cursor-pointer"
                    aria-label={t('settings')}
                >
                    <svg className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-card">
                <DropdownMenuLabel>{t('language')}</DropdownMenuLabel>
                <DropdownMenuGroup>
                    <DropdownMenuItem
                        onClick={() => mounted && switchLocale('fr')}
                        className={currentLocale === 'fr' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
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
                        onClick={() => mounted && switchLocale('en')}
                        className={currentLocale === 'en' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129"/>
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
                    <DropdownMenuItem
                        onClick={() => mounted && setTheme('dark')}
                        className={currentTheme === 'dark' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"/>
                        </svg>
                        {t('dark')}
                        {currentTheme === 'dark' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => mounted && setTheme('light')}
                        className={currentTheme === 'light' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"/>
                        </svg>
                        {t('light')}
                        {currentTheme === 'light' && (
                            <svg className="ml-auto h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                 strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                            </svg>
                        )}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => mounted && setTheme('system')}
                        className={currentTheme === 'system' ? 'bg-muted' : ''}
                    >
                        <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                        </svg>
                        {t('system')}
                        {currentTheme === 'system' && (
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