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

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
    CheckCircle2, Clock, Code2, ExternalLink, Eye, Layers, Layout, Lightbulb, type LucideIcon, Search, Shield,
    Smartphone, Sparkles, Target, TrendingUp, Users, Zap
} from 'lucide-react';
import { SiGithub } from 'react-icons/si';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';

interface ProjectMeta {
    duration: string;
    role: string;
    team: string;
    status: string;
}

interface FeatureItem {
    icon: LucideIcon;
    title: string;
    description: string;
}

interface QualityItem {
    icon: LucideIcon;
    title: string;
    description: string;
    color: string;
}

interface TechBadge {
    name: string;
    url: string;
}

function SectionTitle({ children, className }: { children: React.ReactNode; className?: string }) {
    return (
        <h2 className={cn(
            'text-2xl sm:text-3xl font-bold tracking-tight gradient-text',
            className
        )}>
            {children}
        </h2>
    );
}

function SectionSubtitle({ children }: { children: React.ReactNode }) {
    return (
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mx-auto">
            {children}
        </p>
    );
}

function Card({ children, className, hover = true }: {
    children: React.ReactNode;
    className?: string;
    hover?: boolean;
}) {
    return (
        <div className={cn(
            'rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-6',
            hover && 'transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5',
            className
        )}>
            {children}
        </div>
    );
}

function MetricCard({ icon: Icon, label, value }: {
    icon: LucideIcon;
    label: string;
    value: string;
}) {
    return (
        <Card className="flex items-center gap-3 sm:gap-4 p-4 sm:p-6">
            <div
                className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary"/>
            </div>
            <div className="min-w-0">
                <p className="text-xs sm:text-sm text-muted-foreground truncate">{label}</p>
                <p className="text-base sm:text-lg font-semibold truncate">{value}</p>
            </div>
        </Card>
    );
}

