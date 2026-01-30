'use client';

import { SectionNavigation } from '@/components/navbars/SectionNavigation';
import MobileMenuGames from './MobileMenuGames';

export default function GamesNavigation() {
    return (
        <SectionNavigation
            excludeHref="/games"
            mobileMenu={<MobileMenuGames/>}
        />
    );
}
