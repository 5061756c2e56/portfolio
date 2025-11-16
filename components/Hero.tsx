'use client';

import {
    useEffect,
    useState
} from 'react';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { LiquidButton } from '@/components/ui/liquid-button';

export default function Hero() {
    const t = useTranslations('hero');
    const router = useRouter();
    const locale = useLocale();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section id="home"
                 className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-24 relative overflow-hidden bg-gradient-to-b from-background via-background to-muted/20">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)] pointer-events-none"/>
            <div
                className={`max-w-5xl mx-auto text-center w-full relative z-10 ${mounted ? 'animate-fade-in-up' : 'opacity-0'}`}>
                <div
                    className="flex flex-wrap items-center justify-center gap-6 sm:gap-8 text-sm sm:text-base text-muted-foreground px-4 mb-8">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 hover:border-foreground/30 transition-all duration-300 hover:scale-105">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-500" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"/>
                        </svg>
                        <span>{t('location')}</span>
                    </div>
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/50 border border-border/50 hover:bg-muted/80 hover:border-foreground/30 transition-all duration-300 hover:scale-105">
                        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-purple-500" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" strokeWidth={1.5}>
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m0 0h4.5m-4.5 0l-3 3m3-3l3 3M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"/>
                        </svg>
                        <span>{t('role')}</span>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 text-foreground leading-[1.1] tracking-tight px-4 bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text">
                    {t('title')}
                </h1>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 sm:mb-8 text-muted-foreground px-4">
                    {t('subtitle')}
                </h2>

                <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed px-4">
                    {t('description')}
                </p>

                <div className="px-4 flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6">
                    <LiquidButton
                        onClick={() => {
                            const path = locale === 'en' ? '/en/curriculum-vitae' : '/curriculum-vitae';
                            window.location.href = path;
                        }}
                        size="lg"
                        className="text-lg"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"/>
                            </svg>
                            {t('cvButton')}
                        </span>
                    </LiquidButton>
                    <LiquidButton
                        onClick={async () => {
                            try {
                                const response = await fetch('/Curriculum Vitae - Viandier Paul.pdf');
                                const blob = await response.blob();
                                const url = window.URL.createObjectURL(blob);
                                const link = document.createElement('a');
                                link.href = url;
                                link.download = 'Curriculum Vitae - Viandier Paul.pdf';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                                window.URL.revokeObjectURL(url);
                            } catch (error) {
                                console.error('Erreur lors du téléchargement:', error);
                            }
                        }}
                        size="lg"
                        className="text-lg"
                    >
                        <span className="flex items-center gap-2">
                            <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
                            </svg>
                            {t('downloadCVButton')}
                        </span>
                    </LiquidButton>
                </div>
            </div>
        </section>
    );
}