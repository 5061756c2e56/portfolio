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

import LegalNoticePageClient from './LegalNoticePageClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Mentions Légales' : 'Legal Notice',
        description: isFrench
            ? 'Les présentes mentions légales décrivent l’éditeur du site, son hébergement et les principales informations relatives à son utilisation'
            : 'This legal notice identifies the website publisher, its hosting provider, and the main information relating to use of the website',
        robots: { index: false, follow: false }
    };
}

export default function Page() {
    return <LegalNoticePageClient/>;
}