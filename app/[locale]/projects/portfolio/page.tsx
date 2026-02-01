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

import PortfolioProjectPageClient from './PortfolioProjectPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Projet Portfolio' : 'Portfolio Project',
        description: isFrench
            ? 'Un portfolio moderne et performant, conçu pour démontrer mes compétences en développement web et offrir une expérience utilisateur soignée'
            : 'A modern and performant portfolio, designed to showcase my web development skills and deliver a polished user experience'
    };
}

export default function Page() {
    return <PortfolioProjectPageClient/>;
}