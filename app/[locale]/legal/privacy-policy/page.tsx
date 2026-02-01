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

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
    const { locale } = await params;
    const isFrench = locale === 'fr';

    return {
        title: isFrench ? 'Politique de Confidentialité' : 'Privacy Policy',
        description: isFrench
            ? 'Cette politique explique quelles données peuvent être traitées, pourquoi et comment vous pouvez exercer vos droits'
            : 'This policy explains what data may be processed, why, and how you can exercise your rights'
    };
}

export default function Page() {
    return <PrivacyPolicyPageClient/>;
}