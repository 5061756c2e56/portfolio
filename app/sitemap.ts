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
import { locales, defaultLocale } from '@/i18n/routing';
import { SITE_URL } from '@/lib/site';

const paths = ['', '/curriculum-vitae', '/motivation-letter', '/faq', '/stats'];

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return locales.flatMap((locale) => {
        const prefix = locale === defaultLocale ? '' : `/${locale}`;
        return paths.map((path) => ({
            url: `${SITE_URL}${prefix}${path}`,
            lastModified
        }));
    });
}
