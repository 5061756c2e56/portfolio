'use client';

import { useCallback, useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger
} from '@/components/ui/tooltip';
import { Toast } from '@/components/ui/toast';
import { useIsMobile } from '@/hooks/use-mobile';
import ContactModal from '@/components/ContactModal';
import { CVSidebar } from '@/components/CVSidebar';
import SkillsSection from '@/components/CVSkillsSection';
import FormattedText from '@/components/FormattedText';

export default function CurriculumVitae() {
    const t = useTranslations('cv');
    const tContact = useTranslations('contact');
    const tNav = useTranslations('nav');
    const isMobile = useIsMobile();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [showToast, setShowToast] = useState(false);

    const handleEmailClick = useCallback(() => {
        setIsModalOpen(true);
    }, []);

    const handleSuccess = useCallback(() => {
        setShowToast(true);
    }, []);

    return (
        <SidebarProvider>
            <CVSidebar/>
            <SidebarInset>
                <div
                    className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 lg:hidden">
                    <SidebarTrigger/>
                </div>
                <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30 relative overflow-hidden">
                    <div className="absolute inset-0 opacity-30 pointer-events-none" style={{background: 'radial-gradient(circle at 50% 50%, hsl(var(--primary) / 0.05) 0%, transparent 50%)'}}></div>
                    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12 relative z-10">
                        <div className="bg-card/80 backdrop-blur-xl rounded-2xl border border-border/50 shadow-2xl shadow-black/5 dark:shadow-black/20 p-6 sm:p-8 lg:p-10 relative overflow-hidden">
                            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent"></div>
                            <div className="mb-8 pb-8 border-b border-border/40">
                                <div className="text-center mb-6">
                                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold mb-3 text-foreground tracking-tight bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                                        {t('name')}
                                    </h1>
                                    <h2 className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-4 font-semibold">
                                        {t('title')}
                                    </h2>
                                    <div className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                                        <FormattedText
                                            text={t('description')}
                                            className=""
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center justify-center gap-4">
                                    {!isMobile ? (
                                        <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://github.com/5061756c2e56"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                                                    aria-label={t('github')}
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                                    </svg>
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('github')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <a
                                            href="https://github.com/5061756c2e56"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                                            aria-label="GitHub"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {!isMobile ? (
                                        <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                                <a
                                                    href="https://www.linkedin.com/in/paul-viandier-648837397/"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                                                    aria-label={t('linkedin')}
                                                >
                                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                                    </svg>
                                                </a>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('linkedin')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <a
                                            href="https://www.linkedin.com/in/paul-viandier-648837397/"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                                            aria-label="LinkedIn"
                                        >
                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                                            </svg>
                                        </a>
                                    )}
                                    {!isMobile ? (
                                        <Tooltip delayDuration={200}>
                                            <TooltipTrigger asChild>
                                                <button
                                                    onClick={handleEmailClick}
                                                    className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 cursor-pointer"
                                                    aria-label={tNav('email')}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                                    </svg>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent>
                                                <p>{t('contactEmail')}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    ) : (
                                        <button
                                            onClick={handleEmailClick}
                                            className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-muted to-muted/80 hover:from-muted/90 hover:to-muted/70 border border-border/50 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-110 hover:-translate-y-0.5"
                                            aria-label="Email"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/>
                                            </svg>
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="space-y-12 lg:space-y-14">
                                <section className="relative">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                            {t('education.title')}
                                        </h3>
                                    </div>
                                    <div className="space-y-8">
                                        <div className="relative pl-8 border-l-2 border-primary/30">
                                            <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-gradient-to-br from-primary to-primary/80 border-4 border-background shadow-lg shadow-primary/20"></div>
                                            <div className="space-y-3 bg-gradient-to-r from-muted/20 to-transparent rounded-xl p-5 -ml-2 border border-border/30">
                                                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                                                    <div className="space-y-1">
                                                        <h4 className="text-xl sm:text-2xl font-bold text-foreground">
                                                            {t('education.items.0.title')}
                                                        </h4>
                                                        <p className="text-sm sm:text-base text-muted-foreground font-semibold flex items-center gap-2">
                                                            <Image
                                                                src="/OC.svg"
                                                                alt="OpenClassroom"
                                                                width={13}
                                                                height={16}
                                                                className="flex-shrink-0"
                                                            />
                                                            {t('education.items.0.school')}
                                                        </p>
                                                    </div>
                                                    <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-primary/15 to-primary/10 text-primary border border-primary/30 shadow-sm whitespace-nowrap">
                                                        {t('education.items.0.period')}
                                                    </span>
                                                </div>
                                                <FormattedText
                                                    text={t('education.items.0.description')}
                                                    className="text-sm sm:text-base text-foreground/90 leading-relaxed max-w-3xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </section>

                                <section className="relative">
                                    <div className="flex items-center gap-3 mb-6">
                                        <div className="h-1 w-12 bg-gradient-to-r from-primary to-primary/60 rounded-full"></div>
                                        <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
                                            {t('skills.title')}
                                        </h3>
                                    </div>
                                    <SkillsSection/>
                                </section>
                            </div>
                        </div>
                    </div>
                </div>
            </SidebarInset>
            <ContactModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={handleSuccess}
                mailtoMode={true}
            />
            {showToast && (
                <Toast
                    message={tContact('modal.success')}
                    type="success"
                    duration={4000}
                    onClose={() => setShowToast(false)}
                />
            )}
        </SidebarProvider>
    );
}