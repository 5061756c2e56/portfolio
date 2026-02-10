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

import { Link } from '@/i18n/routing';
import { BarChart3, FileText, Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';

export default function FinalCTA() {
    const t = useTranslations('finalCTA');
    const shouldReduceMotion = useReducedMotion();

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

    return (
        <section id="extras" className="scroll-mt-24 py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <motion.div
                className="max-w-4xl mx-auto relative z-10"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >
                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h2>

                <motion.div
                    className="text-base sm:text-lg text-foreground/80 leading-relaxed bg-card rounded-xl p-6 sm:p-8 border border-border hover:border-foreground/20 transition-all duration-300"
                    variants={fadeUp}
                >
                    <p className="mb-5">
                        {t('lead')}
                    </p>

                    <ul className="mb-8 list-disc pl-5 space-y-2">
                        <li>{t('list.faq')}</li>
                        <li>{t('list.stats')}</li>
                        <li>{t('list.games')}</li>
                    </ul>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/faq"
                            className="btn-fill-primary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <FileText
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 md:group-hover:rotate-3"
                                aria-hidden="true"
                            />
                            <span>{t('faqButton')}</span>
                        </Link>

                        <Link
                            href="/stats"
                            className="btn-fill-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <BarChart3
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 md:group-hover:rotate-3"
                                aria-hidden="true"
                            />
                            <span>{t('statsButton')}</span>
                        </Link>
                        
                        <Link
                            href="/games"
                            className="btn-fill-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <Gamepad2
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:scale-110 md:group-hover:-translate-y-0.5 md:group-hover:rotate-6"
                                aria-hidden="true"
                            />
                            <span>{t('gamesButton')}</span>
                        </Link>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
}
