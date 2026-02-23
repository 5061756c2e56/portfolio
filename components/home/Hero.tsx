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

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter } from '@/i18n/routing';
import { Briefcase, Download, Eye, FileUser, MailOpen, MapPin } from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { motion, useReducedMotion } from 'framer-motion';

export default function Hero() {
    const t = useTranslations('hero');
    const router = useRouter();
    const shouldReduceMotion = useReducedMotion();

    const fadeUp = {
        hidden: {
            opacity: 0,
            y: shouldReduceMotion ? 0 : 18,
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
                delayChildren: shouldReduceMotion ? 0 : 0.1
            }
        }
    };

    const [isDownloadingCV, setIsDownloadingCV] = useState(false);
    const [isDownloadingLM, setIsDownloadingLM] = useState(false);

    const [cvOpen, setCvOpen] = useState(false);
    const [lmOpen, setLmOpen] = useState(false);

    const cvLongPressTimerRef = useRef<number | null>(null);
    const lmLongPressTimerRef = useRef<number | null>(null);

    const didLongPressCVRef = useRef(false);
    const didLongPressLMRef = useRef(false);

    const allowOpenCVRef = useRef(false);
    const allowOpenLMRef = useRef(false);

    const onCvOpenChange = (next: boolean) => {
        if (next && !allowOpenCVRef.current) return;
        allowOpenCVRef.current = false;
        setCvOpen(next);
    };

    const onLmOpenChange = (next: boolean) => {
        if (next && !allowOpenLMRef.current) return;
        allowOpenLMRef.current = false;
        setLmOpen(next);
    };

    useEffect(() => {
        if (!cvOpen && !lmOpen) return;

        const close = () => {
            setCvOpen(false);
            setLmOpen(false);
        };

        window.addEventListener('scroll', close, true);
        window.addEventListener('wheel', close, { passive: true });
        window.addEventListener('touchmove', close, { passive: true });

        return () => {
            window.removeEventListener('scroll', close, true);
            window.removeEventListener('wheel', close as EventListener);
            window.removeEventListener('touchmove', close as EventListener);
        };
    }, [cvOpen, lmOpen]);

    const downloadFile = (
        fileUrl: string,
        fileName: string,
        isDownloading: boolean,
        setIsDownloading: (v: boolean) => void
    ) => {
        if (isDownloading) return;

        setIsDownloading(true);

        const reset = () => setIsDownloading(false);

        const onVisibility = () => {
            if (document.visibilityState === 'visible') reset();
        };

        const onPageHide = () => reset();

        document.addEventListener('visibilitychange', onVisibility, { passive: true });
        window.addEventListener('focus', reset, { once: true });
        window.addEventListener('pagehide', onPageHide, { once: true });

        const link = document.createElement('a');
        link.href = fileUrl;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const resetTimer = window.setTimeout(() => reset(), 2500);

        window.setTimeout(() => {
            document.removeEventListener('visibilitychange', onVisibility);
            window.clearTimeout(resetTimer);
        }, 3000);
    };

    const startLongPress = (
        timerRef: React.MutableRefObject<number | null>,
        didLongPressRef: React.MutableRefObject<boolean>,
        allowOpenRef: React.MutableRefObject<boolean>,
        setOpen: (v: boolean) => void
    ) => {
        didLongPressRef.current = false;

        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }

        timerRef.current = window.setTimeout(() => {
            didLongPressRef.current = true;
            allowOpenRef.current = true;
            setOpen(true);
        }, 450);
    };

    const cancelLongPress = (timerRef: React.MutableRefObject<number | null>) => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    return (
        <section
            id="home"
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-24 relative overflow-hidden"
        >
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div
                    className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 sm:w-175 sm:h-175 rounded-full bg-linear-to-br from-purple-500/8 to-blue-500/8 blur-[120px]" />
            </div>

            <motion.div
                className="max-w-5xl mx-auto text-center w-full relative z-10"
                variants={container}
                initial="hidden"
                animate="visible"
            >
                <motion.div
                    className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-8"
                    variants={fadeUp}
                >
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <MapPin className="w-4 h-4 text-blue-500" />
                        <span>{t('location')}</span>
                    </div>

                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card/80 backdrop-blur-sm border border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <Briefcase className="w-4 h-4 text-blue-500" />
                        <span>{t('role')}</span>
                    </div>
                </motion.div>

                <motion.h1
                    className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-bold mb-6 leading-[1.05] tracking-tight gradient-text"
                    variants={fadeUp}
                >
                    {t('title')}
                </motion.h1>

                <motion.h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 text-muted-foreground"
                           variants={fadeUp}>
                    {t('subtitle')}
                </motion.h2>

                <motion.p
                    className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto mb-12 leading-relaxed"
                    variants={fadeUp}
                >
                    {t('description')}
                </motion.p>

                <motion.div className="flex flex-col sm:flex-row justify-center gap-4" variants={fadeUp}>
                    <DropdownMenu modal={false} open={cvOpen} onOpenChange={onCvOpenChange}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    allowOpenCVRef.current = true;
                                    setCvOpen(true);
                                }}
                                onClick={() => {
                                    if (cvOpen) return;
                                    if (didLongPressCVRef.current) {
                                        didLongPressCVRef.current = false;
                                        return;
                                    }
                                    router.push('/curriculum-vitae');
                                }}
                                onPointerDown={(e) => {
                                    if (e.pointerType !== 'touch') return;
                                    e.preventDefault();

                                    const startX = e.clientX;
                                    const startY = e.clientY;

                                    startLongPress(
                                        cvLongPressTimerRef,
                                        didLongPressCVRef,
                                        allowOpenCVRef,
                                        setCvOpen
                                    );

                                    const onMove = (ev: PointerEvent) => {
                                        if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 10) {
                                            cancelLongPress(cvLongPressTimerRef);
                                        }
                                    };

                                    const cleanup = () => {
                                        window.removeEventListener('pointermove', onMove);
                                        cancelLongPress(cvLongPressTimerRef);
                                    };

                                    window.addEventListener('pointermove', onMove, { passive: true });
                                    window.addEventListener('pointerup', cleanup, { passive: true, once: true });
                                    window.addEventListener('pointercancel', cleanup, { passive: true, once: true });
                                }}
                                onPointerLeave={() => cancelLongPress(cvLongPressTimerRef)}
                                className="btn-fill-primary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 cursor-pointer select-none"
                                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                            >
                                <FileUser
                                    className="w-5 h-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 relative z-10" />
                                <span className="relative z-10">{t('viewCVButton')}</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="bottom" align="center" sideOffset={8} className="min-w-[200px]">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    downloadFile(
                                        '/Curriculum Vitae - Viandier Paul.pdf',
                                        'Curriculum Vitae - Viandier Paul.pdf',
                                        isDownloadingCV,
                                        setIsDownloadingCV
                                    );
                                }}
                                disabled={isDownloadingCV}
                                className="cursor-pointer gap-3"
                            >
                                <span className="inline-flex w-6 items-center justify-center">
                                    <Download className="size-4 shrink-0" />
                                </span>
                                <span className="leading-none">{t('downloadCVButton')}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    router.push('/curriculum-vitae');
                                }}
                                className="cursor-pointer gap-3"
                            >
                                <span className="inline-flex w-6 items-center justify-center">
                                    <Eye className="size-4 shrink-0" />
                                </span>
                                <span className="leading-none">{t('viewButtonDropdown')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    <DropdownMenu modal={false} open={lmOpen} onOpenChange={onLmOpenChange}>
                        <DropdownMenuTrigger asChild>
                            <button
                                type="button"
                                onContextMenu={(e) => {
                                    e.preventDefault();
                                    allowOpenLMRef.current = true;
                                    setLmOpen(true);
                                }}
                                onClick={() => {
                                    if (lmOpen) return;
                                    if (didLongPressLMRef.current) {
                                        didLongPressLMRef.current = false;
                                        return;
                                    }
                                    router.push('/motivation-letter');
                                }}
                                onPointerDown={(e) => {
                                    if (e.pointerType !== 'touch') return;
                                    e.preventDefault();

                                    const startX = e.clientX;
                                    const startY = e.clientY;

                                    startLongPress(
                                        lmLongPressTimerRef,
                                        didLongPressLMRef,
                                        allowOpenLMRef,
                                        setLmOpen
                                    );

                                    const onMove = (ev: PointerEvent) => {
                                        if (Math.abs(ev.clientX - startX) + Math.abs(ev.clientY - startY) > 10) {
                                            cancelLongPress(lmLongPressTimerRef);
                                        }
                                    };

                                    const cleanup = () => {
                                        window.removeEventListener('pointermove', onMove);
                                        cancelLongPress(lmLongPressTimerRef);
                                    };

                                    window.addEventListener('pointermove', onMove, { passive: true });
                                    window.addEventListener('pointerup', cleanup, { passive: true, once: true });
                                    window.addEventListener('pointercancel', cleanup, { passive: true, once: true });
                                }}
                                onPointerLeave={() => cancelLongPress(lmLongPressTimerRef)}
                                className="btn-fill-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300 cursor-pointer select-none"
                                style={{ WebkitTouchCallout: 'none', WebkitUserSelect: 'none', userSelect: 'none' }}
                            >
                                <MailOpen
                                    className="w-5 h-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 relative z-10" />
                                <span className="relative z-10">{t('viewLMButton')}</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="bottom" align="center" sideOffset={8} className="min-w-[200px]">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    downloadFile(
                                        '/Lettre de motivation - Viandier Paul.pdf',
                                        'Lettre de motivation - Viandier Paul.pdf',
                                        isDownloadingLM,
                                        setIsDownloadingLM
                                    );
                                }}
                                disabled={isDownloadingLM}
                                className="cursor-pointer gap-3"
                            >
                                <span className="inline-flex w-6 items-center justify-center">
                                    <Download className="size-4 shrink-0" />
                                </span>
                                <span className="leading-none">{t('downloadLMButton')}</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    router.push('/motivation-letter');
                                }}
                                className="cursor-pointer gap-3"
                            >
                                <span className="inline-flex w-6 items-center justify-center">
                                    <Eye className="size-4 shrink-0" />
                                </span>
                                <span className="leading-none">{t('viewButtonDropdown')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </motion.div>

                <motion.p
                    className="mt-6 text-xs sm:text-sm text-muted-foreground/70 max-w-md mx-auto"
                    variants={fadeUp}
                >
                    {t('quickActionsHint')}
                </motion.p>
            </motion.div>
        </section>
    );
}
