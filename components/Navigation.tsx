'use client';

import {
    NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList, navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Settings from './Settings';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';

export default function Navigation() {
    const t = useTranslations('nav');
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <nav className={cn(
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled
                ? 'bg-background/70 backdrop-blur-xl border-b border-border/60 shadow-sm'
                : 'bg-transparent'
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 sm:h-20">
                    <a
                        href="#home"
                        className="flex items-center gap-2.5 sm:gap-3 text-foreground font-bold text-lg sm:text-xl lg:text-2xl tracking-tight hover:opacity-80 hover:scale-105 transition-all duration-300 cursor-pointer"
                    >
                        <div className="relative w-8 h-8 sm:w-9 sm:h-9 lg:w-10 lg:h-10 rounded-full overflow-hidden border-2 border-border/60 hover:border-primary/50 transition-all duration-300 flex-shrink-0">
                            <Image
                                src="/pfp.png"
                                alt="Paul Viandier"
                                fill
                                className="object-cover"
                                sizes="(max-width: 640px) 32px, (max-width: 1024px) 36px, 40px"
                            />
                        </div>
                        <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text hover:text-transparent">
                            Paul Viandier
                        </span>
                    </a>

                    <div className="hidden lg:flex items-center gap-3">
                        <NavigationMenu>
                            <NavigationMenuList className="gap-1">
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#about"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105'
                                        )}
                                    >
                                        {t('about')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#skills"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105'
                                        )}
                                    >
                                        {t('skills')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#projects"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105'
                                        )}
                                    >
                                        {t('projects')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#github-stats"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105'
                                        )}
                                    >
                                        {t('statsGithub')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#contact"
                                        className={cn(
                                            navigationMenuTriggerStyle(),
                                            'rounded-lg hover:bg-primary/10 hover:text-primary transition-all duration-300 hover:scale-105'
                                        )}
                                    >
                                        {t('contact')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </NavigationMenuList>
                        </NavigationMenu>
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