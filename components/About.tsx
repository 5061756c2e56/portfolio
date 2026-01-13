'use client';

import { useTranslations } from 'next-intl';

export default function About() {
    const t = useTranslations('about');

    return (
        <section id="about"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 tracking-tight gradient-text">
                    {t('title')}
                </h2>
                <div className="text-base sm:text-lg md:text-xl text-foreground leading-relaxed bg-gradient-to-br from-card/80 via-card/60 to-primary/5 rounded-2xl p-6 sm:p-8 border border-border/60 backdrop-blur-sm hover:border-primary/50 transition-all duration-500">
                    {t('content')}
                </div>
            </div>
        </section>
    );
}