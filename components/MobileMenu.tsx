'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useSmoothScroll } from '@/hooks/use-smooth-scroll';

export default function MobileMenu() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);
    const { scrollTo } = useSmoothScroll();

    const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
        e.preventDefault();
        setIsOpen(false);
        setTimeout(() => {
            scrollTo(targetId, 80);
        }, 100);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    className="group inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm p-2 text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer"
                    aria-label={t('menu')}
                >
                    {!isOpen ? (
                        <svg className="h-5 w-5 transition-all duration-300"
                             fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                        </svg>
                    ) : (
                        <svg className="h-5 w-5 transition-all duration-300"
                             fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    )}
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 bg-background/95 backdrop-blur-xl border-border/60 shadow-md">
                <DropdownMenuItem asChild>
                    <a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        {t('about')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#skills" onClick={(e) => handleLinkClick(e, '#skills')} className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        {t('skills')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#projects" onClick={(e) => handleLinkClick(e, '#projects')} className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        {t('projects')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors duration-200">
                        {t('contact')}
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}