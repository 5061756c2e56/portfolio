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
import { SITE_URL } from '@/lib/site';

const baseUrl = SITE_URL;

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    return [
        { url: baseUrl, lastModified },
        { url: `${baseUrl}/curriculum-vitae`, lastModified },
        { url: `${baseUrl}/motivation-letter`, lastModified },
        { url: `${baseUrl}/faq`, lastModified },
        { url: `${baseUrl}/stats`, lastModified }
    ];
}