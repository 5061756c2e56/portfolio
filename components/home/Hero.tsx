'use client';

import { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';

export default function Hero() {
    const t = useTranslations('hero');
    const [mounted, setMounted] = useState(false);
    const [isDownloadingCV, setIsDownloadingCV] = useState(false);
    const [isDownloadingLM, setIsDownloadingLM] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const handleDownload = (fileUrl: string, fileName: string, type: 'CV' | 'LM') => {
        if (type === 'CV') {
            setIsDownloadingCV(true);
        } else {
            setIsDownloadingLM(true);
        }

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const reset = () => {
            if (type === 'CV') {
                setIsDownloadingCV(false);
            } else {
                setIsDownloadingLM(false);
            }
        };

        window.addEventListener('focus', reset, { once: true });
    };

    return (
        <section id="home"
                 className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-24 relative">
            <div
                className={`max-w-4xl mx-auto text-center w-full relative z-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-8">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/20 transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                        <span>{t('location')}</span>
                    </div>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card border border-border hover:border-foreground/20 transition-all duration-300">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m0 0h4.5m-4.5 0l-3 3m3-3l3 3M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"/>
                        </svg>
                        <span>{t('role')}</span>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight gradient-text">
                    {t('title')}
                </h1>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 text-foreground/70">
                    {t('subtitle')}
                </h2>

                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
                    <button
                        onClick={() => handleDownload('/Curriculum Vitae - Viandier Paul.pdf', 'Curriculum Vitae - Viandier Paul.pdf', 'CV')}
                        disabled={isDownloadingCV}
                        className={`btn-fill-primary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${isDownloadingCV ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isDownloadingCV ? (
                            <svg className="w-5 h-5 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 relative z-10"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                        )}
                        <span className="relative z-10">{isDownloadingCV ? t('downloadingCV') : t('downloadCVButton')}</span>
                    </button>

                    <button
                        onClick={() => handleDownload('/Lettre de motivation - Paul Viandier.pdf', 'Lettre de motivation - Paul Viandier.pdf', 'LM')}
                        disabled={isDownloadingLM}
                        className={`btn-fill-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 ${isDownloadingLM ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
                    >
                        {isDownloadingLM ? (
                            <svg className="w-5 h-5 animate-spin relative z-10" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                        strokeWidth="4"/>
                                <path className="opacity-75" fill="currentColor"
                                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
                            </svg>
                        ) : (
                            <svg className="w-5 h-5 transition-transform duration-300 group-hover:-translate-y-0.5 relative z-10"
                                 fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round"
                                      d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3"/>
                            </svg>
                        )}
                        <span className="relative z-10">{isDownloadingLM ? t('downloadingLM') : t('downloadLMButton')}</span>
                    </button>
                </div>
            </div>
        </section>
    );
}