'use client';

import { useTranslations } from 'next-intl';

export default function About() {
    const t = useTranslations('about');

    return (
        <section id="about"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text">
                    {t('title')}
                </h2>
                <div className="text-base sm:text-lg text-foreground/80 leading-relaxed bg-card rounded-xl p-6 sm:p-8 border border-border hover:border-foreground/20 transition-all duration-300">
                    {t('content')}
                </div>
            </div>
        </section>
    );
}