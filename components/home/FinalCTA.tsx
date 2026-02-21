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
import { ArrowRight, BarChart3, Gamepad2, HelpCircle } from 'lucide-react';
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

    const list = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: shouldReduceMotion ? 0 : 0.08
            }
        }
    };

    const cards = [
        {
            href: '/faq' as const,
            icon: HelpCircle,
            title: t('faq.title'),
            description: t('faq.description'),
            button: t('faq.button')
        },
        {
            href: '/stats' as const,
            icon: BarChart3,
            title: t('statsGithub.title'),
            description: t('statsGithub.description'),
            button: t('statsGithub.button')
        },
        {
            href: '/games' as const,
            icon: Gamepad2,
            title: t('games.title'),
            description: t('games.description'),
            button: t('games.button')
        }
    ];

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
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h2>

                <motion.p
                    className="text-base sm:text-lg text-muted-foreground mb-10 max-w-2xl"
                    variants={fadeUp}
                >
                    {t('lead')}
                </motion.p>

                <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4" variants={list}>
                    {cards.map((item) => (
                        <motion.div key={item.href} variants={fadeUp}>
                            <Link
                                href={item.href}
                                className="card-accent group flex flex-col h-full rounded-xl border border-border bg-card/80 backdrop-blur-sm p-6 hover:border-foreground/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
                            >
                                <div
                                    className="p-2.5 rounded-lg bg-muted w-fit mb-4 group-hover:bg-linear-to-br group-hover:from-purple-500/10 group-hover:to-blue-500/10 transition-all duration-300">
                                    <item.icon
                                        className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors duration-300" />
                                </div>

                                <h3 className="text-base font-semibold text-foreground mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed flex-1 mb-4">
                                    {item.description}
                                </p>

                                <div
                                    className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                                    <span>{item.button}</span>
                                    <ArrowRight
                                        className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </motion.div>
        </section>
    );
}
