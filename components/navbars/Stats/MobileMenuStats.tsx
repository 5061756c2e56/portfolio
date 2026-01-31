'use client';

import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { useChristmasMode } from '@/hooks/use-christmas';
import { ChristmasOrnament } from '@/components/christmas/ChristmasOrnament';
import { cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { Gamepad2, HelpCircle, Home } from 'lucide-react';

export default function MobileMenu() {
    const t = useTranslations('nav');
    const [isOpen, setIsOpen] = useState(false);
    const christmasMode = useChristmasMode();

    return (
        <DropdownMenu open={isOpen} onOpenChange={setIsOpen} modal={false}>
            <DropdownMenuTrigger asChild>
                <button
                    className={cn(
                        'group inline-flex items-center justify-center rounded-lg border border-border/50 bg-background/80 backdrop-blur-sm text-foreground hover:bg-primary/10 hover:border-primary/50 hover:text-primary transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 active:scale-95 cursor-pointer relative',
                        christmasMode ? 'p-0.5' : 'p-2 w-9 h-9'
                    )}
                    aria-label={t('menu')}
                >
                    {christmasMode ? (
                        <ChristmasOrnament size={40}/>
                    ) : (
                        <>
                            <svg
                                className={`h-5 w-5 absolute transition-all duration-500 ease-in-out ${
                                    isOpen ? 'opacity-0 scale-0 rotate-180' : 'opacity-100 scale-100 rotate-0'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 12h16"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 18h16"/>
                            </svg>

                            <svg
                                className={`h-5 w-5 absolute transition-all duration-500 ease-in-out ${
                                    isOpen ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-0 -rotate-180'
                                }`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2}
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12"/>
                            </svg>
                        </>
                    )}
                </button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-48 border border-border/60 rounded-md bg-card shadow-lg p-2">
                <DropdownMenuItem asChild onSelect={() => setIsOpen(false)}>
                    <Link
                        href="/"
                        className="w-full cursor-pointer transition-all text-sm hover:bg-accent hover:bg-blue-500/10 hover:text-blue-500 flex items-center text-muted-foreground"
                    >
                        <span>{t('home')}</span>
                        <Home className="ml-2 w-4 h-4 opacity-70"/>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild onSelect={() => setIsOpen(false)}>
                    <Link
                        href="/faq"
                        className="w-full cursor-pointer transition-all text-sm rounded-lg px-2 py-1.5 hover:bg-blue-500/10 hover:text-blue-500 flex items-center text-muted-foreground"
                    >
                        <span>FAQ</span>
                        <HelpCircle className="ml-2 w-4 h-4 opacity-70"/>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuItem asChild onSelect={() => setIsOpen(false)}>
                    <Link
                        href="/games"
                        className="w-full cursor-pointer transition-all text-sm hover:bg-accent hover:bg-blue-500/10 hover:text-blue-500 flex items-center text-muted-foreground"
                    >
                        <span>{t('games')}</span>
                        <Gamepad2 className="ml-2 w-4 h-4 opacity-70"/>
                    </Link>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}