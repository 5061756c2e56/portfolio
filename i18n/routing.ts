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

import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';
import { defaultLocale, locales } from './generated-locales';

export { type Locale, isLocale, locales, defaultLocale, localeFlags, ogLocaleMap } from './generated-locales';

export const routing = defineRouting({
    locales: [...locales],
    defaultLocale,
    localePrefix: 'as-needed'
});

export const {
    Link,
    redirect,
    usePathname,
    useRouter
} = createNavigation(routing);
