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

import { BarChart3, Gamepad2, HelpCircle, Home, type LucideIcon } from 'lucide-react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import Settings from '@/components/Settings';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';
import { Link } from '@/i18n/routing';

export interface SectionNavLink {
    href: string;
    labelKey: string;
    icon: LucideIcon;
}

const DEFAULT_LINKS: SectionNavLink[] = [
    { href: '/', labelKey: 'home', icon: Home },
    { href: '/faq', labelKey: 'faq', icon: HelpCircle },
    { href: '/stats', labelKey: 'statsGithub', icon: BarChart3 },
    { href: '/games', labelKey: 'games', icon: Gamepad2 }
];

export interface SectionNavigationProps {
    excludeHref?: string;
    mobileMenu: React.ReactNode;
}

export function SectionNavigation({ excludeHref, mobileMenu }: SectionNavigationProps) {
    const t = useTranslations('nav');
    const christmasMode = useChristmasMode();
    const links = excludeHref
        ? DEFAULT_LINKS.filter(link => link.href !== excludeHref)
        : DEFAULT_LINKS;

    return (
        <nav className="w-full border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4">
                    <Link
                        href="/"
                        className="flex items-center gap-2.5 text-xl font-semibold hover:opacity-80 transition-opacity shrink-0"
                        suppressHydrationWarning
                    >
                        {christmasMode ? (
                            <ChristmasHat size={24} className="w-6 h-6 text-primary"/>
                        ) : (
                            <div
                                className="relative w-7 h-7 rounded-full overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300 shrink-0">
                                <Image
                                    src="/pfp.png"
                                    alt="Paul Viandier"
                                    fill
                                    className="object-cover"
                                    sizes="28px"
                                />
                            </div>
                        )}
                        <span
                            className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
                            Paul Viandier
                        </span>
                    </Link>

                    <div className="hidden lg:flex items-center gap-2">
                        {links.map(({ href, labelKey, icon: Icon }) => (
                            <Link
                                key={href}
                                href={href}
                                className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 inline-flex items-center gap-2"
                            >
                                <Icon className="w-4 h-4"/>
                                <span className="hidden sm:inline">
                                    {t(labelKey)}
                                </span>
                            </Link>
                        ))}
                        <Settings/>
                    </div>

                    <div className="flex lg:hidden items-center gap-2">
                        {mobileMenu}
                        <Settings/>
                    </div>
                </div>
            </div>
        </nav>
    );
}
