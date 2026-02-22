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

import { routing } from './i18n/routing';
import createMiddleware from 'next-intl/middleware';

export default createMiddleware({
    ...routing,
    localeDetection: false
});

export const config = {
    matcher: [
        '/((?!api|_next|_vercel|.*\\..*|sitemap|robots|manifest|icon.png|favicon.ico|vPsl6pa.png|.*\\.pdf|.*\\.svg).*)'
    ]
};
