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

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { useTranslations } from 'next-intl';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { QuizLevel, QuizQuestionMeta } from '@/lib/quiz-data';
import { ArrowRight, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface QuizModalProps {
    isOpen: boolean;
    onClose: () => void;
    level: QuizLevel;
    questions: QuizQuestionMeta[];
}

interface AnswerResult {
    questionId: string;
    userAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
    timeSpent: number;
}

const TIME_PER_QUESTION = 30;

export default function QuizModal({ isOpen, onClose, level, questions }: QuizModalProps) {
    const t = useTranslations('quiz.modal');
    const tq = useTranslations('quiz.questions');

    interface QuizState {
        currentQuestionIndex: number;
        selectedAnswer: number | null;
        timeLeft: number;
        answers: AnswerResult[];
        showResults: boolean;
    }

    type QuizAction =
        | { type: 'reset' }
        | { type: 'selectAnswer'; index: number }
        | { type: 'tick' }
        | { type: 'nextQuestion'; answer: AnswerResult; isLast: boolean }
        | { type: 'showResults' }
        | { type: 'startQuestion' };

    const [quizState, quizDispatch] = useReducer(
        (state: QuizState, action: QuizAction): QuizState => {
            switch (action.type) {
                case 'reset':
                    return {
                        currentQuestionIndex: 0,
                        selectedAnswer: null,
                        timeLeft: TIME_PER_QUESTION,
                        answers: [],
                        showResults: false
                    };
                case 'selectAnswer':
                    return { ...state, selectedAnswer: action.index };
                case 'tick':
                    return { ...state, timeLeft: Math.max(0, state.timeLeft - 1) };
                case 'nextQuestion':
                    if (action.isLast) {
                        return {
                            ...state,
                            answers: [...state.answers, action.answer],
                            showResults: true
                        };
                    }
                    return {
                        ...state,
                        answers: [...state.answers, action.answer],
                        currentQuestionIndex: state.currentQuestionIndex + 1,
                        selectedAnswer: null,
                        timeLeft: TIME_PER_QUESTION
                    };
                case 'showResults':
                    return { ...state, showResults: true };
                case 'startQuestion':
                    return { ...state, timeLeft: TIME_PER_QUESTION, selectedAnswer: null };
            }
        },
        {
            currentQuestionIndex: 0,
            selectedAnswer: null,
            timeLeft: TIME_PER_QUESTION,
            answers: [],
            showResults: false
        }
    );

    const { currentQuestionIndex, selectedAnswer, timeLeft, answers, showResults } = quizState;

    const selectedAnswerRef = useRef<number | null>(null);
    const questionStartTimeRef = useRef<number>(0);

    const hasQuestions = Array.isArray(questions) && questions.length > 0;
    const currentQuestion = hasQuestions ? questions[currentQuestionIndex] : null;
    const isLastQuestion = hasQuestions ? currentQuestionIndex === questions.length - 1 : false;
    const isTrueFalse = currentQuestion?.type === 'true-false';

    useEffect(() => {
        if (!isOpen) {
            quizDispatch({ type: 'reset' });
            selectedAnswerRef.current = null;
            questionStartTimeRef.current = 0;
        }
    }, [isOpen]);

    const handleAnswerSelect = (answerIndex: number) => {
        quizDispatch({ type: 'selectAnswer', index: answerIndex });
        selectedAnswerRef.current = answerIndex;
    };

    const handleNextQuestion = useCallback(
        (timeout = false) => {
            if (!hasQuestions) return;

            const currentQ = questions[currentQuestionIndex];
            if (!currentQ) {
                quizDispatch({ type: 'showResults' });
                return;
            }

            const timeSpent = timeout
                ? TIME_PER_QUESTION
                : Math.floor((
                                 Date.now() - questionStartTimeRef.current
                             ) / 1000);

            const userAnswer = timeout ? -1 : (
                selectedAnswerRef.current ?? -1
            );
            const isCorrect = userAnswer !== -1 && userAnswer === currentQ.correctAnswer;

            const answerResult: AnswerResult = {
                questionId: currentQ.id,
                userAnswer,
                correctAnswer: currentQ.correctAnswer,
                isCorrect,
                timeSpent
            };

            selectedAnswerRef.current = null;
            questionStartTimeRef.current = Date.now();

            quizDispatch({
                type: 'nextQuestion',
                answer: answerResult,
                isLast: currentQuestionIndex === questions.length - 1
            });
        },
        [currentQuestionIndex, hasQuestions, questions]
    );

    useEffect(() => {
        if (!isOpen || showResults || !currentQuestion) return;

        selectedAnswerRef.current = null;
        questionStartTimeRef.current = Date.now();
        quizDispatch({ type: 'startQuestion' });

        const timer = window.setInterval(() => {
            quizDispatch({ type: 'tick' });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [currentQuestionIndex, isOpen, showResults, currentQuestion]);

    useEffect(() => {
        if (timeLeft <= 0 && !showResults && isOpen && currentQuestion) {
            handleNextQuestion(true);
        }
    }, [timeLeft, showResults, isOpen, currentQuestion, handleNextQuestion]);

    const handleClose = () => {
        quizDispatch({ type: 'reset' });
        selectedAnswerRef.current = null;
        questionStartTimeRef.current = 0;
        onClose();
    };

    const getQuestionText = (question: QuizQuestionMeta) => {
        return tq(`${question.id}.question`);
    };

    const getOptions = (question: QuizQuestionMeta): string[] => {
        if (!question.optionCount) return [];
        const rawOptions: string[] = [];
        for (let i = 0; i < question.optionCount; i++) {
            rawOptions.push(tq(`${question.id}.options.${i}`));
        }
        if (question._shuffledIndices) {
            return question._shuffledIndices.map(i => rawOptions[i]);
        }
        return rawOptions;
    };

    const getExplanation = (question: QuizQuestionMeta) => {
        try {
            return tq(`${question.id}.explanation`);
        } catch {
            return null;
        }
    };

    if (!hasQuestions) return null;

    const correctCount = answers.filter(a => a.isCorrect).length;
    const totalQuestions = questions.length;
    const percentage = Math.round((
                                      correctCount / totalQuestions
                                  ) * 100);

    if (showResults) {
        return (
            <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
                <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto" data-level={String(level)}>
                    <DialogHeader>
                        <DialogTitle className="text-2xl">{t('results.title')}</DialogTitle>
                        <DialogDescription>{t('results.description')}</DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 mt-4">
                        <div className="text-center p-6 rounded-xl border border-border bg-card">
                            <div className="text-5xl font-bold mb-2 gradient-text">
                                {correctCount} / {totalQuestions}
                            </div>
                            <div className="text-xl text-muted-foreground mb-4">
                                {percentage}% {t('results.correct')}
                            </div>
                            <div className="text-lg">
                                {percentage >= 80 && <span className="text-green-500">{t('results.excellent')}</span>}
                                {percentage >= 60 && percentage < 80 && (
                                    <span className="text-blue-500">{t('results.good')}</span>
                                )}
                                {percentage >= 40 && percentage < 60 && (
                                    <span className="text-yellow-500">{t('results.average')}</span>
                                )}
                                {percentage < 40 && (
                                    <span className="text-red-500">{t('results.needsImprovement')}</span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold">{t('results.details')}</h3>
                            <div className="space-y-3">
                                {questions.map((question, index) => {
                                    const answer = answers[index];
                                    const isCorrect = answer?.isCorrect ?? false;
                                    const options = getOptions(question);
                                    const explanation = getExplanation(question);
                                    const isQuestionTrueFalse = question.type === 'true-false';

                                    return (
                                        <div
                                            key={question.id}
                                            className={cn(
                                                'p-4 rounded-xl border',
                                                isCorrect
                                                    ? 'bg-green-500/10 border-green-500/30'
                                                    : 'bg-red-500/10 border-red-500/30'
                                            )}
                                        >
                                            <div className="flex items-start gap-3 mb-2">
                                                {isCorrect ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0"/>
                                                ) : (
                                                    <XCircle className="w-5 h-5 text-red-500 mt-0.5 shrink-0"/>
                                                )}
                                                <div className="flex-1">
                                                    <div className="font-semibold mb-1">
                                                        {t('results.question')} {index + 1}: {getQuestionText(question)}
                                                    </div>

                                                    {isCorrect ? (
                                                        <div className="text-sm">
                                                            <span
                                                                className="font-medium">{t('results.yourAnswer')} : </span>
                                                            <span className="text-green-500">
                                                                {isQuestionTrueFalse
                                                                    ? (
                                                                        answer?.userAnswer === 0
                                                                            ? t('results.true')
                                                                            : t('results.false')
                                                                    )
                                                                    : (
                                                                        options[answer?.userAnswer ?? -1] ??
                                                                        t('results.noAnswer')
                                                                    )}
                                                            </span>
                                                        </div>
                                                    ) : (
                                                        <div className="text-sm space-y-1">
                                                            <div>
                                                                <span
                                                                    className="font-medium">{t('results.yourAnswer')} : </span>
                                                                <span className="text-red-500">
                                                                    {answer?.userAnswer === -1
                                                                        ? t('results.timeout')
                                                                        : isQuestionTrueFalse
                                                                            ? (
                                                                                answer?.userAnswer === 0
                                                                                    ? t('results.true')
                                                                                    : t('results.false')
                                                                            )
                                                                            : (
                                                                                options[answer?.userAnswer ?? -1] ??
                                                                                t('results.noAnswer')
                                                                            )}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <span className="font-medium">
                                                                    {t('results.correctAnswer')} :{' '}
                                                                </span>
                                                                <span className="text-green-500">
                                                                    {isQuestionTrueFalse
                                                                        ? (
                                                                            question.correctAnswer === 0
                                                                                ? t('results.true')
                                                                                : t('results.false')
                                                                        )
                                                                        : options[question.correctAnswer]}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {explanation && (
                                                        <div className="mt-2 text-sm text-muted-foreground italic">
                                                            {explanation}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button variant="outline" onClick={handleClose}>
                                {t('results.close')}
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        );
    }

    const progress = (
                         (
                             currentQuestionIndex + 1
                         ) / questions.length
                     ) * 100;
    const timeProgress = (
                             timeLeft / TIME_PER_QUESTION
                         ) * 100;

    return (
        <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto" data-level={String(level)}>
                <DialogHeader>
                    <DialogTitle className="text-xl">{t('title')}</DialogTitle>
                    <DialogDescription>
                        {t('question')} {currentQuestionIndex + 1} / {questions.length}
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 mt-4">
                    <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                            <span>{t('progress')}</span>
                            <span>
                                {currentQuestionIndex + 1} / {questions.length}
                            </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-foreground transition-all duration-300"
                                 style={{ width: `${progress}%` }}/>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-sm">
                            <div className="flex items-center gap-2">
                                <Clock className="w-4 h-4"/>
                                <span>{t('timeLeft')}</span>
                            </div>
                            <span
                                className={cn(
                                    'font-semibold',
                                    timeLeft <= 5 ? 'text-red-500' : timeLeft <= 10 ? 'text-yellow-500' : ''
                                )}
                            >
                                {timeLeft}s
                            </span>
                        </div>
                        <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                            <div
                                className={cn(
                                    'h-full transition-all duration-1000',
                                    timeLeft <= 5 ? 'bg-red-500' : timeLeft <= 10 ? 'bg-yellow-500' : 'bg-foreground'
                                )}
                                style={{ width: `${timeProgress}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-6 rounded-xl border border-border bg-card">
                        <h3 className="text-lg font-semibold mb-4">{currentQuestion ? getQuestionText(currentQuestion) : ''}</h3>

                        <div className="space-y-3">
                            {isTrueFalse ? (
                                <>
                                    <button
                                        onClick={() => handleAnswerSelect(0)}
                                        className={cn(
                                            'w-full p-4 rounded-lg border text-left transition-all duration-200',
                                            selectedAnswer === 0
                                                ? 'border-foreground bg-foreground/10'
                                                : 'border-border hover:border-foreground/30 hover:bg-accent'
                                        )}
                                    >
                                        <div className="font-medium">{t('true')}</div>
                                    </button>
                                    <button
                                        onClick={() => handleAnswerSelect(1)}
                                        className={cn(
                                            'w-full p-4 rounded-lg border text-left transition-all duration-200',
                                            selectedAnswer === 1
                                                ? 'border-foreground bg-foreground/10'
                                                : 'border-border hover:border-foreground/30 hover:bg-accent'
                                        )}
                                    >
                                        <div className="font-medium">{t('false')}</div>
                                    </button>
                                </>
                            ) : (
                                (
                                    currentQuestion ? getOptions(currentQuestion) : []
                                ).map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleAnswerSelect(index)}
                                        className={cn(
                                            'w-full p-4 rounded-lg border text-left transition-all duration-200',
                                            selectedAnswer === index
                                                ? 'border-foreground bg-foreground/10'
                                                : 'border-border hover:border-foreground/30 hover:bg-accent'
                                        )}
                                    >
                                        <div className="font-medium">{option}</div>
                                    </button>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={handleClose}>
                            {t('cancel')}
                        </Button>
                        <Button
                            onClick={() => handleNextQuestion(false)}
                            disabled={selectedAnswer === null}
                            className="gap-2"
                        >
                            {isLastQuestion ? t('finish') : t('next')}
                            {!isLastQuestion && <ArrowRight className="w-4 h-4"/>}
                        </Button>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
