'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Brain, Check, ChevronDown, Clock, RotateCcw, Trophy, Zap } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface Card {
    id: number;
    emoji: string;
    isFlipped: boolean;
    isMatched: boolean;
}

const TECH_EMOJIS = [
    '⚛️', '🔷', '🟢', '🔶', '🐍', '☕', '🦀', '💎',
    '🔴', '🟣', '🔵', '🟡', '⚡', '🔥', '💻', '🖥️',
    '📱', '🌐', '🔒', '🗄️', '📊', '🎯', '🚀', '⚙️'
];

const GRID_CONFIG: Record<Difficulty, { pairs: number; cols: string }> = {
    easy: { pairs: 6, cols: 'grid-cols-3 sm:grid-cols-4' },
    medium: { pairs: 8, cols: 'grid-cols-4' },
    hard: { pairs: 12, cols: 'grid-cols-4 sm:grid-cols-6' }
};

function randInt(maxExclusive: number) {
    if (maxExclusive <= 0) return 0;
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
        const arr = new Uint32Array(1);
        const maxUint = 0xffffffff;
        const limit = maxUint - (
            maxUint % maxExclusive
        );
        let x = 0;
        do {
            crypto.getRandomValues(arr);
            x = arr[0];
        } while (x >= limit);
        return x % maxExclusive;
    }
    return Math.floor(Math.random() * maxExclusive);
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function CustomDifficultySelect({
    value,
    onChange,
    labels,
    ariaLabel,
    disabled
}: {
    value: Difficulty;
    onChange: (v: Difficulty) => void;
    labels: Record<Difficulty, string>;
    ariaLabel: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener('pointerdown', onPointerDown);
        return () => window.removeEventListener('pointerdown', onPointerDown);
    }, []);

    useEffect(() => {
        if (disabled) setOpen(false);
    }, [disabled]);

    const items: Difficulty[] = ['easy', 'medium', 'hard'];

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label={ariaLabel}
                aria-haspopup="listbox"
                aria-expanded={open}
                onClick={() => !disabled && setOpen((v) => !v)}
                disabled={disabled}
                className={cn(
                    'h-10 px-3 rounded-xl border border-blue-500/20 bg-transparent text-sm',
                    'inline-flex items-center gap-2',
                    'transition-all duration-300',
                    disabled
                        ? 'opacity-60 cursor-not-allowed'
                        : 'hover:bg-blue-500/10 hover:border-blue-500/40 hover:text-blue-500',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/30'
                )}
            >
                <span className="whitespace-nowrap">{labels[value]}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}/>
            </button>

            <div
                className={cn(
                    'absolute left-0 sm:left-auto sm:right-0 mt-2 w-44 origin-top-left sm:origin-top-right rounded-xl border border-blue-500/20 bg-card/95 backdrop-blur-md shadow-xl shadow-blue-500/5 p-1 z-50',
                    'transition-all duration-150',
                    open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
                )}
                role="listbox"
                aria-label={ariaLabel}
            >
                {items.map((it) => {
                    const active = it === value;
                    return (
                        <button
                            key={it}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                                onChange(it);
                                setOpen(false);
                            }}
                            className={cn(
                                'w-full px-2.5 py-2 rounded-lg text-sm text-left',
                                'flex items-center justify-between gap-2',
                                'transition-all duration-200',
                                active ? 'bg-blue-500/10 text-blue-500' : 'hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500'
                            )}
                        >
                            <span>{labels[it]}</span>
                            {active && <Check className="w-4 h-4 text-blue-500"/>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function MemoryGame() {
    const t = useTranslations('games.memory');

    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedIds, setFlippedIds] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    const flipTimeoutsRef = useRef<number[]>([]);
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const { pairs, cols } = useMemo(() => GRID_CONFIG[difficulty], [difficulty]);

    const labels = useMemo(
        () => (
            {
                easy: t('levels.easy'),
                medium: t('levels.medium'),
                hard: t('levels.hard')
            }
        ),
        [t]
    );

    const clearFlipTimeouts = useCallback(() => {
        flipTimeoutsRef.current.forEach((id) => window.clearTimeout(id));
        flipTimeoutsRef.current = [];
    }, []);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const buildDeck = useCallback((diff: Difficulty) => {
        const { pairs } = GRID_CONFIG[diff];
        const selected = shuffleArray(TECH_EMOJIS).slice(0, pairs);
        const deck = shuffleArray([...selected, ...selected]).map((emoji, index) => (
            {
                id: index,
                emoji,
                isFlipped: false,
                isMatched: false
            }
        ));
        return deck;
    }, []);

    const applyNewGameState = useCallback(
        (diff: Difficulty) => {
            clearFlipTimeouts();
            stopTimer();
            setCards(buildDeck(diff));
            setFlippedIds([]);
            setMoves(0);
            setMatches(0);
            setGameStarted(false);
            setGameComplete(false);
            setTimer(0);
            setIsProcessing(false);
        },
        [buildDeck, clearFlipTimeouts, stopTimer]
    );

    const initializeGame = useCallback(
        (diff: Difficulty) => {
            setIsSwitching(true);
            setDifficulty(diff);
            applyNewGameState(diff);
            requestAnimationFrame(() => requestAnimationFrame(() => setIsSwitching(false)));
        },
        [applyNewGameState]
    );

    useEffect(() => {
        initializeGame('easy');
        return () => {
            clearFlipTimeouts();
            stopTimer();
        };
    }, [initializeGame, clearFlipTimeouts, stopTimer]);

    useEffect(() => {
        stopTimer();
        if (gameStarted && !gameComplete) {
            intervalRef.current = setInterval(() => setTimer((s) => s + 1), 1000);
        }
        return stopTimer;
    }, [gameStarted, gameComplete, stopTimer]);

    useEffect(() => {
        if (gameStarted && matches === pairs) {
            setGameComplete(true);
            setIsProcessing(false);
            setFlippedIds([]);
            clearFlipTimeouts();
        }
    }, [matches, pairs, gameStarted, clearFlipTimeouts]);

    useEffect(() => {
        if (flippedIds.length !== 2 || isProcessing || gameComplete || isSwitching) return;

        const [aId, bId] = flippedIds;
        const a = cards.find((c) => c.id === aId);
        const b = cards.find((c) => c.id === bId);
        if (!a || !b) return;

        setIsProcessing(true);
        setMoves((m) => m + 1);

        const isMatch = a.emoji === b.emoji;

        const timeoutId = window.setTimeout(() => {
            if (isMatch) {
                setCards((prev) =>
                    prev.map((c) => (
                        c.id === aId || c.id === bId ? { ...c, isMatched: true } : c
                    ))
                );
                setMatches((m) => m + 1);
            } else {
                setCards((prev) =>
                    prev.map((c) => (
                        c.id === aId || c.id === bId ? { ...c, isFlipped: false } : c
                    ))
                );
            }

            setFlippedIds([]);
            setIsProcessing(false);
        }, isMatch ? 450 : 850);

        flipTimeoutsRef.current.push(timeoutId);
    }, [flippedIds, isProcessing, gameComplete, cards, isSwitching]);

    const handleDifficultyChange = (d: Difficulty) => {
        if (d === difficulty) return;
        initializeGame(d);
    };

    const handleCardClick = (cardId: number) => {
        if (isProcessing || gameComplete || isSwitching) return;
        if (flippedIds.length >= 2) return;

        const card = cards.find((c) => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;

        if (!gameStarted) setGameStarted(true);

        setCards((prev) => prev.map((c) => (
            c.id === cardId ? { ...c, isFlipped: true } : c
        )));
        setFlippedIds((prev) => [...prev, cardId]);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const restartDisabled = (
                                !gameStarted && !gameComplete
                            ) || isSwitching;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Brain className="w-5 h-5 text-blue-500"/>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-blue-500/20 bg-card">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500"/>
                        <span className="font-mono text-lg">{formatTime(timer)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-500"/>
                        <span className="font-mono text-lg">{moves}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-blue-500"/>
                        <span className="font-mono text-lg">
              {matches}/{pairs}
            </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <CustomDifficultySelect
                        value={difficulty}
                        onChange={handleDifficultyChange}
                        labels={labels}
                        ariaLabel="Difficulty"
                        disabled={isSwitching}
                    />
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => initializeGame(difficulty)}
                        className="gap-2"
                        disabled={restartDisabled}
                    >
                        <RotateCcw className="w-4 h-4"/>
                        {t('restart')}
                    </Button>
                </div>
            </div>

            {gameComplete && (
                <div
                    className="p-6 rounded-xl border border-blue-500/20 bg-linear-to-b from-blue-500/5 to-transparent text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold mb-2">{t('complete.title')}</h3>
                    <p className="text-muted-foreground mb-4">
                        {t('complete.stats', { moves, time: formatTime(timer) })}
                    </p>
                    <Button onClick={() => initializeGame(difficulty)} className="gap-2">
                        <RotateCcw className="w-4 h-4"/>
                        {t('playAgain')}
                    </Button>
                </div>
            )}

            <div
                className={cn(
                    'grid gap-3 max-w-2xl mx-auto',
                    cols,
                    'transition-opacity duration-150',
                    isSwitching ? 'opacity-0 pointer-events-none' : 'opacity-100'
                )}
            >
                {cards.map((card) => {
                    const shown = card.isFlipped || card.isMatched;

                    return (
                        <button
                            key={card.id}
                            onClick={() => handleCardClick(card.id)}
                            disabled={card.isMatched || isProcessing || isSwitching}
                            className={cn(
                                'aspect-square rounded-xl border transition-all duration-200 transform',
                                'flex items-center justify-center text-3xl sm:text-4xl',
                                shown
                                    ? 'bg-card border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.1)]'
                                    : 'bg-muted border-blue-500/10 hover:border-blue-500/30 hover:bg-blue-500/5 hover:scale-105',
                                card.isMatched && 'opacity-60',
                                (
                                    isProcessing || isSwitching
                                ) && !card.isMatched && 'cursor-not-allowed'
                            )}
                        >
              <span className={cn('transition-opacity duration-150', shown ? 'opacity-100' : 'opacity-0')}>
                {card.emoji}
              </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}