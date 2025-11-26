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
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="group inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-foreground hover:bg-muted hover:border-foreground/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-95 cursor-pointer"
                    aria-label={t('menu')}
                >
                    <svg className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <a href="#about" onClick={(e) => handleLinkClick(e, '#about')} className="cursor-pointer">
                        {t('about')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#skills" onClick={(e) => handleLinkClick(e, '#skills')} className="cursor-pointer">
                        {t('skills')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#projects" onClick={(e) => handleLinkClick(e, '#projects')} className="cursor-pointer">
                        {t('projects')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#contact" onClick={(e) => handleLinkClick(e, '#contact')} className="cursor-pointer">
                        {t('contact')}
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}