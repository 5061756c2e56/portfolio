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

import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

export default async function NotFound() {
    const locale = await getLocale();
    redirect(locale === 'fr' ? '/' : '/en');
}