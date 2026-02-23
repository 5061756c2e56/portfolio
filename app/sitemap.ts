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

import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/routing';
import { getLanguageAlternates, getLocalizedUrl } from '@/lib/seo';

const INDEXABLE_PATHS = [
    '',
    '/curriculum-vitae',
    '/motivation-letter',
    '/faq',
    '/stats',
    '/games'
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return INDEXABLE_PATHS.flatMap((path) =>
        locales.map((locale) => (
            {
                url: getLocalizedUrl(locale, path),
                lastModified,
                alternates: {
                    languages: getLanguageAlternates(path)
                }
            }
        ))
    );
}
