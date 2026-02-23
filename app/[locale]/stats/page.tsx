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

import StatsPageClient from './StatsPageClient';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLanguageAlternates, getLocalizedUrl, getSeoKeywords } from '@/lib/seo';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('pagesMetadata.stats');
    const canonicalUrl = getLocalizedUrl(locale, '/stats');

    return {
        title: t('title'),
        description: t('description'),
        keywords: getSeoKeywords(locale, 'stats'),
        alternates: {
            canonical: canonicalUrl,
            languages: getLanguageAlternates('/stats')
        },
        openGraph: {
            url: canonicalUrl,
            title: t('title'),
            description: t('description')
        },
        twitter: {
            title: t('title'),
            description: t('description')
        },
        robots: { index: true, follow: true }
    };
}

export default function Page() {
    return <StatsPageClient/>;
}
