'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
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
        const stored = localStorage.getItem('locale') as Locale | null;
        if (stored && (stored === 'fr' || stored === 'en')) {
            setLocaleState(stored);
        }
    }, []);

    useEffect(() => {
        if (mounted) {
            localStorage.setItem('locale', locale);
            document.documentElement.lang = locale;
        }
    }, [locale, mounted]);

    const setLocale = (newLocale: Locale) => {
        setLocaleState(newLocale);
    };

    const currentMessages = messages[locale];

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            <NextIntlClientProvider messages={currentMessages} locale={locale}>
                {children}
            </NextIntlClientProvider>
        </LocaleContext.Provider>
    );
}

