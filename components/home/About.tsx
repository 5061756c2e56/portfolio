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

import { useTranslations } from 'next-intl';
import { motion, useReducedMotion } from 'framer-motion';
import { GraduationCap, ShieldCheck, Target } from 'lucide-react';

const statusItems = [
    {
        icon: GraduationCap,
        label: 'statusItem.1.label',
        sub: 'statusItem.1.sub'
    },
    {
        icon: ShieldCheck,
        label: 'statusItem.2.label',
        sub: 'statusItem.2.sub'
    },
    {
        icon: Target,
        label: 'statusItem.3.label',
        sub: 'statusItem.3.sub'
    }
];

export default function About() {
    const t = useTranslations('about');
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
        <section
            id="about"
            className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative"
        >
            <motion.div
                className="max-w-4xl mx-auto relative z-10"
                variants={container}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
            >

                <motion.h2
                    className="text-3xl sm:text-4xl md:text-5xl font-bold mb-10 tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] gap-8 md:gap-10 items-start">

                    <motion.p
                        className="text-base sm:text-lg text-foreground/70 leading-relaxed"
                        variants={fadeUp}
                    >
                        {t('content')}
                    </motion.p>

                    <motion.div
                        className="card-accent rounded-xl border border-border bg-card/80 backdrop-blur-sm p-5 flex flex-col divide-y divide-border/60"
                        variants={fadeUp}
                    >
                        {statusItems.map((item) => (
                            <div key={item.label} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
                                <div
                                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-linear-to-br from-purple-500/10 to-blue-500/10 border border-border">
                                    <item.icon className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium leading-none">{t(item.label)}</p>
                                    <p className="mt-1 text-xs text-muted-foreground">{t(item.sub)}</p>
                                </div>
                            </div>
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </section>
    );
}
