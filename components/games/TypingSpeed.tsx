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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Clock, Keyboard, Play, RotateCcw, Target, X, Zap } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Mode = 'quotes' | 'numbers' | 'punctuation' | 'mixed';
type GameState = 'idle' | 'playing' | 'finished';

const GAME_DURATIONS = [15, 30, 60, 120] as const;

const DEFAULT_DIFFICULTY: Difficulty = 'easy';
const DEFAULT_MODE: Mode = 'mixed';
const DEFAULT_DURATION: ( typeof GAME_DURATIONS )[number] = 60;

const BEST_WPM_PREFIX = 'typingSpeed.bestWpm.v1';

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

function pick<T>(arr: readonly T[]) {
    return arr[randInt(arr.length)];
}

function maybe(prob: number) {
    return randInt(1000) < prob * 1000;
}

function normalizeQuotes(s: string) {
    return s
        .replace(/[’‘]/g, '\'')
        .replace(/[“”]/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatColonsByLocale(input: string, locale: 'fr' | 'en') {
    const s = normalizeQuotes(input);
    const out: string[] = [];
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch !== ':') {
            out.push(ch);
            continue;
        }

        const prev = s[i - 1] ?? '';
        const next = s[i + 1] ?? '';

        const isTimeColon = /\d/.test(prev) && /\d/.test(next);
        if (isTimeColon) {
            out.push(':');
            continue;
        }

        if (locale === 'fr') {
            if (out.length && out[out.length - 1] === ' ') out.pop();
            out.push(' ', ':', ' ');
            if (next === ' ') i += 1;
        } else {
            if (out.length && out[out.length - 1] === ' ') out.pop();
            out.push(':', ' ');
            if (next === ' ') i += 1;
        }
    }

    return out.join('').replace(/\s+/g, ' ').trim();
}

interface TypingBank {
    quotes: string[];
    numbers: string[];
    punctuation: string[];
    coherent: {
        starters: string[];
        actions: string[];
        outcomes: string[];
        addOns: string[];
    };
}

function makeCoherentLine(bank: TypingBank) {
    const c = bank.coherent;
    let line = `${pick(c.starters)}, ${pick(c.actions)} ${pick(c.outcomes)}`;
    if (maybe(0.35)) line += ` ${pick(c.addOns)}`;
    return normalizeQuotes(line);
}

function generateChunk(bank: TypingBank, locale: 'fr' | 'en', mode: Mode, difficulty: Difficulty, used: Set<string>) {

    const targetSentences =
        difficulty === 'easy' ? 2 + randInt(2) : difficulty === 'medium' ? 3 + randInt(2) : 4 + randInt(3);

    const parts: string[] = [];
    for (let i = 0; i < targetSentences; i++) {
        let s = '';

        const roll = randInt(100);
        if (mode === 'quotes') {
            s = roll < 75 ? pick(bank.quotes) : makeCoherentLine(bank);
        } else if (mode === 'numbers') {
            s = roll < 65 ? pick(bank.numbers) : makeCoherentLine(bank);
        } else if (mode === 'punctuation') {
            s = roll < 65 ? pick(bank.punctuation) : makeCoherentLine(bank);
        } else {
            if (roll < 70) {
                s = makeCoherentLine(bank);
            } else if (roll < 82) {
                s = pick(bank.quotes);
            } else if (roll < 92) {
                s = pick(bank.punctuation);
            } else {
                s = pick(bank.numbers);
            }
        }

        s = formatColonsByLocale(s, locale);

        let tries = 0;
        while (used.has(s) && tries < 6) {
            s = makeCoherentLine(bank);
            s = formatColonsByLocale(s, locale);
            tries++;
        }
        used.add(s);
        parts.push(s);
    }

    return parts.join(' ');
}

function readBest(key: string): number | null {
    try {
        if (typeof window === 'undefined') return null;
        const raw = window.localStorage.getItem(key);
        const n = raw == null ? null : Number(raw);
        return Number.isFinite(n) ? n : null;
    } catch {
        return null;
    }
}

function writeBest(key: string, value: number): boolean {
    try {
        if (typeof window === 'undefined') return false;
        window.localStorage.setItem(key, String(value));
        return true;
    } catch {
        return false;
    }
}

