'use client';

import { SectionNavigation } from '@/components/navbars/SectionNavigation';
import MobileMenuFAQ from './MobileMenuFAQ';

export default function FAQNavigation() {
    return (
        <SectionNavigation
            excludeHref="/faq"
            mobileMenu={<MobileMenuFAQ/>}
        />
    );
}
