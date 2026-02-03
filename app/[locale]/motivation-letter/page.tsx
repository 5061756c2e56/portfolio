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

import type { Metadata } from 'next';
import MotivationLetterPageClient from './MotivationLetterPageClient';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Lettre de Motivation' : 'Cover Letter',
        description: isFrench ? 'Lettre de motivation de Paul Viandier' : 'Cover letter from Paul Viandier',
        robots: { index: true, follow: true }
    };
}

export default function Page() {
    return <MotivationLetterPageClient/>;
}