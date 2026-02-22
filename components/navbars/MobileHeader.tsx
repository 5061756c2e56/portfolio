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

import Image from 'next/image';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Link } from '@/i18n/routing';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';

export function MobileHeader() {
    const christmasMode = useChristmasMode();

    return (
        <header
            data-site-nav
            className="md:hidden sticky top-0 z-50 flex items-center gap-3 px-4 h-14 border-b border-blue-500/10 bg-card/80 backdrop-blur-md"
        >
            <SidebarTrigger className="shrink-0" />
            <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold hover:opacity-80 transition-opacity"
                suppressHydrationWarning
            >
                {christmasMode ? (
                    <ChristmasHat size={20} className="w-5 h-5 text-primary" />
                ) : (
                    <div className="relative w-6 h-6 rounded-full overflow-hidden border border-blue-500/30 shrink-0">
                        <Image
                            src="/favicon.ico"
                            alt="Paul Viandier"
                            fill
                            className="object-cover"
                            sizes="24px"
                        />
                    </div>
                )}
                <span className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
                    Paul Viandier
                </span>
            </Link>
        </header>
    );
}
