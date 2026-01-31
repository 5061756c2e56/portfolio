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
import { Calendar, Check, ChevronDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { TimeRange, VALID_TIME_RANGES } from '@/lib/github/types';

interface PeriodSelectorProps {
    selectedRange: TimeRange;
    availablePeriods: TimeRange[];
    onRangeChange: (range: TimeRange) => void;
    isLoading?: boolean;
}

export function PeriodSelector({
    selectedRange,
    availablePeriods,
    onRangeChange,
    isLoading = false
}: PeriodSelectorProps) {
    const t = useTranslations('githubStats.periods');
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const close = () => setIsOpen(false);

        function handlePointerDownOutside(event: MouseEvent | TouchEvent) {
            const target = event.target as Node | null;
            if (containerRef.current && target && !containerRef.current.contains(target)) close();
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === 'Escape') close();
        }

        function handleScroll() {
            close();
        }

        document.addEventListener('mousedown', handlePointerDownOutside);
        document.addEventListener('touchstart', handlePointerDownOutside, { passive: true });
        document.addEventListener('keydown', handleKeyDown);
        window.addEventListener('scroll', handleScroll, true);

        return () => {
            document.removeEventListener('mousedown', handlePointerDownOutside);
            document.removeEventListener('touchstart', handlePointerDownOutside);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('scroll', handleScroll, true);
        };
    }, []);

    const handleSelect = (period: TimeRange) => {
        if (availablePeriods.includes(period)) {
            onRangeChange(period);
            setIsOpen(false);
        }
    };

    return (
        <div ref={containerRef} className="relative w-full sm:w-fit">
            <button
                type="button"
                onClick={() => !isLoading && setIsOpen((v) => !v)}
                disabled={isLoading}
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                className={cn(
                    'group flex items-center gap-3 px-4 py-2.5 min-w-40 w-full sm:w-auto',
                    'rounded-xl border bg-card/80 backdrop-blur-sm',
                    'text-sm font-medium',
                    'transition-all duration-300',
                    'hover:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
                    isLoading && 'cursor-wait opacity-80',
                    isOpen
                        ? 'border-blue-500/50 shadow-[0_0_20px_rgba(59,130,246,0.15)]'
                        : 'border-blue-500/20 hover:border-blue-500/40'
                )}
            >
                {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin text-blue-500"/>
                ) : (
                    <Calendar
                        className={cn(
                            'w-4 h-4 transition-colors duration-300',
                            isOpen ? 'text-blue-500' : 'text-muted-foreground group-hover:text-blue-500'
                        )}
                    />
                )}
                <span className="flex-1 text-left">{isLoading ? t('loading') : t(selectedRange)}</span>
                {!isLoading && (
                    <ChevronDown
                        className={cn(
                            'w-4 h-4 text-muted-foreground transition-all duration-300',
                 isOpen && 'rotate-180 text-blue-500'
                        )}
                    />
                )}
            </button>

            {isOpen && (
                <div
                    role="listbox"
                    className={cn(
                        'absolute z-50 mt-2',
                        'left-0 sm:left-auto sm:right-0 min-w-45 w-full sm:w-auto',
                        'rounded-xl border border-blue-500/20 bg-card/95 backdrop-blur-md shadow-xl',
                        'shadow-blue-500/5',
                        'py-1.5 overflow-hidden',
                        'animate-in fade-in-0 zoom-in-95 slide-in-from-top-2 duration-200'
                    )}
                >
                    {VALID_TIME_RANGES.map((period) => {
                        const isAvailable = availablePeriods.includes(period);
                        const isSelected = selectedRange === period;

                        return (
                            <button
                                key={period}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => handleSelect(period)}
                                className={cn(
                                    'w-full flex items-center justify-between px-4 py-2.5',
                                    'text-sm transition-all duration-200',
                                    isAvailable && 'hover:bg-blue-500/10 cursor-pointer',
                                    !isAvailable && 'opacity-40 cursor-not-allowed',
                                    isSelected && 'text-blue-500 bg-blue-500/5 font-medium'
                                )}
                            >
                                <span>{t(period)}</span>
                                {isSelected && <Check className="w-4 h-4 text-blue-500"/>}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}