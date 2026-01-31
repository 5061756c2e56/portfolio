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

'use client';

import { SectionNavigation } from '@/components/navbars/SectionNavigation';
import MobileMenuLegal from './MobileMenuLegal';

export default function LegalNavigation() {
    return (
        <SectionNavigation
            mobileMenu={<MobileMenuLegal/>}
        />
    );
}
