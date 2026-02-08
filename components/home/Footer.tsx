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
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { useContactModal } from '@/hooks/useContactModal';
import { BarChart3, ChartLine, FileText, Gamepad2, HelpCircle, Home, Mail, Scale, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useCallback } from 'react';

export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    const currentYear = new Date().getFullYear();
    const { openContact } = useContactModal();

    const handleEmailClick = useCallback(() => {
        void openContact();
    }, [openContact]);

    const navLinks = [
        { label: tNav('home'), href: '/', icon: Home },
        { label: tNav('faq'), href: '/faq', icon: HelpCircle },
        { label: tNav('githubStats'), href: '/stats', icon: BarChart3 },
        { label: tNav('games'), href: '/games', icon: Gamepad2 },
        { label: tNav('status'), href: 'https://status.paulviandier.com/fr', icon: ChartLine }
    ];

    const legalLinks = [
        { label: t('terms'), href: '/legal/terms', icon: FileText },
        { label: t('legalNotice'), href: '/legal/legal-notice', icon: Scale },
        { label: t('privacy'), href: '/legal/privacy-policy', icon: ShieldCheck }
    ];

    const linkClass =
        'flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground underline-offset-4 hover:underline';

    return (
        <footer className="border-t border-border bg-background/60 backdrop-blur py-10">
            <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                        <footer className="text-muted-foreground text-sm space-y-1">
                            <p>
                                © 2025–{currentYear} {t('paulViandier')}
                            </p>

                            <p>
                                {t('copyright')}
                                <span className="text-xs block">
                                    {t('license')}
                                </span>
                            </p>
                        </footer>

                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href="https://github.com/5061756c2e56/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={tNav('github')}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <SiGithub className="w-5 h-5"/>
                            </a>

                            <a
                                href="https://www.linkedin.com/in/paul-viandier-648837397/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={tNav('linkedin')}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                <SiLinkedin className="w-5 h-5"/>
                            </a>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">{t('navigationTitle')}</p>

                        <ul className="space-y-2 text-sm">
                            {navLinks.map(link => {
                                const Icon = link.icon;
                                const isExternal = link.href.startsWith('https');

                                return (
                                    <li key={link.href}>
                                        {isExternal ? (
                                            <a
                                                href={link.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={linkClass}
                                            >
                                                <Icon className="w-4 h-4 shrink-0"/>
                                                <span>{link.label}</span>
                                            </a>
                                        ) : (
                                            <Link href={link.href} className={linkClass}>
                                                <Icon className="w-4 h-4 shrink-0"/>
                                                <span>{link.label}</span>
                                            </Link>
                                        )}
                                    </li>
                                );
                            })}

                            <li>
                                <button
                                    type="button"
                                    onClick={handleEmailClick}
                                    className={`${linkClass} text-left`}
                                >
                                    <Mail className="w-4 h-4 shrink-0"/>
                                    <span>{t('contact')}</span>
                                </button>
                            </li>
                        </ul>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm font-semibold text-foreground">{t('legalTitle')}</p>

                        <ul className="space-y-2 text-sm">
                            {legalLinks.map(link => {
                                const Icon = link.icon;
                                return (
                                    <li key={link.href}>
                                        <Link href={link.href} className={linkClass}>
                                            <Icon className="w-4 h-4 shrink-0"/>
                                            <span>{link.label}</span>
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                </div>

                <div className="mt-10 pt-6 border-t border-border">
                    <p className="text-xs text-muted-foreground text-center">
                        {t('madeWith')}{' '}
                        <span aria-hidden>❤️</span>{' '}
                        {t('by')}{' '}
                        <span className="text-foreground/80">Paul Viandier</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}