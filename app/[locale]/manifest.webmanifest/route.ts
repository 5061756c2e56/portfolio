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

import { NextResponse } from 'next/server';
import { getTranslations } from 'next-intl/server';
import { defaultLocale } from '@/i18n/routing';

export async function GET(
    _request: Request,
    { params }: { params: Promise<{ locale: string }> }
) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'manifest' });
    const startUrl = locale === defaultLocale ? '/' : `/${locale}/`;

    return NextResponse.json(
        {
            name: t('name'),
            short_name: 'PV',
            description: t('description'),
            start_url: startUrl,
            scope: startUrl,
            display: 'standalone',
            background_color: '#fafafa',
            theme_color: '#fafafa',
            icons: [
                {
                    src: '/favicon.png',
                    sizes: 'any',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/favicon.png',
                    sizes: '192x192',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/favicon.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'any'
                },
                {
                    src: '/favicon.png',
                    sizes: '512x512',
                    type: 'image/png',
                    purpose: 'maskable'
                }
            ]
        },
        {
            headers: {
                'Content-Type': 'application/manifest+json'
            }
        }
    );
}
