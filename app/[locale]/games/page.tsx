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

import GamesPageClient from './GamesPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Jeux & Défis' : 'Games & Challenges',
        description: isFrench
            ? 'Testez vos connaissances en développement web, cybersécurité et technologies modernes à travers nos quiz interactifs et mini-jeux'
            : 'Test your knowledge in web development, cybersecurity, and modern technologies through our interactive quizzes and mini-games',
        robots: { index: false, follow: false }
    };
}

export default function Page() {
    return <GamesPageClient/>;
}