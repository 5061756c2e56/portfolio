'use client';

import { useTranslations } from 'next-intl';

export default function About() {
    const t = useTranslations('about');

    return (
        <section id="about"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/10 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none"/>
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight">
                    <span
                        className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                        {t('title')}
                    </span>
                </h2>
                <div className="text-base sm:text-lg md:text-xl text-foreground/90 leading-relaxed">
                    {t('content')}
                </div>
            </div>
        </section>
    );
}