function FeatureCard({ icon: Icon, title, description }: FeatureItem) {
    return (
        <Card className="group h-full">
            <div className="flex items-start gap-3 sm:gap-4">
                <div
                    className="shrink-0 w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-primary"/>
                </div>
                <div className="space-y-1 sm:space-y-2 min-w-0">
                    <h3 className="text-base sm:text-lg font-semibold">{title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
                </div>
            </div>
        </Card>
    );
}

function QualityCard({ icon: Icon, title, description, color }: QualityItem) {
    return (
        <Card className="text-center group h-full">
            <div className={cn(
                'mx-auto w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 transition-transform duration-300 group-hover:scale-110',
                color
            )}>
                <Icon className="w-6 h-6 sm:w-7 sm:h-7"/>
            </div>
            <h3 className="font-semibold mb-1 sm:mb-2">{title}</h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        </Card>
    );
}

function TechBadgeComponent({ name, url }: TechBadge) {
    return (
        <Image
            src={url}
            alt={name}
            width={140}
            height={28}
            unoptimized
            className="h-6 sm:h-8 w-auto transition-transform duration-200 hover:scale-105"
        />
    );
}

function ListItem({ children }: { children: React.ReactNode }) {
    return (
        <li className="flex items-start gap-2 sm:gap-3">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0 mt-0.5"/>
            <span className="text-sm sm:text-base text-muted-foreground">{children}</span>
        </li>
    );
}

const TECH_BADGES: TechBadge[] = [
    {
        name: 'TypeScript',
        url: 'https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white'
    },
    {
        name: 'Next.js',
        url: 'https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js'
    },
    {
        name: 'Tailwind CSS',
        url: 'https://img.shields.io/badge/Tailwind-4.0-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white'
    },
    {
        name: 'Redis',
        url: 'https://img.shields.io/badge/Redis-7.0-orange?style=for-the-badge&logo=redis'
    },
    {
        name: 'EmailJS',
        url: 'https://img.shields.io/badge/EmailJS-Contact-blue?style=for-the-badge&logo=mailgun'
    },
    {
        name: 'React',
        url: 'https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react'
    },
    {
        name: 'PostgreSQL',
        url: 'https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white'
    },
    {
        name: 'Prisma',
        url: 'https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma'
    }
];

const QUALITY_COLORS = {
    performance: 'bg-green-500/15 text-green-500',
    accessibility: 'bg-blue-500/15 text-blue-500',
    security: 'bg-orange-500/15 text-orange-500',
    seo: 'bg-purple-500/15 text-purple-500'
};

export default function PortfolioProjectPageClient() {
    const t = useTranslations('portfolioProject');

    const meta: ProjectMeta = {
        duration: t('meta.duration'),
        role: t('meta.role'),
        team: t('meta.team'),
        status: t('meta.status')
    };

    const features: FeatureItem[] = [
        { icon: Layout, title: t('features.items.item1.title'), description: t('features.items.item1.description') },
        { icon: Layers, title: t('features.items.item2.title'), description: t('features.items.item2.description') },
        {
            icon: Smartphone, title: t('features.items.item3.title'), description: t('features.items.item3.description')
        }
    ];

    const qualities: QualityItem[] = [
        {
            icon: Zap, title: t('quality.items.performance.title'),
            description: t('quality.items.performance.description'), color: QUALITY_COLORS.performance
        },
        {
            icon: Eye, title: t('quality.items.accessibility.title'),
            description: t('quality.items.accessibility.description'), color: QUALITY_COLORS.accessibility
        },
        {
            icon: Shield, title: t('quality.items.security.title'),
            description: t('quality.items.security.description'), color: QUALITY_COLORS.security
        },
        {
            icon: Search, title: t('quality.items.seo.title'), description: t('quality.items.seo.description'),
            color: QUALITY_COLORS.seo
        }
    ];

    return (
        <article className="min-h-screen">
            <section className="relative pt-8 pb-16 sm:pt-12 sm:pb-24">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="flex justify-center mb-6">
                        <span
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            <Sparkles className="w-4 h-4"/>
                            {t('badge')}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-center tracking-tight mb-6">
                        <span className="gradient-text">{t('title')}</span>
                    </h1>

                    <p className="text-lg sm:text-xl text-muted-foreground text-center max-w-3xl mx-auto mb-8">
                        {t('subtitle')}
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12">
                        <a href="https://paulviandier.com" target="_blank" rel="noopener noreferrer"
                           className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto gap-2 px-6">
                                <ExternalLink className="w-5 h-5"/>
                                {t('links.live')}
                            </Button>
                        </a>
                        <a href="https://github.com/5061756c2e56/portfolio" target="_blank" rel="noopener noreferrer"
                           className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 px-6">
                                <SiGithub className="w-5 h-5"/>
                                {t('links.code')}
                            </Button>
                        </a>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                        <MetricCard icon={Clock} label={t('meta.durationLabel')} value={meta.duration}/>
                        <MetricCard icon={Users} label={t('meta.roleLabel')} value={meta.role}/>
                        <MetricCard icon={Code2} label={t('meta.teamLabel')} value={meta.team}/>
                        <MetricCard icon={TrendingUp} label={t('meta.statusLabel')} value={meta.status}/>
                    </div>
                </div>
            </section>

            <section className="py-16 bg-muted/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <p className="text-lg sm:text-xl text-foreground/90 leading-relaxed">
                            {t('description')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-8">
                        <Card hover={false} className="border-destructive/20 bg-destructive/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div
                                    className="w-10 h-10 rounded-xl bg-destructive/15 flex items-center justify-center">
                                    <Target className="w-5 h-5 text-destructive"/>
                                </div>
                                <h3 className="text-xl font-semibold">{t('problem.title')}</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('problem.description')}
                            </p>
                        </Card>

                        <Card hover={false} className="border-primary/20 bg-primary/5">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 rounded-xl bg-primary/15 flex items-center justify-center">
                                    <Lightbulb className="w-5 h-5 text-primary"/>
                                </div>
                                <h3 className="text-xl font-semibold">{t('solution.title')}</h3>
                            </div>
                            <p className="text-muted-foreground leading-relaxed">
                                {t('solution.description')}
                            </p>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <SectionTitle className="mb-4">{t('features.title')}</SectionTitle>
                        <SectionSubtitle>{t('features.subtitle')}</SectionSubtitle>
                    </div>
                    <div className="grid gap-4 sm:gap-6 md:grid-cols-3">
                        {features.map((feature, idx) => (
                            <FeatureCard key={idx} {...feature} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <SectionTitle className="mb-4">{t('techChoices.title')}</SectionTitle>
                        <SectionSubtitle>{t('techChoices.description')}</SectionSubtitle>
                    </div>

                    <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-8 sm:mb-12">
                        {TECH_BADGES.map((tech) => (
                            <TechBadgeComponent key={tech.name} {...tech} />
                        ))}
                    </div>

                    <Card hover={false} className="max-w-3xl mx-auto">
                        <ul className="space-y-4">
                            <ListItem>{t('techChoices.items.item1')}</ListItem>
                            <ListItem>{t('techChoices.items.item2')}</ListItem>
                            <ListItem>{t('techChoices.items.item3')}</ListItem>
                        </ul>
                    </Card>
                </div>
            </section>

            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto text-center">
                        <SectionTitle className="mb-6">{t('architecture.title')}</SectionTitle>
                        <p className="text-muted-foreground text-lg leading-relaxed">
                            {t('architecture.description')}
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="text-center mb-12">
                        <SectionTitle className="mb-4">{t('quality.title')}</SectionTitle>
                        <SectionSubtitle>{t('quality.subtitle')}</SectionSubtitle>
                    </div>
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                        {qualities.map((quality, idx) => (
                            <QualityCard key={idx} {...quality} />
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20 bg-muted/30">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="grid md:grid-cols-2 gap-8 items-stretch">
                        <div className="flex flex-col">
                            <SectionTitle className="mb-6">{t('challenges.title')}</SectionTitle>
                            <Card hover={false} className="flex-1">
                                <ul className="space-y-4">
                                    <ListItem>{t('challenges.items.item1')}</ListItem>
                                    <ListItem>{t('challenges.items.item2')}</ListItem>
                                </ul>
                            </Card>
                        </div>

                        <div className="flex flex-col">
                            <SectionTitle className="mb-6">{t('results.title')}</SectionTitle>
                            <Card hover={false} className="flex-1">
                                <ul className="space-y-4">
                                    <ListItem>{t('results.items.item1')}</ListItem>
                                    <ListItem>{t('results.items.item2')}</ListItem>
                                    <ListItem>{t('results.items.item3')}</ListItem>
                                </ul>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-20">
                <div className="max-w-5xl mx-auto px-4 sm:px-6">
                    <div className="max-w-3xl mx-auto">
                        <SectionTitle className="text-center mb-8">{t('nextSteps.title')}</SectionTitle>
                        <Card hover={false}>
                            <ul className="space-y-4">
                                <ListItem>{t('nextSteps.items.item1')}</ListItem>
                                <ListItem>{t('nextSteps.items.item2')}</ListItem>
                                <ListItem>{t('nextSteps.items.item3')}</ListItem>
                            </ul>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-16 sm:py-24 bg-linear-to-t from-muted/50 to-transparent">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center">
                    <SectionTitle className="mb-4 sm:mb-6">{t('ctaBottom.title')}</SectionTitle>
                    <p className="text-muted-foreground text-base sm:text-lg mb-6 sm:mb-8 max-w-2xl mx-auto">
                        {t('ctaBottom.description')}
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                        <a href="https://paulviandier.com" target="_blank" rel="noopener noreferrer"
                           className="w-full sm:w-auto">
                            <Button size="lg" className="w-full sm:w-auto gap-2 px-6 sm:px-8">
                                {t('links.live')}
                                <ExternalLink className="w-5 h-5"/>
                            </Button>
                        </a>
                        <a href="https://github.com/5061756c2e56/portfolio" target="_blank" rel="noopener noreferrer"
                           className="w-full sm:w-auto">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto gap-2 px-6 sm:px-8">
                                <SiGithub className="w-5 h-5"/>
                                {t('links.code')}
                            </Button>
                        </a>
                    </div>
                </div>
            </section>
        </article>
    );
}
