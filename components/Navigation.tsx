'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Settings from './Settings';
import MobileMenu from './MobileMenu';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/christmas/ChristmasHat';
import { useActiveSection } from '@/hooks/use-active-section';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export default function Navigation() {
    const t = useTranslations('nav');
    const [scrolled, setScrolled] = useState(false);
    const christmasMode = useChristmasMode();
    const activeSection = useActiveSection();
    const { scrollTo } = useSmoothScroll();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        scrollTo(targetId, 80);
    };

    return (
        <nav className={cn(
            'w-full border-b border-border bg-card/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50'
        )}>
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
                    </a>

                    <div className="hidden lg:flex items-center gap-1 flex-1 justify-end min-w-0">
                        <a
                            href="#about"
                            onClick={(e) => handleNavClick(e, '#about')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                                activeSection === 'about'
                                    ? 'bg-foreground text-background'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                        >
                            {t('about')}
                        </a>
                        <a
                            href="#skills"
                            onClick={(e) => handleNavClick(e, '#skills')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                                activeSection === 'skills'
                                    ? 'bg-foreground text-background'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                        >
                            {t('skills')}
                        </a>
                        <a
                            href="#projects"
                            onClick={(e) => handleNavClick(e, '#projects')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                                activeSection === 'projects'
                                    ? 'bg-foreground text-background'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                        >
                            {t('projects')}
                        </a>
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, '#contact')}
                            className={cn(
                                'px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200',
                                activeSection === 'contact'
                                    ? 'bg-foreground text-background'
                                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                            )}
                        >
                            {t('contact')}
                        </a>
                        <Link
                            href="/jeux"
                            className="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 text-muted-foreground hover:text-foreground hover:bg-accent"
                        >
                            {t('games')}
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