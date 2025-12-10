'use client';

import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import QuizModal from './QuizModal';
import { getQuizQuestions, QuizLevel } from '@/lib/quiz-data';
import { Play } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

interface QuizCardProps {
    level: QuizLevel;
    title: string;
    description: string;
    questionCount: number;
    onStart: () => void;
}

function QuizCard({ level, title, description, questionCount, onStart }: QuizCardProps) {
    const t = useTranslations('quiz');

    return (
        <div
            className="p-6 sm:p-8 rounded-xl border bg-gradient-to-br from-card via-card/95 to-primary/5 h-full flex flex-col">
            <h3 className="text-xl sm:text-2xl font-semibold mb-4">
                {title}
            </h3>
            <p className="text-muted-foreground mb-6 leading-relaxed flex-1">
                {description}
            </p>
            <div className="flex items-center gap-4 mb-6 text-sm text-muted-foreground">
                <span>{t('info.questions', { count: questionCount })}</span>
                <span>•</span>
                <span>{t('info.timePerQuestion', { seconds: 30 })}</span>
            </div>
            <Button
                onClick={onStart}
                size="lg"
                className="gap-2 w-full sm:w-auto"
            >
                <Play className="w-4 h-4"/>
                {t('startQuiz')}
            </Button>
        </div>
    );
}

export default function Quiz() {
    const t = useTranslations('quiz');
    const rawLocale = useLocale();
    const locale = (rawLocale === 'fr' || rawLocale === 'en') ? rawLocale : 'fr';
    const isMobile = useIsMobile();
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

    if (isMobile) {
        return (
            <>
                <section id="quiz"
                         className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                    <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                        <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 tracking-tight gradient-text">
                            {t('title')}
                        </h2>

                        <Tabs defaultValue="easy" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 mb-8">
                                <TabsTrigger value="easy" className="text-sm sm:text-base text-center">
                                    {t('levels.easy')}
                                </TabsTrigger>
                                <TabsTrigger value="medium" className="text-sm sm:text-base text-center">
                                    {t('levels.medium')}
                                </TabsTrigger>
                                <TabsTrigger value="hard" className="text-sm sm:text-base text-center">
                                    {t('levels.hard')}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="easy" className="mt-6">
                                <QuizCard
                                    level="easy"
                                    title={t('levels.easy')}
                                    description={t('descriptions.easy')}
                                    questionCount={10}
                                    onStart={() => handleStartQuiz('easy')}
                                />
                            </TabsContent>

                            <TabsContent value="medium" className="mt-6">
                                <QuizCard
                                    level="medium"
                                    title={t('levels.medium')}
                                    description={t('descriptions.medium')}
                                    questionCount={25}
                                    onStart={() => handleStartQuiz('medium')}
                                />
                            </TabsContent>

                            <TabsContent value="hard" className="mt-6">
                                <QuizCard
                                    level="hard"
                                    title={t('levels.hard')}
                                    description={t('descriptions.hard')}
                                    questionCount={50}
                                    onStart={() => handleStartQuiz('hard')}
                                />
                            </TabsContent>
                        </Tabs>
                    </div>
                </section>

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

    return (
        <>
            <section id="quiz"
                     className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
                <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 tracking-tight gradient-text">
                        {t('title')}
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {levels.map(({ level, questionCount }) => (
                            <QuizCard
                                key={level}
                                level={level}
                                title={t(`levels.${level}`)}
                                description={t(`descriptions.${level}`)}
                                questionCount={questionCount}
                                onStart={() => handleStartQuiz(level)}
                            />
                        ))}
                    </div>
                </div>
            </section>

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