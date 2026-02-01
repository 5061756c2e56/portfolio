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

import TermsPageClient from './TermsPageClient';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Conditions d’utilisation' : 'Terms of Use',
        description: isFrench
            ? 'Ces conditions encadrent l’accès et l’utilisation de ce site portfolio. En naviguant sur le site, vous acceptez les règles ci-dessous'
            : 'These terms govern access to and use of this portfolio website. By browsing the site, you agree to the rules below'
    };
}

export default function Page() {
    return <TermsPageClient/>;
}