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

import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Skills from '@/components/home/Skills';
import Timeline from '@/components/home/Timeline';
import Projects from '@/components/home/Projects';
import Contact from '@/components/home/Contact';
import FinalCTA from '@/components/home/FinalCTA';

import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getLanguageAlternates, getLocalizedUrl, getSeoKeywords } from '@/lib/seo';

export async function generateMetadata({
    params
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale } = await params;
    const t = await getTranslations('pagesMetadata.layout');
    const canonicalUrl = getLocalizedUrl(locale);

    return {
        title: 'Paul Viandier',
        description: t('description'),
        keywords: getSeoKeywords(locale, 'home'),
        robots: { index: true, follow: true },
        alternates: {
            canonical: canonicalUrl,
            languages: getLanguageAlternates()
        },
        openGraph: {
            url: canonicalUrl,
            title: t('ogTitle'),
            description: t('ogDescription'),
            type: 'website'
        },
        twitter: {
            title: t('ogTitle'),
            description: t('ogDescription')
        }
    };
}

export default function Home() {
    return (
        <>
            <div className="min-h-screen text-foreground transition-colors duration-300">
                <Hero />
                <About />
                <Skills />
                <Timeline />
                <Projects />
                <Contact />
                <FinalCTA />
            </div>
        </>
    );
}
