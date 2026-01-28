'use client';

import { useTranslations } from 'next-intl';
import { type MouseEvent, useEffect, useLayoutEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Settings from '@/components/Settings';
import MobileMenu from '@/components/navbars/MobileMenu';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';
import { useActiveSection } from '@/hooks/use-active-section';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { ExternalLink } from 'lucide-react';

export default function Navigation() {
    const t = useTranslations('nav');
    const [scrolled, setScrolled] = useState(false);
    const christmasMode = useChristmasMode();
    const activeSection = useActiveSection();
    const { scrollTo } = useSmoothScroll();

    const sectionsContainerRef = useRef<HTMLDivElement | null>(null);
    const labelRefs = useRef<Record<string, HTMLSpanElement | null>>({});
    const [indicator, setIndicator] = useState({ left: 0, width: 0, opacity: 0 });

    const updateIndicator = () => {
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
    };

    useLayoutEffect(() => {
        updateIndicator();
    }, [activeSection]);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        window.addEventListener('resize', updateIndicator);
        window.addEventListener('load', updateIndicator);
        const t = window.setTimeout(updateIndicator, 250);
        return () => {
            window.removeEventListener('resize', updateIndicator);
            window.removeEventListener('load', updateIndicator);
            window.clearTimeout(t);
        };
    }, []);

    const handleNavClick = (e: MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        scrollTo(targetId, 80);
    };

    const linkClass = (id: string) =>
        cn(
            'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 hover:bg-accent',
            activeSection === id ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'
        );

    return (
        <nav
            className={cn(
                'w-full border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 transition-all duration-300',
                scrolled ? 'shadow-sm' : ''
            )}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                                className="relative w-7 h-7 rounded-full overflow-hidden border border-border hover:border-foreground/30 transition-all duration-300 shrink-0">
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
                                        labelRefs.current['about'] = el;
                                    }}
                                >
                                {t('about')}
                                </span>
                            </a>

                            <a href="#skills" onClick={(e) => handleNavClick(e, '#skills')}
                               className={linkClass('skills')}>
                                <span
                                    ref={(el) => {
                                        labelRefs.current['skills'] = el;
                                    }}
                                >
                                {t('skills')}
                                </span>
                            </a>

                            <a href="#projects" onClick={(e) => handleNavClick(e, '#projects')}
                               className={linkClass('projects')}>
                            <span
                                ref={(el) => {
                                    labelRefs.current['projects'] = el;
                                }}
                            >
                                {t('projects')}
                            </span>
                            </a>

                            <a href="#contact" onClick={(e) => handleNavClick(e, '#contact')}
                               className={linkClass('contact')}>
                                <span
                                    ref={(el) => {
                                        labelRefs.current['contact'] = el;
                                    }}
                                >
                                  {t('contact')}
                                </span>
                            </a>

                            <a href="#extras" onClick={(e) => handleNavClick(e, '#extras')}
                               className={linkClass('extras')}>
                                <span
                                    ref={(el) => {
                                        labelRefs.current['extras'] = el;
                                    }}
                                >
                                  Extras
                                </span>
                            </a>

                            <span
                                aria-hidden="true"
                                className="pointer-events-none absolute bottom-0 h-0.5 rounded-full bg-white transition-[left,width,opacity] duration-300 ease-out"
                                style={{ left: indicator.left, width: indicator.width, opacity: indicator.opacity }}
                            />
                        </div>

                        <span
                            className="mx-3 h-5 w-px bg-foreground/20 shadow-[0_0_0_1px_rgba(255,255,255,0.06)]"
                            aria-hidden="true"
                        />

                        <Link
                            href="/faq"
                            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-2"
                        >
                            FAQ
                            <ExternalLink className="w-4 h-4 opacity-70"/>
                        </Link>

                        <Link
                            href="/games"
                            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-accent inline-flex items-center gap-2"
                        >
                            {t('games')}
                            <ExternalLink className="w-4 h-4 opacity-70"/>
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