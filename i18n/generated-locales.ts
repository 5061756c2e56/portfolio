export const locales = ['fr', 'en', 'es'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'fr';

export const localeFlags: Record<Locale, string> = {
    'fr': 'fr',
    'en': 'gb',
    'es': 'es'
};

export function isLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}
