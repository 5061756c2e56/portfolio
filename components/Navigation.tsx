'use client';

import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    navigationMenuTriggerStyle
} from '@/components/ui/navigation-menu';

import { useTranslations } from 'next-intl';
import {
    useEffect,
    useState
} from 'react';
import Settings from './Settings';
import MobileMenu from './MobileMenu';
import { cn } from '@/lib/utils';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export default function Navigation() {
    const t = useTranslations('nav');
    const [scrolled, setScrolled] = useState(false);
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
            'fixed top-0 left-0 right-0 z-50 transition-all duration-500',
            scrolled
                ? 'bg-background/80 backdrop-blur-md border-b border-border shadow-sm'
                : 'bg-transparent'
        )}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-18 sm:h-20">
                    <a
                        href="#home"
                        onClick={(e) => handleNavClick(e, '#home')}
                        className="text-foreground font-semibold text-lg sm:text-xl lg:text-2xl tracking-tight hover:opacity-80 hover:scale-105 transition-all duration-200 cursor-pointer"
                    >
                        Paul Viandier
                    </a>

                    <div className="hidden lg:flex items-center gap-2">
                        <NavigationMenu>
                            <NavigationMenuList>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#about"
                                        onClick={(e) => handleNavClick(e, '#about')}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t('about')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#skills"
                                        onClick={(e) => handleNavClick(e, '#skills')}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t('skills')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#projects"
                                        onClick={(e) => handleNavClick(e, '#projects')}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t('projects')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#github-stats"
                                        onClick={(e) => handleNavClick(e, '#github-stats')}
                                        className={navigationMenuTriggerStyle()}
                                    >
                                        {t('stats')}
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem>
                                    <NavigationMenuLink
                                        href="#contact"
                                        onClick={(e) => handleNavClick(e, '#contact')}
                                        className={navigationMenuTriggerStyle()}
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