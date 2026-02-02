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
import { Download, Eye, FileTypeCorner, Folder } from 'lucide-react';
import {
    DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export default function Hero() {
    const t = useTranslations('hero');
    const router = useRouter();

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
            window.removeEventListener('wheel', close as any);
            window.removeEventListener('touchmove', close as any);
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
            className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-24 relative"
        >
            <div className="max-w-4xl mx-auto text-center w-full relative z-10 animate-fade-in-up">
                <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-muted-foreground mb-8">
                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <svg
                            className="w-4 h-4 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"/>
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                            />
                        </svg>
                        <span>{t('location')}</span>
                    </div>

                    <div
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-card border border-blue-500/20 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.1)] transition-all duration-300">
                        <svg
                            className="w-4 h-4 text-blue-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M20.25 14.15v4.25c0 .414-.336.75-.75.75h-4.5a.75.75 0 01-.75-.75v-4.25m0 0h4.5m-4.5 0l-3 3m3-3l3 3M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 00-1.883 2.542l.857 6a2.25 2.25 0 002.227 1.932H19.05a2.25 2.25 0 002.227-1.932l.857-6a2.25 2.25 0 00-1.883-2.542m-16.5 0V6A2.25 2.25 0 016 3.75h3.879a1.5 1.5 0 011.06.44l2.122 2.12a1.5 1.5 0 001.06.44H18A2.25 2.25 0 0120.25 9v.776"
                            />
                        </svg>
                        <span>{t('role')}</span>
                    </div>
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 leading-[1.05] tracking-tight gradient-text">
                    {t('title')}
                </h1>

                <h2 className="text-xl sm:text-2xl md:text-3xl font-normal mb-6 text-foreground/70">
                    {t('subtitle')}
                </h2>

                <p className="text-base sm:text-lg text-muted-foreground max-w-xl mx-auto mb-12 leading-relaxed">
                    {t('description')}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-4">
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
                                <Folder
                                    className="w-5 h-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 relative z-10"/>
                                <span className="relative z-10">{t('viewCVButton')}</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="bottom" align="center" sideOffset={8} className="min-w-[200px]">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    downloadFile(
                                        '/Curriculum Vitae - Paul Viandier.pdf',
                                        'Curriculum Vitae - Paul Viandier.pdf',
                                        isDownloadingCV,
                                        setIsDownloadingCV
                                    );
                                }}
                                disabled={isDownloadingCV}
                                className="cursor-pointer gap-3"
                            >
                                <span className="inline-flex w-6 items-center justify-center">
                                    <Download className="size-4 shrink-0"/>
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
                                    <Eye className="size-4 shrink-0"/>
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
                                <FileTypeCorner
                                    className="w-5 h-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 relative z-10"/>
                                <span className="relative z-10">{t('viewLMButton')}</span>
                            </button>
                        </DropdownMenuTrigger>

                        <DropdownMenuContent side="bottom" align="center" sideOffset={8} className="min-w-[200px]">
                            <DropdownMenuItem
                                onSelect={(e) => {
                                    e.preventDefault();
                                    downloadFile(
                                        '/Lettre de motivation - Paul Viandier.pdf',
                                        'Lettre de motivation - Paul Viandier.pdf',
                                        isDownloadingLM,
                                        setIsDownloadingLM
                                    );
                                }}
                                disabled={isDownloadingLM}
                                className="cursor-pointer gap-3"
                            >
                                <span className="inline-flex w-6 items-center justify-center">
                                    <Download className="size-4 shrink-0"/>
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
                                    <Eye className="size-4 shrink-0"/>
                                </span>
                                <span className="leading-none">{t('viewButtonDropdown')}</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                <p className="mt-6 text-xs sm:text-sm text-muted-foreground/70 max-w-md mx-auto">
                    {t('quickActionsHint')}
                </p>
            </div>
        </section>
    );
}
