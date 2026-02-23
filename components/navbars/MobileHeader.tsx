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

import { type MouseEvent } from 'react';
import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Link, usePathname } from '@/i18n/routing';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';
import { useHalloweenMode } from '@/hooks/use-halloween';
import { HalloweenPumpkin } from '@/components/halloween/HalloweenPumpkin';

export function MobileHeader() {
    const christmasMode = useChristmasMode();
    const halloweenMode = useHalloweenMode();
    const pathname = usePathname();
    const isHome = pathname === '/';

    const handleBrandClick = (event: MouseEvent<HTMLAnchorElement>) => {
        if (!isHome) return;
        event.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <header
            data-site-nav
            className="md:hidden sticky top-0 z-50 flex items-center gap-3 px-4 h-14 border-b border-blue-500/10 bg-card/80 backdrop-blur-md"
        >
            <SidebarTrigger className="shrink-0 self-center" />
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
                onClick={handleBrandClick}
                suppressHydrationWarning
            >
                <div className="grid h-6 w-6 shrink-0 place-items-center">
                    {halloweenMode ? (
                        <HalloweenPumpkin size={20} className="h-5 w-5" />
                    ) : christmasMode ? (
                        <ChristmasHat size={20} className="h-5 w-5 text-primary" />
                    ) : (
                        <div className="relative h-6 w-6 overflow-hidden rounded-full border border-blue-500/30">
                            <Image
                                src="/favicon.ico"
                                alt="Paul Viandier"
                                fill
                                className="object-cover"
                                sizes="24px"
                            />
                        </div>
                    )}
                </div>
                <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
                    Paul Viandier
                </span>
            </Link>
        </header>
    );
}
