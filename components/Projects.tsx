'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

import { useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

export default function Projects() {
    const t = useTranslations('projects');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedTech, setSelectedTech] = useState<string>('all');

    const projects = [
        {
            title: t('portfolio.title'),
            description: t('portfolio.description'),
            technologies: ['TypeScript', 'NextJS', 'Tailwind CSS', 'Redis'],
            link: 'https://github.com/5061756c2e56/portfolio',
            isExternal: true
        },
        {
            title: t('webSecurity.title'),
            description: t('webSecurity.description'),
            technologies: ['TypeScript', 'Tailwind CSS', 'NextJS'],
            link: 'https://security.paulviandier.com',
            isExternal: true
        }
    ];

    const allTechnologies = useMemo(() => {
        const techSet = new Set<string>();
        projects.forEach(project => {
            project.technologies.forEach(tech => techSet.add(tech));
        });
        return Array.from(techSet).sort();
    }, []);

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const matchesSearch = searchQuery === '' ||
                                  project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  project.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                  project.technologies.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesTech = selectedTech === 'all' ||
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {filteredProjects.map((project, index) => (
                            <a
                                key={index}
                                href={project.link}
                                target={project.isExternal ? '_blank' : undefined}
                                rel={project.isExternal ? 'noopener noreferrer' : undefined}
                                className={cn(
                                    'group rounded-xl border border-border bg-card p-5 hover:border-foreground/20 hover:-translate-y-0.5 cursor-pointer transition-all duration-300',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <h3 className="text-lg font-semibold mb-2 text-foreground group-hover:text-foreground transition-colors duration-300">
                                    {project.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mb-4 leading-relaxed group-hover:text-foreground/70 transition-colors duration-300">
                                    {project.description}
                                </p>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.technologies.map((tech) => (
                                        <span
                                            key={tech}
                                            className="inline-flex items-center rounded-md bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground"
                                        >
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-all duration-300">
                                    {t('viewProject')}
                                    <svg
                                        className="w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300"
                                        fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                        <path strokeLinecap="round" strokeLinejoin="round"
                                              d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                    </svg>
                                </div>
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}