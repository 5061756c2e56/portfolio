import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import { Button } from '@/components/ui/button';
import { GithubIcon } from '@/components/icons/GithubIcon';
import { ExternalLink } from 'lucide-react';

import { SVGLayout } from '@/components/projects/portfolio/SVG/SVGLayout';
import { SVGProjectStructure } from '@/components/projects/portfolio/SVG/SVGProjectStructure';
import { SVGResponsive } from '@/components/projects/portfolio/SVG/SVGResponsive';

type ShowcaseVariant = 'layout' | 'structure' | 'responsive';

const ART_BY_VARIANT = {
    layout: SVGLayout,
    structure: SVGProjectStructure,
    responsive: SVGResponsive
} as const;

function ShowcaseIconArt({ variant }: { variant: ShowcaseVariant }) {
    const Art = ART_BY_VARIANT[variant];
    return <Art className="h-full w-full" aria-hidden="true"/>;
}

const TECH_BADGES: Record<string, string> = {
    TypeScript: 'https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript',
    NextJS: 'https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js',
    'Tailwind CSS': 'https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css',
    Redis: 'https://img.shields.io/badge/Redis-7.0-orange?style=for-the-badge&logo=redis',
    EmailJS: 'https://img.shields.io/badge/EmailJS-Contact-blue?style=for-the-badge&logo=mailgun'
};

export default async function PortfolioProject() {
    const t = await getTranslations('portfolioProject');

    const showcase = [
        {
            title: t('showcaseItems.item1.title'), desc: t('showcaseItems.item1.description'),
            variant: 'layout' as const
        },
        {
            title: t('showcaseItems.item2.title'), desc: t('showcaseItems.item2.description'),
            variant: 'structure' as const
        },
        {
            title: t('showcaseItems.item3.title'), desc: t('showcaseItems.item3.description'),
            variant: 'responsive' as const
        }
    ];

    return (
        <div className="max-w-5xl mx-auto px-4 py-24 text-foreground space-y-20">
            <header className="text-center space-y-5">
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Portfolio</h1>
                <p className="text-muted-foreground text-lg md:text-xl leading-relaxed max-w-3xl mx-auto">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                    <a href="https://paulviandier.com" target="_blank" rel="noopener noreferrer"
                       className="w-full sm:w-auto">
                        <Button
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium shadow-md">
                            <ExternalLink className="w-5 h-5"/>
                            {t('buttonLiveAccess')}
                        </Button>
                    </a>

                    <a
                        href="https://github.com/5061756c2e56/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                    >
                        <Button
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium shadow-md btn-fill-secondary">
                            <GithubIcon className="w-5 h-5"/>
                            {t('buttonViewCodeGithub')}
                        </Button>
                    </a>
                </div>
            </header>

            <section className="space-y-10">
                <div className="space-y-2">
                    <h2 className="text-2xl font-semibold">{t('overview.title')}</h2>
                    <p className="text-muted-foreground leading-relaxed">
                        {t('overview.description')}
                    </p>
                </div>

                <div className="space-y-10">
                    {showcase.map((item, idx) => {
                        const reverse = idx % 2 === 1;

                        return (
                            <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                                <div className={reverse ? 'order-2 md:order-2' : 'order-2 md:order-1'}>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-3">
                                            <div className="space-y-2">
                                                <h3 className="text-xl md:text-2xl font-semibold leading-tight">{item.title}</h3>
                                                <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className={reverse ? 'order-1 md:order-1' : 'order-1 md:order-2'}>
                                    <div className="flex items-center justify-center">
                                        <div className="w-40 h-40 md:w-48 md:h-48 text-foreground/85">
                                            <ShowcaseIconArt variant={item.variant}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            <section className="space-y-6">
                <h2 className="text-2xl font-semibold">{t('context.title')}</h2>
                <p className="text-muted-foreground leading-relaxed">
                    {t('context.description')}
                </p>
                <p className="text-muted-foreground leading-relaxed">
                    {t('context.description2')}
                </p>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('goals.title')}</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>{t('goals.bulletedList1')}</li>
                    <li>{t('goals.bulletedList2')}</li>
                    <li>{t('goals.bulletedList3')}</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('methodology.title')}</h2>
                <ol className="list-decimal list-inside text-muted-foreground space-y-2">
                    <li>{t('methodology.bulletedList1')}</li>
                    <li>{t('methodology.bulletedList2')}</li>
                    <li>{t('methodology.bulletedList3')}</li>
                    <li>{t('methodology.bulletedList4')}</li>
                </ol>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('difficulty.title')}</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>
                        {t('difficulty.bulletedList1')}
                    </li>
                    <li>
                        {t('difficulty.bulletedList2')}
                    </li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('results.title')}</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>{t('results.bulletedList1')}</li>
                    <li>{t('results.bulletedList2')}</li>
                    <li>{t('results.bulletedList3')}</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('usedTechnology')}</h2>
                <div className="flex flex-wrap gap-3">
                    {Object.keys(TECH_BADGES).map((tech) => (
                        <Image
                            key={tech}
                            src={TECH_BADGES[tech]}
                            alt={tech}
                            width={140}
                            height={28}
                            unoptimized
                            className="h-7 w-auto"
                        />
                    ))}
                </div>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('learnedLessons.title')}</h2>
                <ul className="list-disc list-inside text-muted-foreground space-y-2">
                    <li>{t('learnedLessons.bulletedList1')}</li>
                    <li>{t('learnedLessons.bulletedList2')}</li>
                    <li>{t('learnedLessons.bulletedList3')}</li>
                </ul>
            </section>

            <section className="space-y-4">
                <h2 className="text-2xl font-semibold">{t('viewProject')}</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                    <a href="https://paulviandier.com" target="_blank" rel="noopener noreferrer"
                       className="w-full sm:w-auto">
                        <Button
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium shadow-md">
                            <ExternalLink className="w-5 h-5"/>
                            {t('buttonLiveAccess')}
                        </Button>
                    </a>

                    <a
                        href="https://github.com/5061756c2e56/portfolio"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-full sm:w-auto"
                    >
                        <Button
                            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-md font-medium transition-colors duration-200 shadow-md btn-fill-secondary">
                            <GithubIcon className="w-5 h-5"/>
                            {t('buttonViewCodeGithub')}
                        </Button>
                    </a>
                </div>
            </section>
        </div>
    );
}
