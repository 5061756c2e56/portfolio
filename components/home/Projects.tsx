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

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils';
import { Earth, FileText } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { SiGithub } from 'react-icons/si';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';

const techBadges: Record<string, string> = {
    TypeScript: 'https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
    NextJS: 'https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js',
    'Tailwind CSS': 'https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css',
    Redis: 'https://img.shields.io/badge/Redis-7.0-orange?style=for-the-badge&logo=redis',
    EmailJS: 'https://img.shields.io/badge/EmailJS-Contact-blue?style=for-the-badge&logo=mailgun',
    React: 'https://img.shields.io/badge/React-19.2-61dafb?style=for-the-badge&logo=react',
    PostgreSQL: 'https://img.shields.io/badge/PostgreSQL-DB-4169E1?style=for-the-badge&logo=postgresql&logoColor=white',
    Prisma: 'https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma'
};

export default function Projects() {
    const t = useTranslations('projects');
    const shouldReduceMotion = useReducedMotion();

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState<string>('all');

    const router = useRouter();

    const projects = useMemo(
        () => [
            {
                id: 'portfolio',
                slug: 'portfolio',
                title: t('portfolio.title'),
                description: t('portfolio.description'),
                technologies: [
                    'TypeScript', 'NextJS', 'Tailwind CSS', 'Redis', 'EmailJS', 'React', 'Prisma', 'PostgreSQL'
                ],
                buttons: [
                    {
                        label: t('buttonGitHub'),
                        href: 'https://github.com/5061756c2e56/portfolio',
                        variant: 'white'
                    }
                ]
            },
            {
                id: 'web-security',
                title: t('webSecurity.title'),
                description: t('webSecurity.description'),
                technologies: ['TypeScript', 'Tailwind CSS', 'NextJS', 'React'],
                buttons: [
                    {
                        label: t('buttonGitHub'),
                        href: 'https://github.com/5061756c2e56/Web-Security',
                        variant: 'white'
                    }
                    // {
                    //     label: t('buttonVisitSite'),
                    //     href: 'https://security.paulviandier.com',
                    //     variant: 'gray'
                    // }
                ]
            }
        ],
        [t]
    );

    const allTechnologies = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach((project) => {
            project.technologies.forEach((tech) => techSet.add(tech));
        });
        return Array.from(techSet).sort();
    }, [projects]);

    const normalizedQuery = useMemo(() => searchQuery.trim().toLowerCase(), [searchQuery]);

    const filteredProjects = useMemo(() => {
        return projects.filter((project) => {
            const matchesSearch =
                normalizedQuery === '' ||
                project.title.toLowerCase().includes(normalizedQuery) ||
                project.description.toLowerCase().includes(normalizedQuery) ||
                project.technologies.some((tech) => tech.toLowerCase().includes(normalizedQuery));

            const matchesTech = selectedTech === 'all' || project.technologies.includes(selectedTech);

            return matchesSearch && matchesTech;
        });
    }, [projects, normalizedQuery, selectedTech]);

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 16,
            filter: shouldReduceMotion ? 'blur(0px)' : 'blur(8px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            filter: 'blur(0px)'
        }
    };

    const container = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.12,
                delayChildren: shouldReduceMotion ? 0 : 0.08
            }
        }
    };

    const list = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.08
            }
        }
    };

    const card = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
            scale: shouldReduceMotion ? 1 : 0.98,
            filter: shouldReduceMotion ? 'blur(0px)' : 'blur(10px)'
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: 'blur(0px)'
        },
        exit: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 10,
            scale: shouldReduceMotion ? 1 : 0.98,
            transition: { duration: 0.2 }
        }
    };

    return (
        <section
            id="projects"
            className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative"
        >
            <motion.div
                className="max-w-4xl mx-auto relative z-10"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
            >
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h2>

                <motion.div className="mb-6 space-y-4" variants={fadeUp}>
                    <div className="relative">
                        <Input
                            type="text"
                            placeholder={t('searchPlaceholder')}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4"
                        />
                        <svg
                            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                            />
                        </svg>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <Button
                            variant={selectedTech === 'all' ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => setSelectedTech('all')}
                        >
                            {t('allTechnologies')}
                        </Button>
                        {allTechnologies.map((tech) => (
                            <Button
                                key={tech}
                                variant={selectedTech === tech ? 'default' : 'outline'}
                                size="sm"
                                onClick={() => setSelectedTech(tech)}
                            >
                                {tech}
                            </Button>
                        ))}
                    </div>
                </motion.div>

                {filteredProjects.length === 0 ? (
                    <motion.div
                        className="text-center py-12 text-muted-foreground"
                        variants={fadeUp}
                    >
                        <p className="text-lg">{t('noResults')}</p>
                    </motion.div>
                ) : (
                    <motion.div className="grid grid-cols-1 gap-6 auto-rows-fr" variants={list}>
                        <AnimatePresence mode="popLayout">
                            {filteredProjects.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className="group h-full flex flex-col rounded-xl border border-border bg-card p-5 hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300"
                                    variants={card}
                                    exit="exit"
                                    layout
                                >
                                    <h3 className="text-lg font-semibold mb-2 text-foreground">{project.title}</h3>
                                    <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">
                                        {project.description}
                                    </p>

                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {project.technologies.map((tech) => (
                                            <Image
                                                key={tech}
                                                src={techBadges[tech]}
                                                alt={tech}
                                                width={140}
                                                height={28}
                                                unoptimized
                                                className="h-7 w-auto"
                                            />
                                        ))}
                                    </div>

                                    <div
                                        className="mt-auto flex flex-col sm:flex-row sm:flex-wrap sm:items-start sm:justify-start gap-2">
                                        {project.buttons?.map((btn, i) => (
                                            <a
                                                key={i}
                                                href={btn.href}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="w-full sm:w-auto"
                                            >
                                                <Button
                                                    className={cn(
                                                        'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm',
                                                        btn.variant === 'white'
                                                            ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 hover:shadow'
                                                            : 'btn-fill-secondary'
                                                    )}
                                                >
                                                    {btn.label === t('buttonGitHub') && <SiGithub
                                                        className="w-4 h-4" />}
                                                    {btn.label === t('buttonVisitSite') && <Earth
                                                        className="w-4 h-4" />}
                                                    {btn.label}
                                                </Button>
                                            </a>
                                        ))}

                                        {'slug' in project && (
                                            project as { slug?: string }
                                        ).slug && (
                                             <Button
                                                 onClick={() => router.push(`/projects/${(
                                                     project as { slug: string }
                                                 ).slug}`)}
                                                 className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm btn-fill-secondary"
                                             >
                                                 <FileText className="w-4 h-4" />
                                                 {t('buttonDetail')}
                                             </Button>
                                         )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                )}
            </motion.div>
        </section>
    );
}
