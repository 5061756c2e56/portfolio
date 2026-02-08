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

import { getRequestConfig } from 'next-intl/server';
import { routing } from './routing';
import { isLocale } from './generated-locales';

export default getRequestConfig(async ({ requestLocale }) => {
    let locale = await requestLocale;

    if (!locale || !isLocale(locale)) {
        locale = routing.defaultLocale;
    }

    const allMsgs = (
        await import(`./locales/${locale}.json`)
    ).default;
    const { _meta, ...messages } = allMsgs;
    void _meta;

    return {
        locale,
        messages,
        timeZone: 'Europe/Paris',
        now: new Date()
    };
});
