'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import QuizModal from './QuizModal';
import { getQuizQuestions, QuizLevel } from '@/lib/quiz-data';
import { Clock, HelpCircle, Play, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuizCardProps {
    level: QuizLevel;
    title: string;
    description: string;
    questionCount: number;
    difficulty: 'easy' | 'medium' | 'hard';
    onStart: () => void;
}

function QuizCard({ title, description, questionCount, difficulty, onStart }: QuizCardProps) {
    const t = useTranslations('quiz');

    const difficultyColors = {
        easy: 'text-green-500',
        medium: 'text-yellow-500',
        hard: 'text-red-500'
    };

    return (
        <div
            className="p-6 rounded-xl border border-border bg-card hover:border-foreground/20 transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">{title}</h3>
                <span className={cn('text-sm font-medium', difficultyColors[difficulty])}>
                    {t(`levels.${difficulty}`)}
                </span>
            </div>
            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                {description}
            </p>
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4"/>
                    <span>{questionCount} questions</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4"/>
                    <span>30s / question</span>
                </div>
            </div>
            <Button onClick={onStart} className="w-full gap-2">
                <Play className="w-4 h-4"/>
                {t('startQuiz')}
            </Button>
        </div>
    );
}

export default function Quiz() {
    const t = useTranslations('quiz');
    const rawLocale = useLocale();
    const locale = (
        rawLocale === 'fr' || rawLocale === 'en'
    ) ? rawLocale : 'fr';
    const [selectedLevel, setSelectedLevel] = useState<QuizLevel>('easy');
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleStartQuiz = (level: QuizLevel) => {
        setSelectedLevel(level);
        setIsModalOpen(true);
    };

    const questions = getQuizQuestions(selectedLevel);

    const levels: { level: QuizLevel; questionCount: number }[] = [
        { level: 'easy', questionCount: 10 },
        { level: 'medium', questionCount: 25 },
        { level: 'hard', questionCount: 50 }
    ];

    return (
        <>
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20">
                        <Trophy className="w-5 h-5 text-blue-500"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{t('title')}</h2>
                        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {levels.map(({ level, questionCount }) => (
                        <QuizCard
                            key={level}
                            level={level}
                            title={t(`levels.${level}`)}
                            description={t(`descriptions.${level}`)}
                            questionCount={questionCount}
                            difficulty={level}
                            onStart={() => handleStartQuiz(level)}
                        />
                    ))}
                </div>
            </div>

            <QuizModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                level={selectedLevel}
                questions={questions}
                locale={locale}
            />
        </>
    );
}
