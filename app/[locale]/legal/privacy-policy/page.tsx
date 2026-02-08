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

import PrivacyPolicyPageClient from './PrivacyPolicyPageClient';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';

export async function generateMetadata(): Promise<Metadata> {
    const t = await getTranslations('pagesMetadata.privacyPolicy');

    return {
        title: t('title'),
        description: t('description'),
        robots: { index: false, follow: false }
    };
}

export default function Page() {
    return <PrivacyPolicyPageClient/>;
}