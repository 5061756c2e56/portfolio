'use client';

import { useTranslations } from 'next-intl';
import { SiGithub, SiLinkedin } from 'react-icons/si';

export default function Footer() {
    const t = useTranslations('footer');
    const tNav = useTranslations('nav');
    const currentYear = new Date().getFullYear();

    return (
        <footer className="border-t border-border py-8 sm:py-10 relative">
            <div className="max-w-5xl lg:max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6">
                    <div
                        className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                        <span className="hover:text-foreground transition-colors duration-300">
                            © {currentYear} {t('copyright')}
                        </span>
                        <span className="hidden sm:inline text-border">•</span>
                        <span className="hover:text-foreground transition-colors duration-300">
                            {t('license')}
                        </span>
                    </div>

                    <div className="flex items-center gap-4">
                        <a
                            href="https://github.com/5061756c2e56/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={tNav('github')}
                            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                            <SiGithub className="w-5 h-5"/>
                        </a>

                        <a
                            href="https://www.linkedin.com/in/paul-viandier-648837397/"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={tNav('linkedin')}
                            className="text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                            <SiLinkedin className="w-5 h-5"/>
                        </a>
                    </div>
                </div>
            </div>
        </footer>
    );
}