'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import { Earth, FileText } from 'lucide-react';
import { useRouter } from '@/i18n/routing';
import Image from 'next/image';
import { SiGithub } from 'react-icons/si';

export default function Projects() {
    const t = useTranslations('projects');
    const { ref, isInView } = useInView({ threshold: 0.1 });

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState<string>('all');

    const router = useRouter();

    const projects = [
        {
            id: 'portfolio',
            slug: 'portfolio',
            title: t('portfolio.title'),
            description: t('portfolio.description'),
            technologies: ['TypeScript', 'NextJS', 'Tailwind CSS', 'Redis', 'EmailJS'],
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
            technologies: ['TypeScript', 'Tailwind CSS', 'NextJS'],
            buttons: [
                {
                    label: t('buttonGitHub'),
                    href: 'https://github.com/5061756c2e56/Web-Security',
                    variant: 'white'
                },
                {
                    label: t('buttonVisitSite'),
                    href: 'https://security.paulviandier.com',
                    variant: 'gray'
                }
            ]
        }
    ];

    const techBadges: Record<string, string> = {
        'TypeScript': 'https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white',
        'NextJS': 'https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js',
        'Tailwind CSS': 'https://img.shields.io/badge/Tailwind-4.0-38bdf8?style=for-the-badge&logo=tailwind-css',
        'Redis': 'https://img.shields.io/badge/Redis-7.0-orange?style=for-the-badge&logo=redis',
        'EmailJS': 'https://img.shields.io/badge/EmailJS-Contact-blue?style=for-the-badge&logo=mailgun'
    };

    const allTechnologies = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
        return Array.from(techSet).sort();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch =
                searchQuery === '' ||
                project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesTech =
                selectedTech === 'all' ||
                project.technologies.includes(selectedTech);

            return matchesSearch && matchesTech;
        });
    }, [searchQuery, selectedTech]);

    return (
        <section ref={ref as React.RefObject<HTMLElement>} id="projects"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight transition-all duration-500 gradient-text',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    {t('title')}
                </h2>

                <div className={cn(
                    'mb-6 space-y-4 transition-all duration-500',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )} style={{ animationDelay: '100ms' }}>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
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
                </div>

                {filteredProjects.length === 0 ? (
                    <div className={cn(
                        'text-center py-12 text-muted-foreground transition-all duration-500',
                        isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    )}>
                        <p className="text-lg">{t('noResults')}</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 auto-rows-fr">
                        {filteredProjects.map((project, index) => (
                            <div
                                key={index}
                                className={cn(
                                    'group h-full flex flex-col rounded-xl border border-border bg-card p-5 hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-foreground">{project.title}</h3>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed flex-1">{project.description}</p>
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
                                        <a key={i} href={btn.href} target="_blank" rel="noopener noreferrer"
                                           className="w-full sm:w-auto">
                                            <Button
                                                className={cn(
                                                    'w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm',
                                                    btn.variant === 'white'
                                                        ? 'bg-white text-gray-900 border border-gray-200 hover:bg-gray-100 hover:shadow'
                                                        : 'btn-fill-secondary'
                                                )}
                                            >
                                                {btn.label === t('buttonGitHub') && <SiGithub className="w-4 h-4"/>}
                                                {btn.label === t('buttonVisitSite') && <Earth className="w-4 h-4"/>}
                                                {btn.label}
                                            </Button>
                                        </a>
                                    ))}
                                    {project.slug && (
                                        <Button
                                            onClick={() => router.push(`/projects/${project.slug}`)}
                                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-medium transition-colors duration-200 shadow-sm btn-fill-secondary"
                                        >
                                            <FileText className="w-4 h-4"/>
                                            {t('buttonDetail')}
                                        </Button>
                                    )}
                                </div>

                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}