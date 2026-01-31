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
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, ChevronRight, Clock, RotateCcw, SquareFunction, Trophy, Zap } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

interface MathChallenge {
    question: string;
    answer: number;
    options: number[];
    type: 'arithmetic' | 'priority' | 'binary' | 'hex';
    explanation: string;
}

function randInt(min: number, max: number): number {
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
        const range = max - min;
        const arr = new Uint32Array(1);
        const maxUint = 0xffffffff;
        const limit = maxUint - (
            maxUint % range
        );
        let x = 0;
        do {
            crypto.getRandomValues(arr);
            x = arr[0];
        } while (x >= limit);
        return min + (
            x % range
        );
    }
    return Math.floor(Math.random() * (
        max - min
    )) + min;
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = randInt(0, i + 1);
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function generateWrongAnswers(correct: number, count: number): number[] {
    const wrong = new Set<number>();

    while (wrong.size < count) {
        const offset = randInt(-10, 11);
        if (offset === 0) continue;
        const wrongAnswer = correct + offset;
        if (wrongAnswer !== correct && wrongAnswer > 0) wrong.add(wrongAnswer);
    }

    return Array.from(wrong);
}

function generateArithmetic(difficulty: Difficulty): MathChallenge {
    let a: number, b: number, c: number, answer: number, question: string, explanation: string;

    if (difficulty === 'easy') {
        a = randInt(1, 20);
        b = randInt(1, 20);
        const op = ['+', '-', '×'][randInt(0, 3)];

        switch (op) {
            case '+':
                answer = a + b;
                question = `${a} + ${b}`;
                explanation = `${a} + ${b} = ${answer}`;
                break;
            case '-':
                if (a < b) [a, b] = [b, a];
                answer = a - b;
                question = `${a} - ${b}`;
                explanation = `${a} - ${b} = ${answer}`;
                break;
            case '×':
                a = randInt(2, 12);
                b = randInt(2, 12);
                answer = a * b;
                question = `${a} × ${b}`;
                explanation = `${a} × ${b} = ${answer}`;
                break;
            default:
                answer = 0;
                question = '';
                explanation = '';
        }
    } else if (difficulty === 'medium') {
        a = randInt(5, 30);
        b = randInt(2, 15);
        c = randInt(2, 20);

        const ops = [
            { q: `${a} + ${b} × ${c}`, a: a + b * c, e: `${a} + ${b} × ${c} = ${a} + ${b * c} = ${a + b * c}` },
            { q: `${a} × ${b} + ${c}`, a: a * b + c, e: `${a} × ${b} + ${c} = ${a * b} + ${c} = ${a * b + c}` },
            {
                q: `(${a} + ${b}) × ${c}`,
                a: (
                       a + b
                   ) * c,
                e: `(${a} + ${b}) × ${c} = ${a + b} × ${c} = ${(
                                                                   a + b
                                                               ) * c}`
            },
            {
                q: `${a + b} - ${b} × ${c}`,
                a: (
                       a + b
                   ) - b * c,
                e: `${a + b} - ${b} × ${c} = ${a + b} - ${b * c} = ${(
                                                                         a + b
                                                                     ) - b * c}`
            }
        ];

        const selected = ops[randInt(0, ops.length)];
        question = selected.q;
        answer = selected.a;
        explanation = selected.e;
    } else {
        a = randInt(10, 50);
        b = randInt(2, 20);
        c = randInt(2, 15);
        const d = randInt(2, 10);

        const ops = [
            {
                q: `${a} + ${b} × ${c} - ${d}`,
                a: a + b * c - d,
                e: `${a} + ${b} × ${c} - ${d} = ${a} + ${b * c} - ${d} = ${a + b * c - d}`
            },
            {
                q: `(${a} + ${b}) × ${c} - ${d}`,
                a: (
                       a + b
                   ) * c - d,
                e: `(${a} + ${b}) × ${c} - ${d} = ${a + b} × ${c} - ${d} = ${(
                                                                                 a + b
                                                                             ) * c - d}`
            },
            {
                q: `${a} × ${b} + ${c} × ${d}`,
                a: a * b + c * d,
                e: `${a} × ${b} + ${c} × ${d} = ${a * b} + ${c * d} = ${a * b + c * d}`
            },
            {
                q: `${a + b} - ${b} × ${c} + ${d}`,
                a: (
                   a + b
                   ) - b * c + d,
                e: `${a + b} - ${b} × ${c} + ${d} = ${a + b} - ${b * c} + ${d} = ${(
                                                                                   a + b
                                                                                   ) - b * c + d}`
            }
        ];

        const selected = ops[randInt(0, ops.length)];
        question = selected.q;
        answer = selected.a;
        explanation = selected.e;
    }

    const wrongAnswers = generateWrongAnswers(answer, 3);
    const options = shuffleArray([answer, ...wrongAnswers]);

    return { question, answer, options, type: 'arithmetic', explanation };
}

