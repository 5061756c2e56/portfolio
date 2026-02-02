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

import FAQPageClient from './FAQPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'FAQ' : 'FAQ',
        description: isFrench
            ? 'Vous trouverez ici les réponses aux questions les plus fréquentes concernant mon travail, mes compétences et mes projets'
            : 'Here you will find answers to frequently asked questions about my work, skills, and projects',
        robots: { index: false, follow: false }
    };
}

export default function Page() {
    return <FAQPageClient/>;
}