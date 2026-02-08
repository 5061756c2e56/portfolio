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

export interface QuizQuestionMeta {
    id: string;
    type: QuestionType;
    correctAnswer: number;
    optionCount?: number;
    _shuffledIndices?: number[];
}

export interface QuizData {
    level: QuizLevel;
    questions: QuizQuestionMeta[];
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

function selectRandomQuestions(questions: QuizQuestionMeta[], count: number): QuizQuestionMeta[] {
    if (questions.length <= count) {
        return [...questions];
    }
    const shuffled = shuffleArray(questions);
    return shuffled.slice(0, count);
}

function shuffleAnswers(question: QuizQuestionMeta): QuizQuestionMeta {
    const optionsCount = question.type === 'true-false' ? 2 : question.optionCount;
    if (!optionsCount) {
        return { ...question };
    }
    const indices = Array.from({ length: optionsCount }, (_, i) => i);
    const shuffledIndices = shuffleArray(indices);

    const originalCorrectIndex = question.correctAnswer;
    const newCorrectIndex = shuffledIndices.indexOf(originalCorrectIndex);

    return {
        ...question,
        correctAnswer: newCorrectIndex,
        _shuffledIndices: shuffledIndices
    };
}

const QUESTION_COUNTS: Record<QuizLevel, number> = {
    easy: 10,
    medium: 25,
    hard: 50
};

const allQuestions: Record<QuizLevel, QuizQuestionMeta[]> = {
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

export function getQuizQuestions(level: QuizLevel): QuizQuestionMeta[] {
    const pool = allQuestions[level];
    const count = QUESTION_COUNTS[level];
    const selected = selectRandomQuestions(pool, count);
    return selected.map(question => shuffleAnswers(question));
}

export function getQuestionCount(level: QuizLevel): number {
    return QUESTION_COUNTS[level];
}
