'use client';

import { createContext, ReactNode, useContext, useEffect, useState } from 'react';
import { NextIntlClientProvider } from 'next-intl';

type Locale = 'fr' | 'en';

interface LocaleContextType {
    locale: Locale;
    setLocale: (locale: Locale) => void;
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

export function LocaleProvider({ children, initialLocale, messages }: LocaleProviderProps) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
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

    const setLocale = (newLocale: Locale) => {
        if (newLocale === 'fr' || newLocale === 'en') {
            setLocaleState(newLocale);
        }
    };

    const validLocale = (locale === 'fr' || locale === 'en') ? locale : initialLocale;
    const currentMessages = messages[validLocale] || messages[initialLocale] || messages.fr;

    return (
        <LocaleContext.Provider value={{ locale: validLocale, setLocale }}>
            <NextIntlClientProvider
                messages={currentMessages}
                locale={validLocale}
                timeZone="Europe/Paris"
                now={new Date()}
            >
                {children}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}