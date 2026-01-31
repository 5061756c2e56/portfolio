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

import { useCallback, useState } from 'react';

import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import { useContactModal } from '@/hooks/useContactModal';

export default function Contact() {
    const t = useTranslations('contact');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.2 });
    const [mailtoMode, setMailtoMode] = useState(false);
    const { openContact } = useContactModal();

    const handleEmailClick = useCallback(async () => {
        let shouldMailto = false;

        try {
            const response = await fetch('/api/email/counter', {
                method: 'GET',
                credentials: 'same-origin'
            });

            if (response.ok) {
                const data = await response.json();
                const count = typeof data.count === 'string' ? parseInt(data.count, 10) : data.count;
                shouldMailto = count >= 200;
            }
        } catch {
        } finally {
            setMailtoMode(shouldMailto);
            openContact({ mailtoMode: shouldMailto });
        }
    }, [openContact]);

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
                     className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
                <div className="max-w-4xl mx-auto relative z-10">
                    <h2 className={cn(
                        'text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight transition-all duration-500 gradient-text',
                        isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                    )}>
                        {t('title')}
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {contacts.map((contact, index) => (
                            <button
                                key={index}
                                onClick={contact.action}
                                className={cn(
                                    'group rounded-xl border border-blue-500/20 bg-card p-5 hover:border-blue-500/40 hover:shadow-[0_0_25px_rgba(59,130,246,0.1)] hover:-translate-y-0.5 cursor-pointer transition-all duration-300 text-left',
                                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                                )}
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <div className="mb-4">
                                    <div
                                        className="inline-flex items-center justify-center w-10 h-10 rounded-xl
                                        bg-muted/60 border border-border
                                        group-hover:bg-muted/80 group-hover:border-border/80
                                        transition-all duration-300">
                                        <div
                                            className="text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300">
                                            {contact.icon}
                                        </div>
                                    </div>

                                </div>
                                <h3 className="text-sm font-semibold mb-1 text-foreground">{contact.name}</h3>
                                <p className="text-sm text-muted-foreground group-hover:text-blue-500 transition-colors duration-300">{contact.value}</p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}