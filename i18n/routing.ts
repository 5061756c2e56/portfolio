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

export const routing = defineRouting({
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localePrefix: 'as-needed'
});

export const {
    Link,
    redirect,
    usePathname,
    useRouter
} = createNavigation(routing);

export type Locale = ( typeof routing.locales )[number];

export function isLocale(value: string): value is Locale {
    return (
        routing.locales as readonly string[]
    ).includes(value);
}