function generateBinaryConversion(difficulty: Difficulty): MathChallenge {
    const decimal =
        difficulty === 'easy' ? randInt(1, 16) : difficulty === 'medium' ? randInt(16, 64) : randInt(64, 256);

    const binary = decimal.toString(2);
    const question = `${binary}₂ ${'en base 10'}`;
    const explanation = `${binary}₂ = ${decimal}₁₀`;

    const wrongAnswers = generateWrongAnswers(decimal, 3);
    const options = shuffleArray([decimal, ...wrongAnswers]);

    return { question, answer: decimal, options, type: 'binary', explanation };
}

function generateHexConversion(difficulty: Difficulty): MathChallenge {
    const decimal =
        difficulty === 'easy' ? randInt(10, 32) : difficulty === 'medium' ? randInt(32, 128) : randInt(128, 512);

    const hex = decimal.toString(16).toUpperCase();
    const question = `0x${hex} ${'en base 10'}`;
    const explanation = `0x${hex} = ${decimal}₁₀`;

    const wrongAnswers = generateWrongAnswers(decimal, 3);
    const options = shuffleArray([decimal, ...wrongAnswers]);

    return { question, answer: decimal, options, type: 'hex', explanation };
}

function generateDecimalToBinary(difficulty: Difficulty): MathChallenge {
    const decimal =
        difficulty === 'easy' ? randInt(1, 16) : difficulty === 'medium' ? randInt(16, 64) : randInt(64, 128);

    const binary = decimal.toString(2);
    const answer = parseInt(binary, 10);
    const question = `${decimal}₁₀ ${'en binaire'}`;
    const explanation = `${decimal}₁₀ = ${binary}₂`;

    const wrongBinaries: number[] = [];
    for (let i = 0; i < 3; i++) {
        let wrongDecimal = decimal + randInt(-5, 6);
        if (wrongDecimal < 1) wrongDecimal = decimal + randInt(1, 5);
        if (wrongDecimal === decimal) wrongDecimal = decimal + randInt(1, 3);
        wrongBinaries.push(parseInt(wrongDecimal.toString(2), 10));
    }

    const options = shuffleArray([answer, ...wrongBinaries]);
    return { question, answer, options, type: 'binary', explanation };
}

