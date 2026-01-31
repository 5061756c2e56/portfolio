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

import { easyQuestions } from './questions/questions-easy';
import { mediumQuestions } from './questions/questions-medium';
import { hardQuestions } from './questions/questions-hard';

export type QuizLevel = 'easy' | 'medium' | 'hard';
export type QuestionType = 'qcm' | 'true-false';

export interface QuizQuestion {
    id: string;
    type: QuestionType;
    question: {
        fr: string;
        en: string;
    };
    options?: {
        fr: string[];
        en: string[];
    };
    correctAnswer: number;
    explanation?: {
        fr: string;
        en: string;
    };
}

export interface QuizData {
    level: QuizLevel;
    questions: QuizQuestion[];
}

function shuffleArray<T>(array: T[]): T[] {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (
            i + 1
        ));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

function selectRandomQuestions(questions: QuizQuestion[], count: number): QuizQuestion[] {
    if (questions.length <= count) {
        return [...questions];
    }
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, count);
}

function shuffleAnswers(question: QuizQuestion): QuizQuestion {
    if (question.type === 'true-false' || !question.options) {
        return { ...question };
    }

    const optionsCount = question.options.fr.length;
    const indices = Array.from({ length: optionsCount }, (_, i) => i);
    const shuffledIndices = shuffleArray(indices);

    const originalCorrectIndex = question.correctAnswer;
    const newCorrectIndex = shuffledIndices.indexOf(originalCorrectIndex);

    const shuffledOptions = {
        fr: shuffledIndices.map(i => question.options!.fr[i]),
        en: shuffledIndices.map(i => question.options!.en[i])
    };

    return {
        ...question,
        options: shuffledOptions,
        correctAnswer: newCorrectIndex
    };
}

const QUESTION_COUNTS: Record<QuizLevel, number> = {
    easy: 10,
    medium: 25,
    hard: 50
};

const allQuestions: Record<QuizLevel, QuizQuestion[]> = {
    easy: easyQuestions,
    medium: mediumQuestions,
    hard: hardQuestions
};

export const quizData: Record<QuizLevel, QuizData> = {
    easy: {
        level: 'easy',
        questions: easyQuestions
    },
    medium: {
        level: 'medium',
        questions: mediumQuestions
    },
    hard: {
        level: 'hard',
        questions: hardQuestions
    }
};

export function getQuizQuestions(level: QuizLevel): QuizQuestion[] {
    const pool = allQuestions[level];
    const count = QUESTION_COUNTS[level];
    const selected = selectRandomQuestions(pool, count);
    return selected.map(question => shuffleAnswers(question));
}

export function getQuestionCount(level: QuizLevel): number {
    return QUESTION_COUNTS[level];
}