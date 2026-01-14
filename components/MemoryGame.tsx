'use client';

import { useCallback, useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Gamepad2, RotateCcw, Trophy, Clock, Zap } from 'lucide-react';

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

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

export default function MemoryGame() {
    const t = useTranslations('games.memory');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [cards, setCards] = useState<Card[]>([]);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [moves, setMoves] = useState(0);
    const [matches, setMatches] = useState(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [gameComplete, setGameComplete] = useState(false);
    const [timer, setTimer] = useState(0);
    const [isProcessing, setIsProcessing] = useState(false);

    const initializeGame = useCallback((diff: Difficulty) => {
        const { pairs } = GRID_CONFIG[diff];
        const selectedEmojis = shuffleArray(TECH_EMOJIS).slice(0, pairs);
        const cardPairs = [...selectedEmojis, ...selectedEmojis];
        const shuffledCards = shuffleArray(cardPairs).map((emoji, index) => ({
            id: index,
            emoji,
            isFlipped: false,
            isMatched: false
        }));

        setCards(shuffledCards);
        setFlippedCards([]);
        setMoves(0);
        setMatches(0);
        setGameStarted(false);
        setGameComplete(false);
        setTimer(0);
        setIsProcessing(false);
    }, []);

    useEffect(() => {
        initializeGame(difficulty);
    }, [difficulty, initializeGame]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameStarted && !gameComplete) {
            interval = setInterval(() => {
                setTimer(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameStarted, gameComplete]);

    useEffect(() => {
        const { pairs } = GRID_CONFIG[difficulty];
        if (matches === pairs && gameStarted) {
            setGameComplete(true);
        }
    }, [matches, difficulty, gameStarted]);

    const handleCardClick = (cardId: number) => {
        if (isProcessing) return;

        const card = cards.find(c => c.id === cardId);
        if (!card || card.isFlipped || card.isMatched) return;
        if (flippedCards.length >= 2) return;

        if (!gameStarted) {
            setGameStarted(true);
        }

        const newFlippedCards = [...flippedCards, cardId];
        setFlippedCards(newFlippedCards);
        setCards(prev => prev.map(c =>
            c.id === cardId ? { ...c, isFlipped: true } : c
        ));

        if (newFlippedCards.length === 2) {
            setMoves(prev => prev + 1);
            setIsProcessing(true);

            const [firstId, secondId] = newFlippedCards;

            setCards(prev => {
                const firstCard = prev.find(c => c.id === firstId);
                const secondCard = prev.find(c => c.id === secondId);

                if (firstCard && secondCard && firstCard.emoji === secondCard.emoji) {
                    setTimeout(() => {
                        setCards(p => p.map(c =>
                            c.id === firstId || c.id === secondId
                                ? { ...c, isMatched: true }
                                : c
                        ));
                        setMatches(m => m + 1);
                        setFlippedCards([]);
                        setIsProcessing(false);
                    }, 500);
                } else {
                    setTimeout(() => {
                        setCards(p => p.map(c =>
                            c.id === firstId || c.id === secondId
                                ? { ...c, isFlipped: false }
                                : c
                        ));
                        setFlippedCards([]);
                        setIsProcessing(false);
                    }, 1000);
                }

                return prev;
            });
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const { pairs, cols } = GRID_CONFIG[difficulty];

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-lg bg-muted">
                    <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-lg">{formatTime(timer)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-lg">{moves}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-lg">{matches}/{pairs}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <select
                        value={difficulty}
                        onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                        className="h-10 px-3 rounded-lg border border-border bg-transparent text-sm focus:outline-none focus:ring-2 focus:ring-foreground/10"
                    >
                        <option value="easy">{t('levels.easy')}</option>
                        <option value="medium">{t('levels.medium')}</option>
                        <option value="hard">{t('levels.hard')}</option>
                    </select>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => initializeGame(difficulty)}
                        className="gap-2"
                    >
                        <RotateCcw className="w-4 h-4" />
                        {t('restart')}
                    </Button>
                </div>
            </div>

            {gameComplete && (
                <div className="p-6 rounded-xl border border-border bg-card text-center">
                    <div className="text-4xl mb-4">🎉</div>
                    <h3 className="text-xl font-semibold mb-2">{t('complete.title')}</h3>
                    <p className="text-muted-foreground mb-4">
                        {t('complete.stats', { moves, time: formatTime(timer) })}
                    </p>
                    <Button onClick={() => initializeGame(difficulty)} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        {t('playAgain')}
                    </Button>
                </div>
            )}

            <div className={cn('grid gap-3 max-w-2xl mx-auto', cols)}>
                {cards.map((card) => (
                    <button
                        key={card.id}
                        onClick={() => handleCardClick(card.id)}
                        disabled={card.isMatched || isProcessing}
                        className={cn(
                            'aspect-square rounded-xl border text-3xl sm:text-4xl transition-all duration-300 transform',
                            card.isFlipped || card.isMatched
                                ? 'bg-card border-foreground/20 rotate-0'
                                : 'bg-muted border-border hover:border-foreground/20 hover:bg-muted/80',
                            card.isMatched && 'opacity-60',
                            !card.isFlipped && !card.isMatched && 'hover:scale-105'
                        )}
                    >
                        <span className={cn(
                            'transition-opacity duration-200',
                            card.isFlipped || card.isMatched ? 'opacity-100' : 'opacity-0'
                        )}>
                            {card.emoji}
                        </span>
                    </button>
                ))}
            </div>
        </div>
    );
}
