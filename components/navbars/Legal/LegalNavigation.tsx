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
