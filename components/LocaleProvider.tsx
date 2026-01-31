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

import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { LoadingOverlay } from '@/components/LoadingOverlay';

type Locale = 'fr' | 'en';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
    showLocaleLoading: () => void;
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

export function useLocaleContext() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error('useLocaleContext must be used within LocaleProvider');
    }
    return context;
}

interface LocaleProviderProps {
    children: ReactNode;
    initialLocale: Locale;
    messages: {
        fr: Record<string, any>;
        en: Record<string, any>;
    };
}

const LOADING_KEY = 'locale-loading';

export function LocaleProvider({ children, initialLocale, messages }: LocaleProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);
    const [mounted, setMounted] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setMounted(true);

        const wasLoading = sessionStorage.getItem(LOADING_KEY);
        if (wasLoading) {
            sessionStorage.removeItem(LOADING_KEY);
            setIsVisible(true);
            setIsLoading(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setIsLoading(false);
                    setTimeout(() => setIsVisible(false), 300);
                });
            });
        }
    }, []);

    useEffect(() => {
        setLocaleState(initialLocale);
    }, [initialLocale]);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('locale', locale);
            document.documentElement.lang = locale;
        }
    }, [locale, mounted]);

    const showLocaleLoading = useCallback(() => {
        sessionStorage.setItem(LOADING_KEY, 'true');
        setIsVisible(true);
        setIsLoading(true);
        window.scrollTo({ top: 0, behavior: 'instant' });
    }, []);

    const setLocale = (newLocale: Locale) => {
        if (newLocale === 'fr' || newLocale === 'en') {
            setLocaleState(newLocale);
        }
    };

    const validLocale = (
        locale === 'fr' || locale === 'en'
    ) ? locale : initialLocale;
    const currentMessages = messages[validLocale] || messages[initialLocale] || messages.fr;

    return (
        <LocaleContext.Provider value={{ locale: validLocale, setLocale, showLocaleLoading }}>
            <NextIntlClientProvider
                messages={currentMessages}
                locale={validLocale}
                timeZone="Europe/Paris"
                now={new Date()}
            >
                {children}
                {isVisible && <LoadingOverlay isLoading={isLoading}/>}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}
