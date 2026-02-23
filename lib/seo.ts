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

import { defaultLocale, isLocale, type Locale, locales } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

export type SeoPage = 'home' | 'cv' | 'motivation' | 'faq' | 'stats' | 'games';

const SHARED_KEYWORDS = [
    'paul viandier',
    'paul v',
    'paul v dev',
    'paul dev web',
    'portfolio paul viandier',
    'typescript',
    'react',
    'next.js',
    'node.js',
    'cybersecurity'
];

const LOCALE_KEYWORDS: Record<Locale, string[]> = {
    fr: [
        'developpeur web',
        'integrateur web',
        'developpeur full stack',
        'alternance developpeur web',
        'portfolio developpeur web'
    ],
    br: [
        'desenvolvedor web',
        'integrador web',
        'desenvolvedor full stack',
        'portfolio desenvolvedor'
    ],
    cn: [
        'web developer portfolio',
        'full stack web developer',
        'frontend developer'
    ],
    'en-GB': [
        'web developer',
        'web integrator',
        'full stack developer',
        'frontend developer',
        'web developer portfolio'
    ],
    'en-US': [
        'web developer',
        'web integrator',
        'full stack developer',
        'frontend developer',
        'web developer portfolio'
    ],
    es: [
        'desarrollador web',
        'integrador web',
        'desarrollador full stack',
        'portfolio desarrollador web'
    ],
    ru: [
        'veb razrabotchik',
        'full stack razrabotchik',
        'portfolio razrabotchika'
    ]
};

const PAGE_KEYWORDS: Record<SeoPage, string[]> = {
    home: [
        'developer portfolio',
        'web development',
        'cybersecurity enthusiast'
    ],
    cv: [
        'curriculum vitae',
        'cv developpeur web',
        'resume web developer'
    ],
    motivation: [
        'lettre de motivation developpeur web',
        'cover letter web developer',
        'application web integrator'
    ],
    faq: [
        'faq developpeur web',
        'questions reponses developpeur',
        'web developer faq'
    ],
    stats: [
        'github statistics',
        'open source statistics',
        'github developer profile'
    ],
    games: [
        'quiz developpement web',
        'cybersecurity quiz',
        'tech mini games'
    ]
};

function normalizeLocale(locale: string): Locale {
    return isLocale(locale) ? locale : defaultLocale;
}

function normalizePath(pathname = ''): string {
    if (!pathname || pathname === '/') return '';
    return pathname.startsWith('/') ? pathname : `/${pathname}`;
}

export function getLocalizedUrl(locale: string, pathname = ''): string {
    const normalizedLocale = normalizeLocale(locale);
    const normalizedPath = normalizePath(pathname);
    if (normalizedLocale === defaultLocale) {
        return `${SITE_URL}${normalizedPath}`;
    }
    return `${SITE_URL}/${normalizedLocale}${normalizedPath}`;
}

export function getLanguageAlternates(pathname = ''): Record<string, string> {
    const languages: Record<string, string> = {};
    for (const locale of locales) {
        languages[locale] = getLocalizedUrl(locale, pathname);
    }
    languages['x-default'] = getLocalizedUrl(defaultLocale, pathname);
    return languages;
}

export function getSeoKeywords(locale: string, page: SeoPage = 'home'): string[] {
    const normalizedLocale = normalizeLocale(locale);
    const allKeywords = [
        ...SHARED_KEYWORDS,
        ...LOCALE_KEYWORDS[normalizedLocale],
        ...PAGE_KEYWORDS[page]
    ];

    return Array.from(
        new Set(
            allKeywords
                .map((keyword) => keyword.trim())
                .filter(Boolean)
        )
    );
}
