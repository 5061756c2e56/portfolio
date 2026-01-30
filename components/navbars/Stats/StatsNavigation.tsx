'use client';

import { SectionNavigation } from '@/components/navbars/SectionNavigation';
import MobileMenuStats from './MobileMenuStats';

export default function StatsNavigation() {
    return (
        <SectionNavigation
            excludeHref="/stats"
            mobileMenu={<MobileMenuStats/>}
        />
    );
}
