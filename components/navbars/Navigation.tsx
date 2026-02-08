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

import { useTranslations } from 'next-intl';
import { type MouseEvent, useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Settings from '@/components/Settings';
import MobileMenu from '@/components/navbars/MobileMenu';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';
import { useActiveSection } from '@/hooks/use-active-section';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { BarChart3, Gamepad2, HelpCircle } from 'lucide-react';

export default function Navigation() {
    const t = useTranslations('nav');
    const [scrolled, setScrolled] = useState(false);
    const christmasMode = useChristmasMode();
    const activeSection = useActiveSection();
    const { scrollTo } = useSmoothScroll();

    const sectionsContainerRef = useRef<HTMLDivElement | null>(null);
    const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

    const updateIndicator = useCallback(() => {
        const container = sectionsContainerRef.current;
        const label = labelRefs.current[activeSection];

        if (!container || !label || activeSection === 'home') {
            setIndicator((prev) => (
                { ...prev, opacity: 0 }
            ));
            return;
        }

        const c = container.getBoundingClientRect();
        const r = label.getBoundingClientRect();

        const w = r.width * 0.8;
        const left = r.left - c.left + (
            r.width - w
        ) / 2;

        setIndicator({ left, width: w, opacity: 1 });
    }, [activeSection]);

    useLayoutEffect(() => {
        const raf = window.requestAnimationFrame(updateIndicator);
        return () => window.cancelAnimationFrame(raf);
    }, [updateIndicator]);

    const handleScroll = useCallback(() => {
        setScrolled(window.scrollY > 20);
    }, []);

    useEffect(() => {
        const raf = window.requestAnimationFrame(handleScroll);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => {
            window.cancelAnimationFrame(raf);
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        window.addEventListener('resize', updateIndicator);
        window.addEventListener('load', updateIndicator);
        const timeoutId = window.setTimeout(updateIndicator, 250);

        return () => {
            window.removeEventListener('resize', updateIndicator);
            window.removeEventListener('load', updateIndicator);
            window.clearTimeout(timeoutId);
        };
    }, [updateIndicator]);

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        scrollTo(targetId, 80);
    };

    const linkClass = (id: string) =>
        cn(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-blue-500/10',
            activeSection === id ? 'text-blue-500' : 'text-muted-foreground hover:text-blue-500'
        );

    return (
        <nav
            className={cn(
                'w-full border-b border-blue-500/10 bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'shadow-sm shadow-blue-500/5' : ''
            )}
        >
            <div className="max-w-[100rem] mx-auto px-4 sm:px-6 lg:px-6">
                <div className="flex items-center justify-between h-16 gap-4">
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, '#home')}
                        className="flex items-center gap-2.5 text-xl font-semibold hover:opacity-80 transition-opacity shrink-0"
                        suppressHydrationWarning
                    >
                        {christmasMode ? (
                            <ChristmasHat size={24} className="w-6 h-6 text-primary"/>
                        ) : (
                            <div
                                className="relative w-7 h-7 rounded-full overflow-hidden border border-blue-500/30 hover:border-blue-500/50 hover:shadow-[0_0_10px_rgba(59,130,246,0.2)] transition-all duration-300 shrink-0">
                                <Image src="/pfp.png" alt="Paul Viandier" fill className="object-cover" sizes="28px"/>
                            </div>
                        )}
                        <span
                            className="bg-gradient-to-r from-gradient-start to-gradient-end bg-clip-text text-transparent">
                            Paul Viandier
                        </span>
                    </a>

                    <div className="hidden lg:flex items-center gap-1 flex-1 justify-end min-w-0">
                        <div ref={sectionsContainerRef} className="relative flex items-center gap-1 pb-1">
                            <a href="#about" onClick={(e) => handleNavClick(e, '#about')}
                               className={linkClass('about')}>
                                <span
                                    ref={(el) => {
                                        labelRefs.current.about = el;
                                    }}
                                >
                                    {t('about')}
                                </span>
                            </a>

                            <a
                                href="#skills"
                                onClick={(e) => handleNavClick(e, '#skills')}
                                className={linkClass('skills')}
                            >
                                <span
                                    ref={(el) => {
                                        labelRefs.current.skills = el;
                                    }}
                                >
                                    {t('skills')}
                                </span>
                            </a>

                            <a
                                href="#projects"
                                onClick={(e) => handleNavClick(e, '#projects')}
                                className={linkClass('projects')}
                            >
                                <span
                                    ref={(el) => {
                                        labelRefs.current.projects = el;
                                    }}
                                >
                                    {t('projects')}
                                </span>
                            </a>

                            <a
                                href="#github-activities"
                                onClick={(e) => handleNavClick(e, '#github-activities')}
                                className={linkClass('github-activities')}
                            >
                                <span
                                    ref={(el) => {
                                        labelRefs.current['github-activities'] = el;
                                    }}
                                >
                                    {t('github-activities')}
                                </span>
                            </a>

                            <a
                                href="#contact"
                                onClick={(e) => handleNavClick(e, '#contact')}
                                className={linkClass('contact')}
                            >
                                <span
                                    ref={(el) => {
                                        labelRefs.current.contact = el;
                                    }}
                                >
                                    {t('contact')}
                                </span>
                            </a>

                            <a
                                href="#extras"
                                onClick={(e) => handleNavClick(e, '#extras')}
                                className={linkClass('extras')}
                            >
                                <span
                                    ref={(el) => {
                                        labelRefs.current.extras = el;
                                    }}
                                >
                                    Extras
                                </span>
                            </a>

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)] transition-[left,width,opacity] duration-300 ease-out"
                                style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
                            />
                        </div>

                        <span
                            className="mx-3 h-5 w-px bg-foreground/20 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                            aria-hidden="true"
                        />

                        <Link
                            href="/faq"
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 inline-flex items-center gap-2"
                        >
                            {t('faq')}
                            <HelpCircle className="w-4 h-4 opacity-70"/>
                        </Link>

                        <Link
                            href="/stats"
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 inline-flex items-center gap-2"
                        >
                            {t('statsGithub')}
                            <BarChart3 className="w-4 h-4 opacity-70"/>
                        </Link>

                        <Link
                            href="/games"
                            className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 text-muted-foreground hover:text-blue-500 hover:bg-blue-500/10 inline-flex items-center gap-2"
                        >
                            {t('games')}
                            <Gamepad2 className="w-4 h-4 opacity-70"/>
                        </Link>

                        <div className="ml-2">
                            <Settings/>
                        </div>
                    </div>

                    <div className="flex lg:hidden items-center gap-2">
                        <MobileMenu/>
                        <Settings/>
                    </div>
                </div>
            </div>
        </nav>
    );
}