function CustomSelect<T extends string>({
    value,
    onChange,
    options,
    label,
    disabled,
    dropdownAlign = 'left'
}: {
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string }[];
    label: string;
    disabled?: boolean;
    dropdownAlign?: 'left' | 'right';
}) {
    const [open, setOpen] = useState(false);
    const openEffective = Boolean(open && !disabled);

    const close = useCallback(() => setOpen(false), []);
    const toggle = useCallback(() => {
        if (disabled) return;
        setOpen((v) => !v);
    }, [disabled]);

    const current = options.find((o) => o.value === value);

    return (
        <div className="relative inline-block">
            <button
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={openEffective}
                disabled={disabled}
                onClick={toggle}
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
                <span className="whitespace-nowrap">{current?.label ?? value}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', openEffective && 'rotate-180')}/>
            </button>

            {openEffective && <div aria-hidden="true" className="fixed inset-0 z-40" onPointerDown={close}/>}

            <div
                role="listbox"
                aria-label={label}
                className={cn(
                    'absolute top-full mt-2 min-w-48 rounded-xl border border-blue-500/20 bg-card/95 backdrop-blur-md shadow-xl shadow-blue-500/5 p-1 z-50',
                    'transition-all duration-150',
                    dropdownAlign === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left',
                    openEffective ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
                )}
            >
                {options.map((opt) => {
                    const active = opt.value === value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                                onChange(opt.value);
                                close();
                            }}
                            className={cn(
                                'w-full px-2.5 py-2 rounded-lg text-sm text-left',
                                'flex items-center justify-between gap-2',
                                'transition-all duration-200',
                                active
                                    ? 'bg-blue-500/10 text-blue-500'
                                    : 'hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500'
                            )}
                        >
                            <span>{opt.label}</span>
                            {active && <Check className="w-4 h-4 text-blue-500"/>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

type DurationValue = ( typeof GAME_DURATIONS )[number];
type DurationString = `${DurationValue}`;

export default function TypingSpeed() {
    const t = useTranslations('games.typing');
    const rawLocale = useLocale();
    const locale: 'fr' | 'en' = rawLocale === 'fr' || rawLocale === 'en' ? rawLocale : 'fr';
    const bank = t.raw('bank') as TypingBank;

    const [gameState, setGameState] = useState<GameState>('idle');

    const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
    const [mode, setMode] = useState<Mode>(DEFAULT_MODE);
    const [duration, setDuration] = useState<DurationValue>(DEFAULT_DURATION);

    const [runDuration, setRunDuration] = useState<DurationValue>(DEFAULT_DURATION);

    const [text, setText] = useState('');
    const [typed, setTyped] = useState('');

    const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const timeLeftRef = useRef<number>(DEFAULT_DURATION);
    const runDurationRef = useRef<number>(DEFAULT_DURATION);
    const runBestKeyRef = useRef<string>('');

    const usedRef = useRef<Set<string>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);
    const typedRef = useRef('');
    const textRef = useRef('');

    const [totalKeystrokes, setTotalKeystrokes] = useState(0);
    const [mistakeKeystrokes, setMistakeKeystrokes] = useState(0);
    const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

    const totalRef = useRef(0);
    const mistakeRef = useRef(0);
    const correctRef = useRef(0);

    const [isNewBest, setIsNewBest] = useState(false);
    const [bestVersion, setBestVersion] = useState(0);

    const bestKey = useMemo(() => {
        return `${BEST_WPM_PREFIX}:${locale}:${difficulty}:${mode}:${duration}`;
    }, [difficulty, duration, locale, mode]);

    const bestWpm = useMemo(() => readBest(bestKey), [bestKey, bestVersion]);

    useEffect(() => {
        textRef.current = text;
    }, [text]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    const computeNetWpmForRun = useCallback(() => {
        const seconds = runDurationRef.current;
        if (seconds <= 0) return 0;
        const minutes = seconds / 60;

        const gross = (
                      totalRef.current / 5
                      ) / minutes;
        const penalty = (
                        mistakeRef.current / 5
                        ) / minutes;
        const net = Math.max(0, gross - penalty);

        return Math.round(Math.min(300, net));
    }, []);

    const finishRun = useCallback(() => {
        stopTimer();
        setGameState('finished');

        const key = runBestKeyRef.current || bestKey;
        const wpm = computeNetWpmForRun();

        const prevBest = readBest(key);
        const improved = prevBest == null ? true : wpm > prevBest;

        if (improved) {
            const wrote = writeBest(key, wpm);
            if (wrote) setBestVersion((v) => v + 1);
            setIsNewBest(true);
        } else {
            setIsNewBest(false);
        }

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [bestKey, computeNetWpmForRun, stopTimer]);

    const hardReset = useCallback(() => {
        stopTimer();
        usedRef.current.clear();

        setGameState('idle');

        setDifficulty(DEFAULT_DIFFICULTY);
        setMode(DEFAULT_MODE);
        setDuration(DEFAULT_DURATION);

        setRunDuration(DEFAULT_DURATION);
        runDurationRef.current = DEFAULT_DURATION;

        setText('');
        setTyped('');
        typedRef.current = '';
        textRef.current = '';

        setTimeLeft(DEFAULT_DURATION);
        timeLeftRef.current = DEFAULT_DURATION;

        totalRef.current = 0;
        correctRef.current = 0;
        mistakeRef.current = 0;

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setIsNewBest(false);

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [stopTimer]);

    const cancelGame = useCallback(() => {
        stopTimer();
        usedRef.current.clear();

        setGameState('idle');

        setText('');
        setTyped('');
        typedRef.current = '';
        textRef.current = '';

        setRunDuration(duration);
        runDurationRef.current = duration;

        setTimeLeft(duration);
        timeLeftRef.current = duration;

        totalRef.current = 0;
        correctRef.current = 0;
        mistakeRef.current = 0;

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setIsNewBest(false);

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [duration, stopTimer]);

    const backToIdleFromResults = useCallback(() => {
        stopTimer();
        usedRef.current.clear();

        setGameState('idle');

        setText('');
        setTyped('');
        typedRef.current = '';
        textRef.current = '';

        setRunDuration(duration);
        runDurationRef.current = duration;

        setTimeLeft(duration);
        timeLeftRef.current = duration;

        totalRef.current = 0;
        correctRef.current = 0;
        mistakeRef.current = 0;

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setIsNewBest(false);

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [duration, stopTimer]);

    const ensureMoreText = useCallback(() => {
        const need = Math.max(120, difficulty === 'easy' ? 160 : difficulty === 'medium' ? 240 : 320);
        if (text.length - typedRef.current.length > need) return;

        const used = usedRef.current;
        const more = generateChunk(bank, locale, mode, difficulty, used);
        setText((prev) => (
            prev ? `${prev} ${more}` : more
        ));
    }, [bank, difficulty, locale, mode, text.length]);

    const startGame = useCallback(() => {
        stopTimer();
        usedRef.current.clear();
        setIsNewBest(false);

        runBestKeyRef.current = bestKey;

        setRunDuration(duration);
        runDurationRef.current = duration;

        timeLeftRef.current = duration;
        setTimeLeft(duration);

        totalRef.current = 0;
        correctRef.current = 0;
        mistakeRef.current = 0;

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        const used = usedRef.current;
        const initial = generateChunk(bank, locale, mode, difficulty, used);
        const second = generateChunk(bank, locale, mode, difficulty, used);
        const initialText = `${initial} ${second}`;

        setText(initialText);
        textRef.current = initialText;

        setTyped('');
        typedRef.current = '';

        setGameState('playing');

        intervalRef.current = setInterval(() => {
            const next = Math.max(0, timeLeftRef.current - 1);
            timeLeftRef.current = next;
            setTimeLeft(next);
            if (next === 0) finishRun();
        }, 1000);

        requestAnimationFrame(() => inputRef.current?.focus());
    }, [bank, bestKey, difficulty, duration, finishRun, locale, mode, stopTimer]);

    const pushChars = useCallback(
        (raw: string) => {
            if (gameState !== 'playing') return;
            if (!raw) return;

            const target = textRef.current;
            let nextTyped = typedRef.current;

            let addTotal = 0;
            let addCorrect = 0;
            let addMistakes = 0;

            for (const ch of raw) {
                if (ch === '\n' || ch === '\r') continue;

                const pos = nextTyped.length;
                const expected = target[pos] ?? '';

                addTotal += 1;
                if (ch === expected) {
                    addCorrect += 1;
                } else {
                    addMistakes += 1;
                }

                nextTyped += ch;
            }

            typedRef.current = nextTyped;
            setTyped(nextTyped);

            totalRef.current += addTotal;
            correctRef.current += addCorrect;
            mistakeRef.current += addMistakes;

            setTotalKeystrokes(totalRef.current);
            setCorrectKeystrokes(correctRef.current);
            setMistakeKeystrokes(mistakeRef.current);

            ensureMoreText();
        },
        [ensureMoreText, gameState]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (gameState !== 'playing') return;

        if (e.key === 'Backspace') {
            e.preventDefault();
            const cur = typedRef.current;
            if (!cur) return;

            const next = cur.slice(0, -1);
            typedRef.current = next;
            setTyped(next);

            return;
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            pushChars(e.key);
        }
    };

    const handleBeforeInput = (e: React.FormEvent<HTMLInputElement>) => {
        if (gameState !== 'playing') return;

        const native = e.nativeEvent;
        if (!(
            native instanceof InputEvent
        )) {
            return;
        }

        const data = native.data;
        if (!data) return;

        native.preventDefault();
        pushChars(data);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    const activeDuration = gameState === 'idle' ? duration : runDuration;
    const displayTimeLeft = gameState === 'idle' ? duration : timeLeft;

    const elapsedSeconds = useMemo(() => {
        if (gameState === 'idle') return 0;
        const elapsed = activeDuration - displayTimeLeft;
        return Math.max(0, elapsed);
    }, [activeDuration, displayTimeLeft, gameState]);

    const netWpm = useMemo(() => {
        if (elapsedSeconds <= 0) return 0;
        const minutes = elapsedSeconds / 60;

        const gross = (
                      totalKeystrokes / 5
                      ) / minutes;
        const penalty = (
                        mistakeKeystrokes / 5
                        ) / minutes;
        const net = Math.max(0, gross - penalty);

        return Math.round(Math.min(300, net));
    }, [elapsedSeconds, mistakeKeystrokes, totalKeystrokes]);

    const accuracy = useMemo(() => {
        if (totalKeystrokes === 0) return 100;
        return Math.max(0, Math.min(100, Math.round((
                                                        correctKeystrokes / totalKeystrokes
                                                    ) * 100)));
    }, [correctKeystrokes, totalKeystrokes]);

    const progress = useMemo(() => {
        if (activeDuration <= 0) return 0;
        return Math.max(0, Math.min(100, Math.round((
                                                        (
                                                            activeDuration - displayTimeLeft
                                                        ) / activeDuration
                                                    ) * 100)));
    }, [activeDuration, displayTimeLeft]);

    const renderText = () => {
        const out: React.ReactNode[] = [];
        const showLen = Math.min(text.length, typed.length + 240);
        for (let i = 0; i < showLen; i++) {
            const target = text[i];
            const typedChar = typed[i];

            if (typedChar == null) {
                const isCaret = i === typed.length;
                out.push(
                    <span
                        key={i}
                        className={cn('text-muted-foreground', isCaret
                                                               && 'bg-foreground/20 text-foreground rounded-sm')}
                    >
                        {target}
                    </span>
                );
            } else {
                const ok = typedChar === target;
                out.push(
                    <span key={i} className={cn(ok ? 'text-green-500' : 'text-red-500 bg-red-500/20 rounded-sm')}>
                        {target}
                    </span>
                );
            }
        }
        return out;
    };

    const difficultyOptions = useMemo(
        () => [
            { value: 'easy' as const, label: t('levels.easy') },
            { value: 'medium' as const, label: t('levels.medium') },
            { value: 'hard' as const, label: t('levels.hard') }
        ],
        [t]
    );

    const modeOptions = useMemo(
        () => [
            { value: 'mixed' as const, label: t('modes.mixed') },
            { value: 'quotes' as const, label: t('modes.quotes') },
            { value: 'numbers' as const, label: t('modes.numbers') },
            { value: 'punctuation' as const, label: t('modes.punctuation') }
        ],
        [t]
    );

    const durationOptions = useMemo(
        () =>
            GAME_DURATIONS.map((d) => (
                {
                    value: String(d) as DurationString,
                    label: `${d}s`
                }
            )),
        []
    );

    const controlsDisabled = gameState === 'playing';
    const canCancel = gameState === 'playing';
    const canReset = gameState !== 'playing';

    if (gameState === 'finished') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Keyboard className="w-5 h-5 text-blue-500"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{t('title')}</h2>
                        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                    </div>
                </div>

                <div
                    className="p-6 rounded-xl border border-blue-500/20 bg-linear-to-b from-blue-500/5 to-transparent text-center">
                    <div className="text-4xl mb-4">⌨️</div>
                    <h3 className="text-xl font-semibold mb-2">{t('results.title')}</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold text-blue-500">{netWpm}</div>
                            <div className="text-sm text-muted-foreground">WPM</div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold">{accuracy}%</div>
                            <div className="text-sm text-muted-foreground">{t('results.accuracy')}</div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold">{Math.round(elapsedSeconds)}s</div>
                            <div className="text-sm text-muted-foreground">{t('results.time')}</div>
                        </div>

                        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <div className="text-2xl font-bold">{bestWpm ?? netWpm}</div>
                            <div className="text-sm text-muted-foreground">
                                {isNewBest ? (
                                    locale === 'fr' ? 'Nouveau record !' : 'New best!'
                                ) : t('results.best')}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <Button onClick={backToIdleFromResults} className="gap-2">
                            <RotateCcw className="w-4 h-4"/>
                            {t('playAgain')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Keyboard className="w-5 h-5 text-blue-500"/>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-blue-500/20 bg-card space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500"/>
                            <span className={cn('font-mono text-lg', displayTimeLeft <= 10 && gameState === 'playing'
                                                                     && 'text-red-500')}>
                                {displayTimeLeft}s
                            </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-blue-500"/>
                            <span className="font-mono text-lg">{netWpm} WPM</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-blue-500"/>
                            <span className="font-mono text-lg">{accuracy}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap">
                        {gameState === 'idle' ? (
                            <Button onClick={startGame} className="gap-2">
                                <Play className="w-4 h-4"/>
                                {t('start')}
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={startGame} className="gap-2">
                                <RotateCcw className="w-4 h-4"/>
                                {t('restart')}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={cancelGame}
                            className="gap-2"
                            disabled={!canCancel}
                            title={locale === 'fr' ? 'Annule la partie en cours' : 'Cancel current run'}
                        >
                            <X className="w-4 h-4"/>
                            <span className="hidden sm:inline">{locale === 'fr' ? 'Annuler' : 'Cancel'}</span>
                        </Button>
                    </div>
                </div>

                <div className="w-full h-2 rounded-full bg-blue-500/10 overflow-hidden">
                    <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }}/>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-2 justify-between">
                    <div className="flex items-center gap-2 flex-wrap">
                        <CustomSelect
                            key={`difficulty-${controlsDisabled ? 'd' : 'e'}`}
                            value={difficulty}
                            onChange={setDifficulty}
                            options={difficultyOptions}
                            label="Difficulty"
                            disabled={controlsDisabled}
                        />
                        <CustomSelect
                            key={`mode-${controlsDisabled ? 'd' : 'e'}`}
                            value={mode}
                            onChange={setMode}
                            options={modeOptions}
                            label="Mode"
                            disabled={controlsDisabled}
                        />
                        <CustomSelect<DurationString>
                            key={`duration-${controlsDisabled ? 'd' : 'e'}`}
                            value={String(duration) as DurationString}
                            onChange={(v) => setDuration(Number(v) as DurationValue)}
                            options={durationOptions}
                            label="Duration"
                            disabled={controlsDisabled}
                            dropdownAlign="right"
                        />
                    </div>

                    <button
                        type="button"
                        onClick={hardReset}
                        disabled={!canReset}
                        className={cn(
                            'text-sm text-muted-foreground hover:text-blue-500 transition-colors',
                            !canReset && 'opacity-60 cursor-not-allowed hover:text-muted-foreground'
                        )}
                    >
                        {t('reset')}
                    </button>
                </div>
            </div>

            <div className="p-4 sm:p-6 rounded-xl border border-blue-500/20 bg-card">
                <div
                    className="text-base sm:text-lg leading-relaxed mb-6 p-3 sm:p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 min-h-16">
                    {gameState === 'idle' ? (
                        <span className="text-muted-foreground">{t('pressStart')}</span>
                    ) : (
                        <span className="whitespace-pre-wrap break-words">{renderText()}</span>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value=""
                    readOnly
                    onKeyDown={handleKeyDown}
                    onBeforeInput={handleBeforeInput}
                    onPaste={handlePaste}
                    disabled={gameState !== 'playing'}
                    placeholder={gameState === 'playing' ? t('typeHere') : ''}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    inputMode="text"
                    name="typing-speed"
                    enterKeyHint="done"
                    className={cn(
                        'w-full h-12 px-4 rounded-xl border bg-transparent text-base transition-all duration-300',
                        'focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_20px_rgba(59,130,246,0.15)]',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        gameState === 'playing' ? 'border-blue-500/30' : 'border-blue-500/20'
                    )}
                />
            </div>
        </div>
    );
}