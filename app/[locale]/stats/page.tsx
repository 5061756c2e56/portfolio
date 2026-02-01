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

import StatsPageClient from './StatsPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Statistiques GitHub' : 'GitHub Statistics',
        description: isFrench
            ? 'Statistiques de mes projets open source'
            : 'Statistics from my open source projects'
    };
}

export default function Page() {
    return <StatsPageClient/>;
}