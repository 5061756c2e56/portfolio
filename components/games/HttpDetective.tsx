'use client';

import { useCallback, useId, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { CheckCircle2, Globe, RotateCcw, Sparkles, Trophy, XCircle, Zap } from 'lucide-react';

type ChallengeId =
    | '1' | '2' | '3' | '4' | '5'
    | '6' | '7' | '8' | '9' | '10'
    | '11' | '12' | '13' | '14' | '15'
    | '16' | '17' | '18' | '19' | '20'
    | '21' | '22' | '23' | '24' | '25';

const IDS: ChallengeId[] = [
    '1', '2', '3', '4', '5',
    '6', '7', '8', '9', '10',
    '11', '12', '13', '14', '15',
    '16', '17', '18', '19', '20',
    '21', '22', '23', '24', '25'
];

function hashStringToSeed(s: string) {
    let h = 2166136261;
    for (let i = 0; i < s.length; i++) {
        h ^= s.charCodeAt(i);
        h = Math.imul(h, 16777619);
    }
    return h >>> 0;
}

function mulberry32(seed: number) {
    let t = seed >>> 0;
    return () => {
        t += 0x6d2b79f5;
        let r = Math.imul(t ^ (
            t >>> 15
        ), 1 | t);
        r ^= r + Math.imul(r ^ (
            r >>> 7
        ), 61 | r);
        return (
                   (
                       r ^ (
                             r >>> 14
                         )
                   ) >>> 0
               ) / 4294967296;
    };
}

function seededShuffle<T>(arr: T[], seed: number): T[] {
    const a = [...arr];
    const rnd = mulberry32(seed);
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (
            i + 1
        ));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

type Challenge = {
    id: ChallengeId;
    caseTitle: string;
    request: string;
    options: string[];
    answerIndex: number;
    explanation: string;
};

type Phase = 'idle' | 'locked' | 'complete';

export default function HttpDetective() {
    const t = useTranslations('games.httpdetective');

    const uid = useId();
    const baseSeed = useMemo(() => hashStringToSeed(uid), [uid]);
    const [nonce, setNonce] = useState(0);

    const order = useMemo(() => seededShuffle(IDS, baseSeed + nonce), [baseSeed, nonce]);

    const [idx, setIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [phase, setPhase] = useState<Phase>('idle');
    const [selected, setSelected] = useState<number | null>(null);
    const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
    const [lastExplanation, setLastExplanation] = useState('');

    const challenges = useMemo<Challenge[]>(() => {
        const getText = (key: string) => {
            const v = t.raw(key) as unknown;
            return typeof v === 'string' ? v : String(v);
        };

        return order.map((id) => {
            const options = t.raw(`challenges.${id}.options`) as unknown as string[];
            return {
                id,
                caseTitle: getText(`challenges.${id}.caseTitle`),
                request: getText(`challenges.${id}.request`),
                options,
                answerIndex: Number(getText(`challenges.${id}.answerIndex`)),
                explanation: getText(`challenges.${id}.explanation`)
            };
        });
    }, [order, t]);

    const total = challenges.length;
    const current = challenges[Math.min(idx, total - 1)];
    const progressLabel = t('question', { current: Math.min(idx + 1, total), total });

    const optionOrder = useMemo(() => {
        const len = current.options.length;
        const indices = Array.from({ length: len }, (_, i) => i);
        const seed = (
                         baseSeed + nonce + idx * 101 + hashStringToSeed(current.id)
                     ) >>> 0;
        return seededShuffle(indices, seed);
    }, [baseSeed, nonce, idx, current.id, current.options.length]);

    const lockAnswer = useCallback(
        (originalIndex: number) => {
            if (phase !== 'idle') return;

            setSelected(originalIndex);

            const correct = originalIndex === current.answerIndex;
            setIsCorrect(correct);
            setLastExplanation(current.explanation);
            setPhase('locked');

            if (correct) {
                setScore((s) => s + 1);
                setStreak((s) => {
                    const next = s + 1;
                    setMaxStreak((m) => (
                        next > m ? next : m
                    ));
                    return next;
                });
            } else {
                setStreak(0);
            }
        },
        [current.answerIndex, current.explanation, phase]
    );

    const next = useCallback(() => {
        if (phase === 'complete') return;

        if (idx + 1 >= total) {
            setPhase('complete');
            return;
        }

        setIdx((v) => v + 1);
        setSelected(null);
        setIsCorrect(null);
        setLastExplanation('');
        setPhase('idle');
    }, [idx, phase, total]);

    const restart = useCallback(() => {
        setNonce((n) => n + 1);
        setIdx(0);
        setScore(0);
        setStreak(0);
        setMaxStreak(0);
        setSelected(null);
        setIsCorrect(null);
        setLastExplanation('');
        setPhase('idle');
    }, []);

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                    <Globe className="w-5 h-5 text-blue-500"/>
                </div>
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold truncate">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground truncate">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className="p-4 rounded-xl border border-blue-500/20 bg-card grid gap-3 sm:flex sm:items-center sm:justify-between">
                <div className="grid gap-2 sm:flex sm:items-center sm:gap-4 min-w-0">
                    <div className="inline-flex items-center gap-2 min-w-0">
                        <Sparkles className="w-4 h-4 text-blue-500 shrink-0"/>
                        <span className="font-mono text-sm truncate">{progressLabel}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 min-w-0">
                        <Trophy className="w-4 h-4 text-blue-500 shrink-0"/>
                        <span className="font-mono text-sm truncate">{t('score', { score, total })}</span>
                    </div>
                    <div className="inline-flex items-center gap-2 min-w-0">
                        <Zap className="w-4 h-4 text-blue-500 shrink-0"/>
                        <span className="font-mono text-sm truncate">{t('streak', { streak, max: maxStreak })}</span>
                    </div>
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={restart}
                    className="gap-2 w-full sm:w-auto"
                >
                    <RotateCcw className="w-4 h-4"/>
                    {t('restart')}
                </Button>
            </div>

            {phase === 'complete' ? (
                <div
                    className="p-6 rounded-xl border border-blue-500/20 bg-linear-to-b from-blue-500/5 to-transparent text-center">
                    <div className="text-4xl mb-4">🕵️</div>
                    <h3 className="text-xl font-semibold mb-2">{t('complete.title')}</h3>
                    <p className="text-muted-foreground mb-4">{t('complete.stats', { score, total, maxStreak })}</p>
                    <Button onClick={restart} className="gap-2">
                        <RotateCcw className="w-4 h-4"/>
                        {t('playAgain')}
                    </Button>
                </div>
            ) : (
                <div className="p-5 rounded-xl border border-blue-500/20 bg-card space-y-3">
                    <div className="flex items-start justify-between gap-3 min-w-0">
                        <div className="space-y-0.5 min-w-0">
                            <h3 className="text-base font-semibold">{t('prompt')}</h3>
                            <p className="text-sm text-muted-foreground leading-snug break-words">
                                {current.caseTitle}
                            </p>
                        </div>

                        {phase === 'locked' && isCorrect !== null && (
                            <div
                                className={cn(
                                    'inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm border shrink-0',
                                    isCorrect
                                        ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-600 dark:text-emerald-400 shadow-[0_0_0_1px_rgba(16,185,129,0.35)]'
                                        : 'bg-red-500/20 border-red-500/50 text-red-600 dark:text-red-400 shadow-[0_0_0_1px_rgba(239,68,68,0.35)]'
                                )}
                            >
                                {isCorrect ? <CheckCircle2 className="w-4 h-4"/> : <XCircle className="w-4 h-4"/>}
                                <span className="font-medium">
                                    {isCorrect ? t('feedback.correct') : t('feedback.incorrect')}
                                </span>
                            </div>
                        )}
                    </div>

                    <div className="rounded-xl border border-blue-500/10 bg-muted/40 p-4">
                        <pre className="text-sm font-mono whitespace-pre-wrap break-words leading-relaxed">
                            {current.request}
                        </pre>
                    </div>

                    <div className="grid gap-2">
                        {optionOrder.map((originalIndex) => {
                            const opt = current.options[originalIndex];
                            const locked = phase !== 'idle';
                            const active = selected === originalIndex;
                            const showCorrect = locked && originalIndex === current.answerIndex;
                            const showWrong = locked && active && originalIndex !== current.answerIndex;

                            return (
                                <button
                                    key={`${current.id}-${originalIndex}`}
                                    type="button"
                                    disabled={locked}
                                    onClick={() => lockAnswer(originalIndex)}
                                    className={cn(
                                        'w-full text-left px-3 py-2 rounded-xl border transition-all duration-200',
                                        'text-sm leading-snug break-words',
                                        locked
                                            ? 'cursor-not-allowed opacity-90'
                                            : 'hover:bg-blue-500/5 hover:border-blue-500/30',
                                        active ? 'border-blue-500/40 bg-blue-500/5' : 'border-border bg-transparent',
                                        showCorrect &&
                                        'border-emerald-500/70 bg-emerald-500/15 text-foreground shadow-[0_0_0_1px_rgba(16,185,129,0.25)]',
                                        showWrong &&
                                        'border-red-500/70 bg-red-500/15 text-foreground shadow-[0_0_0_1px_rgba(239,68,68,0.25)]'
                                    )}
                                >
                                    {opt}
                                </button>
                            );
                        })}
                    </div>

                    {phase === 'locked' && lastExplanation && (
                        <div
                            className="mt-2 p-4 rounded-xl border border-blue-500/10 bg-muted/30 text-sm text-muted-foreground leading-relaxed break-words">
                            {lastExplanation}
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-2">
                        <Button onClick={next} disabled={phase !== 'locked'} className="gap-2 w-full sm:w-auto">
                            {t('next')}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}