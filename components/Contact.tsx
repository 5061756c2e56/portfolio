'use client';

import { useState, useCallback } from 'react';

import { useTranslations } from 'next-intl';
import ContactModal from './ContactModal';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

export default function Contact() {
    const t = useTranslations('contact');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.2 });
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [mailtoMode, setMailtoMode] = useState(false);

    const handleEmailClick = useCallback(async () => {
        try {
            const response = await fetch('/api/email/counter', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                const count = typeof data.count === 'string' ? parseInt(data.count, 10) : data.count;
                setMailtoMode(count >= 200);
            } else {
                setMailtoMode(false);
            }
        } catch (error) {
            setMailtoMode(false);
        } finally {
            setIsModalOpen(true);
        }
    }, []);

    const contacts = [
        {
            name: t('email'),
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                     strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round"
                          d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75"/>
                </svg>
            ),
            action: handleEmailClick,
            value: 'contact@paulviandier.com'
        },
        {
            name: t('github'),
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
            ),
            action: () => window.open('https://github.com/5061756c2e56/', '_blank'),
            value: '5061756c2e56'
        },
        {
            name: t('linkedin'),
            icon: (
                <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path
                        d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
            ),
            action: () => window.open('https://www.linkedin.com/in/paul-viandier-648837397/', '_blank'),
            value: 'Paul Viandier'
        }
    ];

    return (
        <>
            <section ref={ref as React.RefObject<HTMLElement>} id="contact"
                     className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                    <h2 className={cn(
                        'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 tracking-tight transition-all duration-700 gradient-text',
                        isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    )}>
                        {t('title')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                        {contacts.map((contact, index) => (
                            <button
                                key={index}
                                onClick={contact.action}
                                className={cn(
                                    'group relative overflow-hidden rounded-xl border border-border/60 bg-gradient-to-br from-card via-card/95 to-primary/5 p-6 sm:p-8 hover:border-primary/50 hover:-translate-y-2 cursor-pointer transition-all duration-500 text-left',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div
                                    className="absolute inset-0 bg-gradient-to-br from-primary/0 via-accent/0 to-secondary/0 group-hover:from-primary/12 group-hover:via-accent/12 group-hover:to-secondary/10 transition-all duration-700 pointer-events-none"/>
                                <div className="relative z-10">
                                    <div className="mb-5 sm:mb-6">
                                        <div
                                            className="inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-xl border border-border/50 bg-gradient-to-br from-muted/90 to-primary/10 group-hover:from-primary/20 group-hover:to-accent/20 group-hover:border-primary/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                            <div
                                                className="text-foreground group-hover:text-primary transition-colors duration-300 group-hover:scale-110">
                                                {contact.icon}
                                            </div>
                                        </div>
                                    </div>
                                    <h3 className="text-base sm:text-lg font-semibold mb-2 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-primary group-hover:to-accent transition-all duration-300">{contact.name}</h3>
                                    <p className="text-sm sm:text-base text-foreground/75 group-hover:text-foreground transition-colors duration-300">{contact.value}</p>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
            <ContactModal 
                isOpen={isModalOpen} 
                onClose={() => setIsModalOpen(false)}
                mailtoMode={mailtoMode}
            />
        </>
    );
}