function generateChallenge(difficulty: Difficulty): MathChallenge {
    const types: Array<'arithmetic' | 'binary' | 'hex'> = ['arithmetic', 'arithmetic', 'binary', 'hex'];
    if (difficulty === 'hard') types.push('binary', 'hex');

    const type = types[randInt(0, types.length)];
    switch (type) {
        case 'binary':
            return randInt(0, 2) === 0 ? generateBinaryConversion(difficulty) : generateDecimalToBinary(difficulty);
        case 'hex':
            return generateHexConversion(difficulty);
        default:
            return generateArithmetic(difficulty);
    }
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
                                active
                                    ? 'bg-blue-500/10 text-blue-500'
                                    : 'hover:bg-blue-500/10 text-muted-foreground hover:text-blue-500'
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

export default function SpeedMath() {
    const t = useTranslations('games.mentalcpu');

    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [currentChallenge, setCurrentChallenge] = useState<MathChallenge | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);
    const [timer, setTimer] = useState(30);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [isSwitching, setIsSwitching] = useState(false);

    const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

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

    const timeLimit = useMemo(() => {
        switch (difficulty) {
            case 'easy':
                return 45;
            case 'medium':
                return 35;
            case 'hard':
                return 25;
        }
    }, [difficulty]);

    const getNextChallenge = useCallback(() => {
        const challenge = generateChallenge(difficulty);
        setCurrentChallenge(challenge);
        setSelectedAnswer(null);
        setIsAnswered(false);
    }, [difficulty]);

    const stopTimer = useCallback(() => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    }, []);

    const startGame = useCallback(() => {
        setGameStarted(true);
        setGameOver(false);
        setScore(0);
        setStreak(0);
        setQuestionsAnswered(0);
        setTimer(timeLimit);
        getNextChallenge();

        stopTimer();
        timerRef.current = setInterval(() => {
            setTimer((prev) => {
                if (prev <= 1) {
                    stopTimer();
                    setGameOver(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
    }, [timeLimit, getNextChallenge, stopTimer]);

    const handleDifficultyChange = (d: Difficulty) => {
        if (d === difficulty) return;

        setIsSwitching(true);
        stopTimer();
        setDifficulty(d);
        setGameStarted(false);
        setGameOver(false);
        setScore(0);
        setStreak(0);
        setQuestionsAnswered(0);
        setCurrentChallenge(null);
        setSelectedAnswer(null);
        setIsAnswered(false);

        requestAnimationFrame(() => requestAnimationFrame(() => setIsSwitching(false)));
    };

    const handleAnswerSelect = (answer: number) => {
        if (isAnswered || !currentChallenge || gameOver) return;

        setSelectedAnswer(answer);
        setIsAnswered(true);
        setQuestionsAnswered((prev) => prev + 1);

        if (answer === currentChallenge.answer) {
            const bonus = Math.floor(streak / 3);
            setScore((prev) => prev + 1 + bonus);
            setStreak((prev) => {
                const nextStreak = prev + 1;
                setMaxStreak((m) => Math.max(m, nextStreak));
                return nextStreak;
            });
        } else {
            setStreak(0);
        }
    };

    const handleNext = () => {
        getNextChallenge();
    };

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    if (!gameStarted && !gameOver) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <SquareFunction className="w-5 h-5 text-blue-500"/>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold truncate">{t('title')}</h2>
                        <p className="text-sm text-muted-foreground truncate">{t('subtitle')}</p>
                    </div>
                </div>

                <div
                    className="p-4 rounded-xl border border-blue-500/20 bg-card grid gap-3 sm:flex sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2 min-w-0">
                        <span className="text-sm font-medium shrink-0">{t('levelLabel')}</span>
                        <CustomDifficultySelect
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            labels={labels}
                            ariaLabel={t('difficultyAria')}
                        />
                    </div>
                    <div className="text-sm text-muted-foreground">{t('timeLabel', { seconds: timeLimit })}</div>
                </div>

                <div className="p-6 rounded-xl border border-blue-500/20 bg-card text-center space-y-6">
                    <div>
                        <h3 className="text-2xl font-bold mb-2">{t('ready.title')}</h3>
                        <p className="text-muted-foreground">{t('ready.subtitle')}</p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-2xl mx-auto text-left">
                        <div className="p-3 rounded-lg bg-muted/50 border border-blue-500/10">
                            <div className="text-xs text-muted-foreground mb-1">{t('cards.easy.title')}</div>
                            <div className="text-sm">{t('cards.easy.desc')}</div>
                            <div className="text-xs text-muted-foreground mt-1">{t('cards.easy.time')}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-blue-500/10">
                            <div className="text-xs text-muted-foreground mb-1">{t('cards.medium.title')}</div>
                            <div className="text-sm">{t('cards.medium.desc')}</div>
                            <div className="text-xs text-muted-foreground mt-1">{t('cards.medium.time')}</div>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50 border border-blue-500/10">
                            <div className="text-xs text-muted-foreground mb-1">{t('cards.hard.title')}</div>
                            <div className="text-sm">{t('cards.hard.desc')}</div>
                            <div className="text-xs text-muted-foreground mt-1">{t('cards.hard.time')}</div>
                        </div>
                    </div>

                    <Button onClick={startGame} size="lg" className="gap-2">
                        {t('start')}
                        <ChevronRight className="w-4 h-4"/>
                    </Button>
                </div>
            </div>
        );
    }

    if (gameOver) {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <SquareFunction className="w-5 h-5 text-blue-500"/>
                    </div>
                    <div className="min-w-0">
                        <h2 className="text-xl font-semibold truncate">{t('title')}</h2>
                        <p className="text-sm text-muted-foreground truncate">{t('subtitle')}</p>
                    </div>
                </div>

                <div
                    className="p-6 rounded-xl border border-blue-500/20 bg-gradient-to-b from-blue-500/5 to-transparent text-center space-y-4">
                    <div className="text-4xl mb-4">⏱️</div>
                    <h3 className="text-xl font-semibold mb-2">{t('over.title')}</h3>

                    <div className="space-y-2">
                        <div className="flex items-center justify-center gap-2">
                            <Trophy className="w-5 h-5 text-blue-500"/>
                            <span className="text-2xl font-bold">{t('over.points', { score })}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                            {t('over.stats', { questions: questionsAnswered, maxStreak })}
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 justify-center pt-4">
                        <CustomDifficultySelect
                            value={difficulty}
                            onChange={handleDifficultyChange}
                            labels={labels}
                            ariaLabel={t('difficultyAria')}
                        />
                        <Button onClick={startGame} className="gap-2">
                            <RotateCcw className="w-4 h-4"/>
                            {t('playAgain')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    if (!currentChallenge) return null;

    const isCorrect = selectedAnswer === currentChallenge.answer;
    const timePercentage = (
                               timer / timeLimit
                           ) * 100;

    const typeLabel =
        currentChallenge.type === 'binary'
            ? t('types.binary')
            : currentChallenge.type === 'hex'
                ? t('types.hex')
                : t('types.arithmetic');

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <SquareFunction className="w-5 h-5 text-blue-500"/>
                </div>
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold truncate">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground truncate">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className="p-4 rounded-xl border border-blue-500/20 bg-card grid gap-3 sm:flex sm:items-center sm:justify-between">
                <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <Clock
                            className={cn(
                                'w-4 h-4 shrink-0',
                                timer <= 10 ? 'text-red-500 animate-pulse' : 'text-blue-500'
                            )}
                        />
                        <span className={cn('font-mono text-base sm:text-lg font-bold tabular-nums', timer <= 10
                                                                                                     && 'text-red-500')}>
                            {timer}s
                        </span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                        <Trophy className="w-4 h-4 text-blue-500 shrink-0"/>
                        <span className="font-mono text-base sm:text-lg tabular-nums">{score}</span>
                    </div>

                    <div className="flex items-center gap-2 min-w-0 justify-end sm:justify-start">
                        <Zap className="w-4 h-4 text-blue-500 shrink-0"/>
                        <span className="font-mono text-base sm:text-lg truncate">{t('streak', { streak })}</span>
                    </div>
                </div>

                <CustomDifficultySelect
                    value={difficulty}
                    onChange={handleDifficultyChange}
                    labels={labels}
                    ariaLabel={t('difficultyAria')}
                    disabled={isSwitching}
                />
            </div>

            <div className="w-full bg-muted/30 rounded-full h-2 overflow-hidden">
                <div
                    className={cn('h-full transition-all duration-300', timer <= 10 ? 'bg-red-500' : 'bg-blue-500')}
                    style={{ width: `${timePercentage}%` }}
                />
            </div>

            <div className="p-6 rounded-xl border border-blue-500/20 bg-card space-y-4">
                <div className="flex items-center justify-between gap-3 min-w-0">
                    <span className="text-xs font-mono text-blue-500 uppercase shrink-0">{typeLabel}</span>
                    <span className="text-sm text-muted-foreground text-right leading-snug">
                        {t('question', { current: questionsAnswered + 1 })}
                    </span>
                </div>

                <div className="text-center py-8">
                    <div
                        className="text-3xl sm:text-4xl font-bold font-mono break-words">{currentChallenge.question}</div>
                    <div className="text-sm text-muted-foreground mt-2">{t('equals')}</div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                    {currentChallenge.options.map((option) => {
                        const isSelected = selectedAnswer === option;
                        const isCorrectOption = option === currentChallenge.answer;

                        let buttonStyle = 'border-blue-500/20 hover:border-blue-500/40 hover:bg-blue-500/5';

                        if (isAnswered) {
                            if (isCorrectOption) {
                                buttonStyle = 'border-green-500/40 bg-green-500/10';
                            } else if (isSelected && !isCorrect) buttonStyle = 'border-red-500/40 bg-red-500/10';
                        } else if (isSelected) {
                            buttonStyle = 'border-blue-500/40 bg-blue-500/10';
                        }

                        return (
                            <button
                                key={option}
                                onClick={() => handleAnswerSelect(option)}
                                disabled={isAnswered}
                                className={cn(
                                    'p-4 rounded-xl border text-center transition-all duration-200',
                                    'text-lg sm:text-xl font-bold font-mono',
                                    'leading-none',
                                    'min-h-[52px] sm:min-h-[56px]',
                                    buttonStyle,
                                    isAnswered && 'cursor-not-allowed'
                                )}
                            >
                                {currentChallenge.type === 'binary' && String(option).length > 4
                                    ? String(option).match(/.{1,4}/g)?.join(' ') || option
                                    : option}
                            </button>
                        );
                    })}
                </div>

                {isAnswered && (
                    <>
                        <div
                            className={cn(
                                'p-4 rounded-xl border',
                                isCorrect ? 'border-green-500/20 bg-green-500/5' : 'border-red-500/20 bg-red-500/5'
                            )}
                        >
                            <div className="flex items-center gap-2 mb-2">
                                {isCorrect ? (
                                    <>
                                        <Check className="w-5 h-5 text-green-500"/>
                                        <span className="font-semibold text-green-500">{t('feedback.correct')}</span>
                                    </>
                                ) : (
                                    <>
                                        <Trophy className="w-5 h-5 text-red-500"/>
                                        <span className="font-semibold text-red-500">{t('feedback.incorrect')}</span>
                                    </>
                                )}
                            </div>
                            <p className="text-sm text-muted-foreground">{currentChallenge.explanation}</p>
                        </div>

                        <Button onClick={handleNext} className="w-full gap-2">
                            {t('next')}
                            <ChevronRight className="w-4 h-4"/>
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}