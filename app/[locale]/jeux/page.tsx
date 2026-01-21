'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import GamesNavigation from '@/components/games/GamesNavigation';
import Footer from '@/components/home/Footer';
import Quiz from '@/components/games/Quiz';
import MemoryGame from '@/components/games/MemoryGame';
import TypingSpeed from '@/components/games/TypingSpeed';
import { Brain, Gamepad2, Keyboard, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';

type GameType = 'quiz' | 'memory' | 'typing';

interface GameCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    isActive: boolean;
    onClick: () => void;
}

function GameCard({ title, description, icon, isActive, onClick }: GameCardProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'p-6 rounded-xl border text-left transition-all duration-200 w-full',
                isActive
                    ? 'border-foreground/30 bg-card'
                    : 'border-border bg-transparent hover:border-foreground/20 hover:bg-card/50'
            )}
        >
            <div className="flex items-start gap-4">
                <div className={cn(
                    'p-3 rounded-lg transition-colors duration-200',
                    isActive ? 'bg-foreground text-background' : 'bg-muted text-foreground'
                )}>
                    {icon}
                </div>
                <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </button>
    );
}

export default function GamesPage() {
    const t = useTranslations('games');
    const [activeGame, setActiveGame] = useState<GameType>('quiz');

    const games = [
        {
            id: 'quiz' as GameType,
            title: t('gameTypes.quiz.title'),
            description: t('gameTypes.quiz.description'),
            icon: <Brain className="w-5 h-5"/>
        },
        {
            id: 'memory' as GameType,
            title: t('gameTypes.memory.title'),
            description: t('gameTypes.memory.description'),
            icon: <Gamepad2 className="w-5 h-5"/>
        },
        {
            id: 'typing' as GameType,
            title: t('gameTypes.typing.title'),
            description: t('gameTypes.typing.description'),
            icon: <Keyboard className="w-5 h-5"/>
        }
    ];

    return (
        <>
            <GamesNavigation/>
            <main className="min-h-screen text-foreground">
                <section className="min-h-[50vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-24 pb-12">
                    <div className="max-w-5xl mx-auto text-center w-full">
                        <div
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card/50 text-sm text-muted-foreground mb-8">
                            <Sparkles className="w-4 h-4"/>
                            {t('hero.badge')}
                        </div>
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight tracking-tight">
                            <span className="gradient-text">{t('hero.title')}</span>
                        </h1>
                        <p className="text-base sm:text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </div>
                </section>

                <section className="py-12 px-4 sm:px-6 lg:px-8">
                    <div className="max-w-6xl mx-auto">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
                            {games.map((game) => (
                                <GameCard
                                    key={game.id}
                                    title={game.title}
                                    description={game.description}
                                    icon={game.icon}
                                    isActive={activeGame === game.id}
                                    onClick={() => setActiveGame(game.id)}
                                />
                            ))}
                        </div>

                        <div className="min-h-100">
                            {activeGame === 'quiz' && <Quiz/>}
                            {activeGame === 'memory' && <MemoryGame/>}
                            {activeGame === 'typing' && <TypingSpeed/>}
                        </div>
                    </div>
                </section>

                <Footer/>
            </main>
        </>
    );
}
