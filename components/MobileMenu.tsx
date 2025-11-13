'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { useTranslations } from 'next-intl';
import { useState } from 'react';

export default function MobileMenu() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);

    const handleLinkClick = () => {
        setIsOpen(false);
    };

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
            <DropdownMenuTrigger asChild>
                <button
                    className="group inline-flex items-center justify-center rounded-md border border-border bg-background p-2 text-foreground hover:bg-muted hover:border-foreground/20 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 active:scale-95"
                    aria-label="Menu"
                >
                    <svg className="h-5 w-5 transition-transform duration-200 group-data-[state=open]:rotate-90"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem asChild>
                    <a href="#about" onClick={handleLinkClick} className="cursor-pointer">
                        {t('about')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#skills" onClick={handleLinkClick} className="cursor-pointer">
                        {t('skills')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#projects" onClick={handleLinkClick} className="cursor-pointer">
                        {t('projects')}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <a href="#contact" onClick={handleLinkClick} className="cursor-pointer">
                        {t('contact')}
                    </a>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}