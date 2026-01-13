'use client';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Settings from './Settings';
import MobileMenu from './MobileMenu';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasHat } from '@/components/ChristmasHat';
import { useActiveSection } from '@/hooks/use-active-section';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';
import { cn } from '@/lib/utils';

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
            'w-full border-b border-border/40 bg-card/95 backdrop-blur-sm fixed top-0 left-0 right-0 z-50 overflow-visible'
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 gap-4 overflow-visible">
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, '#home')}
                        className="flex items-center gap-2 text-xl font-bold hover:opacity-80 transition-opacity shrink-0"
                        suppressHydrationWarning
                    >
                        {christmasMode ? (
                            <ChristmasHat size={24} className="w-6 h-6 text-primary"/>
                        ) : (
                            <div
                                className="relative w-6 h-6 rounded-full overflow-hidden border-2 border-border/60 hover:border-primary/50 transition-all duration-300 flex-shrink-0">
                                <Image
                                    src="/pfp.png"
                                    alt="Paul Viandier"
                                    fill
                                    className="object-cover"
                                    sizes="24px"
                                />
                            </div>
                        )}
                        <span className="bg-gradient-to-r from-[#f0877d] to-[#7da8f0] bg-clip-text text-transparent">
                            Paul Viandier
                        </span>
                    </a>

                    <div className="hidden lg:flex items-center gap-2 flex-1 justify-end min-w-0">
                        <a
                            href="#about"
                            onClick={(e) => handleNavClick(e, '#about')}
                            className={cn(
                                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm transition-all shrink-0 whitespace-nowrap',
                                activeSection === 'about'
                                    ? 'gradient-border-button bg-primary text-primary-foreground'
                                    : 'hover:bg-accent'
                            )}
                        >
                            <span>{t('about')}</span>
                        </a>
                        <a
                            href="#skills"
                            onClick={(e) => handleNavClick(e, '#skills')}
                            className={cn(
                                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm transition-all shrink-0 whitespace-nowrap',
                                activeSection === 'skills'
                                    ? 'gradient-border-button bg-primary text-primary-foreground'
                                    : 'hover:bg-accent'
                            )}
                        >
                            <span>{t('skills')}</span>
                        </a>
                        <a
                            href="#projects"
                            onClick={(e) => handleNavClick(e, '#projects')}
                            className={cn(
                                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm transition-all shrink-0 whitespace-nowrap',
                                activeSection === 'projects'
                                    ? 'gradient-border-button bg-primary text-primary-foreground'
                                    : 'hover:bg-accent'
                            )}
                        >
                            <span>{t('projects')}</span>
                        </a>
                        {/*<Link*/}
                        {/*    href="/jeux"*/}
                        {/*    className="flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm transition-all shrink-0 whitespace-nowrap hover:bg-accent"*/}
                        {/*>*/}
                        {/*    <span>{t('games')}</span>*/}
                        {/*</Link>*/}
                        <a
                            href="#contact"
                            onClick={(e) => handleNavClick(e, '#contact')}
                            className={cn(
                                'flex items-center gap-2 px-3 sm:px-4 py-2 rounded-md text-sm transition-all shrink-0 whitespace-nowrap',
                                activeSection === 'contact'
                                    ? 'gradient-border-button bg-primary text-primary-foreground'
                                    : 'hover:bg-accent'
                            )}
                        >
                            <span>{t('contact')}</span>
                        </a>
                        <Settings/>
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