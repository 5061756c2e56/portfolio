'use client';

import {
    useEffect,
    useState
} from 'react';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';

export default function Hero() {
    const t = useTranslations('hero');
    const [mounted, setMounted] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDownload = (e: React.MouseEvent<HTMLAnchorElement>) => {
        setIsDownloading(true);
        const link = document.createElement('a');
        link.href = '/Curriculum Vitae - Viandier Paul.pdf';
        link.download = 'Curriculum Vitae - Viandier Paul.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(() => {
            setIsDownloading(false);
        }, 2000);
    };

    return (
        <section id="home"
                 className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-24 relative">
            <div
                className={`max-w-5xl mx-auto text-center w-full relative z-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div
                    className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base text-foreground/80 px-4 mb-8">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-border/50 hover:border-primary/50 hover:bg-gradient-to-br hover:from-primary/25 hover:to-accent/25 transition-all duration-500 hover:scale-110 hover:-translate-y-1">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-primary" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                        <span className="font-medium">{t('location')}</span>
                    </div>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-accent/15 to-primary/15 border border-border/50 hover:border-accent/50 hover:bg-gradient-to-br hover:from-accent/25 hover:to-primary/25 transition-all duration-500 hover:scale-110 hover:-translate-y-1">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-foreground" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m0 0h4.5m-4.5 0l-3 3m3-3l3 3M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"/>
                        </svg>
                        <span className="font-medium">{t('role')}</span>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight px-4 gradient-text">
                    {t('title')}
                </h1>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-8 text-foreground/80 px-4">
                    {t('subtitle')}
                </h2>

                <p className="text-base sm:text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed px-4">
                    {t('description')}
                </p>

                <div className="flex justify-center px-4">
                    <a
                        onClick={(e) => {
                            e.preventDefault();
                            handleDownload(e);
                        }}
                        className={`group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 text-base sm:text-lg font-semibold rounded-xl bg-gradient-to-br from-card via-card/95 to-primary/5 text-card-foreground transition-all duration-500 border-2 border-border/60 hover:border-primary/50 overflow-hidden ${
                            isDownloading ? 'pointer-events-none opacity-70 cursor-not-allowed' : 'hover:scale-105 cursor-pointer'
                        }`}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-accent/0 to-primary/0 group-hover:from-primary/10 group-hover:via-accent/10 group-hover:to-primary/8 transition-all duration-500 pointer-events-none"/>
                        {isDownloading ? (
                            <svg
                                className="w-6 h-6 sm:w-7 sm:h-7 animate-spin relative z-10"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                />
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6 sm:w-7 sm:h-7 transition-transform duration-500 group-hover:translate-y-[-3px] group-hover:scale-110 relative z-10"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                strokeWidth={2.5}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"
                                />
                            </svg>
                        )}
                        <span className="relative z-10">{isDownloading ? t('downloadingCV') : t('downloadCVButton')}</span>
                    </a>
                </div>
            </div>
        </section>
    );
}