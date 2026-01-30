'use client';

import { SectionNavigation } from '@/components/navbars/SectionNavigation';
import MobileMenuProjects from './MobileMenuProjects';

export default function ProjectsNavigation() {
    return (
        <SectionNavigation
            mobileMenu={<MobileMenuProjects/>}
        />
    );
}
