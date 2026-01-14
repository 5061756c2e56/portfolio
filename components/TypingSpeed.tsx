'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Keyboard, RotateCcw, Play, Clock, Zap, Target } from 'lucide-react';

const CODE_SNIPPETS = {
    fr: [
        'const utilisateur = { nom: "Jean", age: 25 };',
        'function calculerSomme(a, b) { return a + b; }',
        'const nombres = [1, 2, 3, 4, 5].map(n => n * 2);',
        'if (estValide) { executerAction(); }',
        'async function chargerDonnees() { await fetch(url); }',
        'class Voiture { constructor(marque) { this.marque = marque; } }',
        'const filtres = tableau.filter(item => item.actif);',
        'export default function Composant() { return <div>Bonjour</div>; }',
        'const { nom, email } = utilisateur;',
        'setTimeout(() => console.log("Termine"), 1000);'
    ],
    en: [
        'const user = { name: "John", age: 25 };',
        'function calculateSum(a, b) { return a + b; }',
        'const numbers = [1, 2, 3, 4, 5].map(n => n * 2);',
        'if (isValid) { executeAction(); }',
        'async function loadData() { await fetch(url); }',
        'class Car { constructor(brand) { this.brand = brand; } }',
        'const filtered = array.filter(item => item.active);',
        'export default function Component() { return <div>Hello</div>; }',
        'const { name, email } = user;',
        'setTimeout(() => console.log("Done"), 1000);'
    ]
};

const GAME_DURATION = 60;

export default function TypingSpeed() {
    const t = useTranslations('games.typing');
    const rawLocale = useLocale();
    const locale = (rawLocale === 'fr' || rawLocale === 'en') ? rawLocale : 'fr';

    const [currentSnippet, setCurrentSnippet] = useState('');
    const [userInput, setUserInput] = useState('');
    const [gameState, setGameState] = useState<'idle' | 'playing' | 'finished'>('idle');
    const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
    const [correctChars, setCorrectChars] = useState(0);
    const [totalChars, setTotalChars] = useState(0);
    const [completedSnippets, setCompletedSnippets] = useState(0);
    const [errors, setErrors] = useState(0);

    const inputRef = useRef<HTMLInputElement>(null);
    const usedSnippetsRef = useRef<Set<number>>(new Set());

    const getRandomSnippet = useCallback(() => {
        const snippets = CODE_SNIPPETS[locale];
        const availableIndices = snippets
            .map((_, i) => i)
            .filter(i => !usedSnippetsRef.current.has(i));

        if (availableIndices.length === 0) {
            usedSnippetsRef.current.clear();
            return snippets[Math.floor(Math.random() * snippets.length)];
        }

        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
        usedSnippetsRef.current.add(randomIndex);
        return snippets[randomIndex];
    }, [locale]);

    const startGame = useCallback(() => {
        usedSnippetsRef.current.clear();
        setCurrentSnippet(getRandomSnippet());
        setUserInput('');
        setGameState('playing');
        setTimeLeft(GAME_DURATION);
        setCorrectChars(0);
        setTotalChars(0);
        setCompletedSnippets(0);
        setErrors(0);
        setTimeout(() => inputRef.current?.focus(), 100);
    }, [getRandomSnippet]);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (gameState === 'playing' && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        setGameState('finished');
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameState, timeLeft]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (gameState !== 'playing') return;

        const value = e.target.value;
        setUserInput(value);
        setTotalChars(prev => prev + 1);

        const currentIndex = value.length - 1;
        if (currentIndex >= 0 && currentIndex < currentSnippet.length) {
            if (value[currentIndex] === currentSnippet[currentIndex]) {
                setCorrectChars(prev => prev + 1);
            } else {
                setErrors(prev => prev + 1);
            }
        }

        if (value === currentSnippet) {
            setCompletedSnippets(prev => prev + 1);
            setCurrentSnippet(getRandomSnippet());
            setUserInput('');
        }
    };

    const calculateWPM = () => {
        const timeSpent = GAME_DURATION - timeLeft;
        if (timeSpent === 0) return 0;
        const words = correctChars / 5;
        const minutes = timeSpent / 60;
        return Math.round(words / minutes);
    };

    const calculateAccuracy = () => {
        if (totalChars === 0) return 100;
        return Math.round((correctChars / totalChars) * 100);
    };

    const renderSnippet = () => {
        return currentSnippet.split('').map((char, index) => {
            let className = 'text-muted-foreground';
            if (index < userInput.length) {
                className = userInput[index] === char ? 'text-green-500' : 'text-red-500 bg-red-500/20';
            } else if (index === userInput.length) {
                className = 'text-foreground bg-foreground/20';
            }
            return (
                <span key={index} className={className}>
                    {char}
                </span>
            );
        });
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-lg bg-muted">
                    <Keyboard className="w-5 h-5" />
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-border bg-card">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        <span className={cn(
                            'font-mono text-lg',
                            timeLeft <= 10 && gameState === 'playing' && 'text-red-500'
                        )}>
                            {timeLeft}s
                        </span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-lg">{calculateWPM()} WPM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-muted-foreground" />
                        <span className="font-mono text-lg">{calculateAccuracy()}%</span>
                    </div>
                </div>

                {gameState === 'idle' && (
                    <Button onClick={startGame} className="gap-2">
                        <Play className="w-4 h-4" />
                        {t('start')}
                    </Button>
                )}
                {gameState === 'playing' && (
                    <Button variant="outline" onClick={startGame} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        {t('restart')}
                    </Button>
                )}
                {gameState === 'finished' && (
                    <Button onClick={startGame} className="gap-2">
                        <RotateCcw className="w-4 h-4" />
                        {t('playAgain')}
                    </Button>
                )}
            </div>

            {gameState === 'finished' && (
                <div className="p-6 rounded-xl border border-border bg-card text-center">
                    <div className="text-4xl mb-4">⌨️</div>
                    <h3 className="text-xl font-semibold mb-2">{t('results.title')}</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold gradient-text">{calculateWPM()}</div>
                            <div className="text-sm text-muted-foreground">WPM</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{calculateAccuracy()}%</div>
                            <div className="text-sm text-muted-foreground">{t('results.accuracy')}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{completedSnippets}</div>
                            <div className="text-sm text-muted-foreground">{t('results.snippets')}</div>
                        </div>
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold text-red-500">{errors}</div>
                            <div className="text-sm text-muted-foreground">{t('results.errors')}</div>
                        </div>
                    </div>
                </div>
            )}

            <div className="p-6 rounded-xl border border-border bg-card">
                <div className="font-mono text-lg leading-relaxed mb-6 p-4 rounded-lg bg-muted min-h-16">
                    {gameState === 'idle' ? (
                        <span className="text-muted-foreground">{t('pressStart')}</span>
                    ) : (
                        renderSnippet()
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value={userInput}
                    onChange={handleInputChange}
                    disabled={gameState !== 'playing'}
                    placeholder={gameState === 'playing' ? t('typeHere') : ''}
                    className={cn(
                        'w-full h-12 px-4 rounded-lg border bg-transparent font-mono text-base',
                        'focus:outline-none focus:ring-2 focus:ring-foreground/10',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        gameState === 'playing' ? 'border-foreground/20' : 'border-border'
                    )}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                />
            </div>
        </div>
    );
}
