'use client';

import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

export default function Projects() {
    const t = useTranslations('projects');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.1 });
    const [showSecuritySuiteDialog, setShowSecuritySuiteDialog] = useState(false);

    const projects = [
        {
            title: t('portfolio.title'),
            description: t('portfolio.description'),
            technologies: ['TypeScript', 'Next.js', 'Tailwind CSS'],
            link: 'https://github.com/5061756c2e56/site',
            isExternal: true
        },
        {
            title: t('securitySuite.title'),
            description: t('securitySuite.description'),
            technologies: ['TypeScript', 'PostgreSQL', 'Next.js'],
            link: '#',
            isExternal: false,
            onClick: () => setShowSecuritySuiteDialog(true)
        }
    ];

    const handleProjectClick = (project: typeof projects[0], e: React.MouseEvent) => {
        if (!project.isExternal && project.onClick) {
            e.preventDefault();
            project.onClick();
        }
    };

    return (
        <>
            <section ref={ref as React.RefObject<HTMLElement>} id="projects"
                     className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/10 relative overflow-hidden">
                <div
                    className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.06),transparent_50%)] pointer-events-none"/>
                <div className="max-w-6xl mx-auto relative z-10">
                    <h2 className={cn(
                        'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight transition-all duration-700',
                        isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    )}>
                        <span
                            className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                            {t('title')}
                        </span>
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                        {projects.map((project, index) => (
                            <a
                                key={index}
                                href={project.link}
                                onClick={(e) => handleProjectClick(project, e)}
                                target={project.isExternal ? '_blank' : undefined}
                                rel={project.isExternal ? 'noopener noreferrer' : undefined}
                                className={cn(
                                    'group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-5 sm:p-6 hover:border-foreground/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 cursor-pointer transition-all duration-500',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"/>
                                <div className="relative z-10">
                                    <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                                        {project.title}
                                    </h3>
                                    <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                                        {project.description}
                                    </p>
                                    <div className="flex flex-wrap gap-2 mb-4 sm:mb-6">
                                        {project.technologies.map((tech, techIndex) => (
                                            <span
                                                key={tech}
                                                className="inline-flex items-center rounded-md border border-border/50 bg-gradient-to-br from-muted/80 to-muted/50 px-2.5 py-1 text-xs sm:text-sm font-medium text-muted-foreground group-hover:border-blue-500/30 group-hover:bg-gradient-to-br group-hover:from-blue-500/10 group-hover:to-purple-500/10 group-hover:text-foreground/90 transition-all duration-300 group-hover:scale-105"
                                                style={{ transitionDelay: `${techIndex * 30}ms` }}
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                    <div
                                        className="flex items-center gap-2 text-sm sm:text-base font-medium text-foreground opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                        {t('viewProject')}
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                        </svg>
                                    </div>
                                </div>
                            </a>
                        ))}
                    </div>
                </div>
            </section>
            <AlertDialog open={showSecuritySuiteDialog} onOpenChange={setShowSecuritySuiteDialog}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>{t('securitySuite.dialog.title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {t('securitySuite.dialog.description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setShowSecuritySuiteDialog(false)}>
                            {t('securitySuite.dialog.close')}
                        </AlertDialogCancel>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}