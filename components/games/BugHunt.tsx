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

import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Bug, Check, ChevronRight, Clock, RotateCcw, Trophy, X, Zap } from 'lucide-react';

interface BugChallenge {
    id: number;
    code: string;
    language: string;
    correctAnswer: number;
}

const BUG_CHALLENGES: BugChallenge[] = [
    {
        id: 1,
        code: `function sum(a, b) {
  return a + b;
}
console.log(sum(5, "10"));`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 2,
        code: `const users = ['Alice', 'Bob'];
for (let i = 0; i <= users.length; i++) {
  console.log(users[i]);
}`,
        language: 'JavaScript',
        correctAnswer: 1
    },
    {
        id: 3,
        code: `def calculate_average(numbers):
    total = 0
    for num in numbers:
        total += num
    return total / len(numbers)`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 4,
        code: `SELECT *
               FROM users
               WHERE status = 'active'
               ORDER BY created_at
               LIMIT 10;`,
        language: 'SQL',
        correctAnswer: 2
    },
    {
        id: 5,
        code: `int x = 5;
if (x = 10) {
    printf("x est 10");
}`,
        language: 'C',
        correctAnswer: 0
    },
    {
        id: 6,
        code: `async function fetchData() {
  const response = fetch('/api/data');
  return response.json();
}`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 7,
        code: `class User:
    def __init__(self, name):
        name = name
    
user = User("Alice")
print(user.name)`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 8,
        code: `const nums = [1, 2, 3, 4, 5];
const doubled = nums.map(n => n * 2);
nums.push(6);
console.log(doubled.length);`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 9,
        code: `try:
    result = 10 / 0
except:
    print("Erreur")`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 10,
        code: `public class Main {
    public static void main(String[] args) {
        String s1 = new String("Hello");
        String s2 = new String("Hello");
        System.out.println(s1 == s2);
    }
}`,
        language: 'Java',
        correctAnswer: 0
    },
    {
        id: 11,
        code: `let count = 0;
function increment() {
    count++;
}
setInterval(increment, 1000);`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 12,
        code: `def process_list(items=[]):
    items.append("new")
    return items

list1 = process_list()
list2 = process_list()`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 13,
        code: `const obj = {
    name: 'Test',
    getName: function() {
        return this.name;
    }
};
const fn = obj.getName;
console.log(fn());`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 14,
        code: `#include <stdio.h>
int main() {
    int arr[3];
    for(int i = 0; i <= 3; i++) {
        arr[i] = i * 2;
    }
}`,
        language: 'C',
        correctAnswer: 0
    },
    {
        id: 15,
        code: `SELECT user_id, COUNT(*)
               FROM orders
               WHERE total > 100;`,
        language: 'SQL',
        correctAnswer: 0
    },
    {
        id: 16,
        code: `const data = await fetch('/api')
    .then(res => res.json())
    .catch(err => console.error(err));`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 17,
        code: `class Animal {
    constructor(name) {
        this.name = name;
    }
}

const dog = Animal("Rex");`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 18,
        code: `import time

def slow_function():
    time.sleep(5)
    return "Done"

# Dans une API web
result = slow_function()`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 19,
        code: `const matrix = [[1,2], [3,4]];
matrix.forEach(row => {
    row.forEach(cell => {
        cell = cell * 2;
    });
});`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 20,
        code: `public void updateUser(User user) {
    if (user != null)
        user.setName("New");
        user.setEmail("new@email.com");
}`,
        language: 'Java',
        correctAnswer: 0
    },
    {
        id: 21,
        code: `const promise1 = Promise.resolve(1);
const promise2 = Promise.resolve(2);
const result = promise1 + promise2;
console.log(result);`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 22,
        code: `def merge_dicts(d1, d2):
    for key in d2:
        d1[key] = d2[key]
    return d1

dict1 = {'a': 1}
dict2 = {'b': 2}
result = merge_dicts(dict1, dict2)`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 23,
        code: `<script>
    const input = userInput;
    document.write(input);
</script>`,
        language: 'JavaScript/HTML',
        correctAnswer: 0
    },
    {
        id: 24,
        code: `float calculate(int a, int b) {
    return a / b;
}
result = calculate(5, 2);`,
        language: 'C',
        correctAnswer: 2
    },
    {
        id: 25,
        code: `UPDATE users
               SET status = 'inactive'
               WHERE last_login < '2023-01-01'`,
        language: 'SQL',
        correctAnswer: 0
    },
    {
        id: 26,
        code: `const numbers = [1, 2, 3];
numbers.map(n => {
    n * 2
});`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 27,
        code: `def read_file(filename):
    file = open(filename)
    content = file.read()
    return content`,
        language: 'Python',
        correctAnswer: 3
    },
    {
        id: 28,
        code: `let x = "5";
let y = 2;
console.log(x - y);`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 29,
        code: `class Singleton {
    private static instance;
    
    static getInstance() {
        if (!instance) {
            instance = new Singleton();
        }
        return instance;
    }
}`,
        language: 'JavaScript',
        correctAnswer: 1
    },
    {
        id: 30,
        code: `SELECT DISTINCT user_id
               FROM orders
               GROUP BY user_id;`,
        language: 'SQL',
        correctAnswer: 0
    },
    {
        id: 31,
        code: `const arr = [1, 2, 3];
arr.length = 0;
console.log(arr);`,
        language: 'JavaScript',
        correctAnswer: 0
    },
    {
        id: 32,
        code: `import json

data = "{'name': 'Alice'}"
obj = json.loads(data)`,
        language: 'Python',
        correctAnswer: 0
    },
    {
        id: 33,
        code: `for (var i = 0; i < 3; i++) {
    setTimeout(() => {
        console.log(i);
    }, 1000);
}`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 34,
        code: `const config = {
    port: process.env.PORT || 3000,
    debug: process.env.DEBUG || false
};`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 35,
        code: `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

result = fibonacci(50)`,
        language: 'Python',
        correctAnswer: 3
    },
    {
        id: 36,
        code: `char str[5] = "Hello";
printf("%s", str);`,
        language: 'C',
        correctAnswer: 3
    },
    {
        id: 37,
        code: `const users = await db.query(
    "SELECT * FROM users WHERE id = " + userId
);`,
        language: 'JavaScript/SQL',
        correctAnswer: 3
    },
    {
        id: 38,
        code: `def process_data(data=None):
    if not data:
        data = []
    data.append("item")
    return data`,
        language: 'Python',
        correctAnswer: 3
    },
    {
        id: 39,
        code: `const obj1 = { a: 1, b: 2 };
const obj2 = obj1;
obj2.a = 99;
console.log(obj1.a);`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 40,
        code: `class Base:
    def __init__(self):
        print("Base")

class Derived(Base):
    def __init__(self):
        print("Derived")`,
        language: 'Python',
        correctAnswer: 3
    },
    {
        id: 41,
        code: `int* createArray() {
    int arr[10];
    return arr;
}`,
        language: 'C',
        correctAnswer: 3
    },
    {
        id: 42,
        code: `const wait = (ms) => {
    setTimeout(() => {}, ms);
};

async function main() {
    wait(1000);
    console.log("Done");
}`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 43,
        code: `SELECT user_id, MAX(created_at)
               FROM orders
               WHERE MAX(created_at) > '2024-01-01';`,
        language: 'SQL',
        correctAnswer: 3
    },
    {
        id: 44,
        code: `const EventEmitter = require('events');
const emitter = new EventEmitter();

emitter.on('event', () => {
    emitter.emit('event');
});

emitter.emit('event');`,
        language: 'JavaScript/Node.js',
        correctAnswer: 3
    },
    {
        id: 45,
        code: `def decorator(func):
    def wrapper():
        print("Before")
        func()
        print("After")
    return wrapper

@decorator
def greet(name):
    print(f"Hello {name}")`,
        language: 'Python',
        correctAnswer: 3
    },
    {
        id: 46,
        code: `public class Counter {
    private int count = 0;
    
    public void increment() {
        count++;
    }
}
// Utilisé par plusieurs threads`,
        language: 'Java',
        correctAnswer: 3
    },
    {
        id: 47,
        code: `const cache = {};

function getCachedData(key) {
    if (cache[key]) {
        return cache[key];
    }
    const data = expensiveOperation();
    cache[key] = data;
    return data;
}`,
        language: 'JavaScript',
        correctAnswer: 3
    },
    {
        id: 48,
        code: `import re

password = input("Mot de passe: ")
if re.match(r"^[A-Za-z0-9]+$", password):
    print("Valide")`,
        language: 'Python',
        correctAnswer: 3
    },
    {
        id: 49,
        code: `const express = require('express');
const app = express();

app.get('/user/:id', (req, res) => {
    const userId = req.params.id;
    eval('const user = getUser(' + userId + ')');
    res.json(user);
});`,
        language: 'JavaScript/Express',
        correctAnswer: 3
    },
    {
        id: 50,
        code: `<form method="GET" action="/login">
    <input name="password" type="password">
    <button>Login</button>
</form>`,
        language: 'HTML',
        correctAnswer: 3
    }
];

function randInt(maxExclusive: number) {
    if (maxExclusive <= 0) return 0;
    if (typeof crypto !== 'undefined' && 'getRandomValues' in crypto) {
        const arr = new Uint32Array(1);
        const maxUint = 0xffffffff;
        const limit = maxUint - (
            maxUint % maxExclusive
        );
        let x = 0;
        do {
            crypto.getRandomValues(arr);
            x = arr[0];
        } while (x >= limit);
        return x % maxExclusive;
    }
    return Math.floor(Math.random() * maxExclusive);
}

function shuffledOptions() {
    const arr = [0, 1, 2, 3];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = randInt(i + 1);
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export default function BugHunt() {
    const t = useTranslations('games.bughunt');

    const [initialChallenge] = useState<BugChallenge>(
        () => BUG_CHALLENGES[randInt(BUG_CHALLENGES.length)]
    );

    const [currentChallenge, setCurrentChallenge] = useState<BugChallenge | null>(
        () => initialChallenge
    );

    const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    const [questionsAnswered, setQuestionsAnswered] = useState(0);

    const [usedChallenges, setUsedChallenges] = useState<Set<number>>(
        () => new Set([initialChallenge.id])
    );

    const [showExplanation, setShowExplanation] = useState(false);
    const [options, setOptions] = useState<number[]>(() => shuffledOptions());

    const usedRef = useRef<Set<number>>(usedChallenges);
    useEffect(() => {
        usedRef.current = usedChallenges;
    }, [usedChallenges]);

    const total = BUG_CHALLENGES.length;

    const getNextChallenge = useCallback(() => {
        const prev = usedRef.current;

        const available = BUG_CHALLENGES.filter((c) => !prev.has(c.id));
        const next =
            available.length === 0
                ? BUG_CHALLENGES[randInt(BUG_CHALLENGES.length)]
                : available[randInt(available.length)];

        const nextUsed = available.length === 0 ? new Set([next.id]) : new Set([...prev, next.id]);

        usedRef.current = nextUsed;
        setUsedChallenges(nextUsed);

        setCurrentChallenge(next);
        setOptions(shuffledOptions());
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowExplanation(false);
    }, []);

    const handleAnswerSelect = (optionId: number) => {
        if (isAnswered || !currentChallenge) return;

        setSelectedAnswer(optionId);
        setIsAnswered(true);
        setQuestionsAnswered((prev) => prev + 1);

        if (optionId === currentChallenge.correctAnswer) {
            setScore((prev) => prev + 1);
            setStreak((prev) => prev + 1);
        } else {
            setStreak(0);
        }

        setShowExplanation(true);
    };

    const handleNext = () => {
        if (!isAnswered) return;
        getNextChallenge();
    };

    const handleReset = () => {
        const empty = new Set<number>();
        usedRef.current = empty;

        setScore(0);
        setStreak(0);
        setQuestionsAnswered(0);
        setUsedChallenges(empty);
        setSelectedAnswer(null);
        setIsAnswered(false);
        setShowExplanation(false);
        setCurrentChallenge(null);

        requestAnimationFrame(() => getNextChallenge());
    };

    if (!currentChallenge) return null;

    const isCorrect = selectedAnswer === currentChallenge.correctAnswer;
    const questionNumber = isAnswered ? questionsAnswered : questionsAnswered + 1;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20">
                    <Bug className="w-5 h-5 text-purple-500"/>
                </div>
                <div className="min-w-0">
                    <h2 className="text-xl font-semibold truncate">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground truncate">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className="p-4 rounded-xl border border-purple-500/20 bg-card grid gap-3 sm:flex sm:items-center sm:justify-between">
                <div className="grid grid-cols-3 gap-3 sm:flex sm:items-center sm:gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                        <Trophy className="w-4 h-4 text-purple-500 shrink-0"/>
                        <span className="font-mono text-base sm:text-lg tabular-nums">{score}</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0">
                        <Zap className="w-4 h-4 text-purple-500 shrink-0"/>
                        <span className="font-mono text-base sm:text-lg tabular-nums">{streak}x</span>
                    </div>
                    <div className="flex items-center gap-2 min-w-0 justify-end sm:justify-start">
                        <Clock className="w-4 h-4 text-purple-500 shrink-0"/>
                        <span className="font-mono text-base sm:text-lg tabular-nums">
                            {questionsAnswered}/{total}
                        </span>
                    </div>
                </div>

                <Button variant="outline" size="sm" onClick={handleReset} className="gap-2 w-full sm:w-auto">
                    <RotateCcw className="w-4 h-4"/>
                    {t('restart')}
                </Button>
            </div>

            <div className="p-6 rounded-xl border border-purple-500/20 bg-card space-y-4">
                <div className="flex items-center justify-between gap-3 min-w-0">
                    <span className="text-sm font-mono text-purple-500 shrink-0">{currentChallenge.language}</span>
                    <span className="text-sm text-muted-foreground text-right leading-snug">
                        {t('question', { current: questionNumber, total })}
                    </span>
                </div>

                <pre className="p-4 rounded-lg bg-muted/50 overflow-x-auto">
                    <code className="text-sm font-mono">{currentChallenge.code}</code>
                </pre>

                <div className="space-y-2">
                    <p className="text-sm font-medium">{t('prompt')}</p>
                    <div className="grid gap-2">
                        {options.map((optionId) => {
                            const isSelected = selectedAnswer === optionId;
                            const isCorrectOption = optionId === currentChallenge.correctAnswer;

                            let buttonStyle = 'border-purple-500/20 hover:border-purple-500/40 hover:bg-purple-500/5';

                            if (isAnswered) {
                                if (isCorrectOption) {
                                    buttonStyle = 'border-green-500/40 bg-green-500/10';
                                } else if (isSelected && !isCorrect) {
                                    buttonStyle = 'border-red-500/40 bg-red-500/10';
                                }
                            } else if (isSelected) {
                                buttonStyle = 'border-purple-500/40 bg-purple-500/10';
                            }

                            return (
                                <button
                                    key={optionId}
                                    onClick={() => handleAnswerSelect(optionId)}
                                    disabled={isAnswered}
                                    className={cn(
                                        'p-4 rounded-xl border text-left transition-all duration-200 w-full',
                                        'flex items-center gap-3',
                                        buttonStyle,
                                        isAnswered && 'cursor-not-allowed'
                                    )}
                                >
                                    <div
                                        className={cn(
                                            'w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0',
                                            isAnswered && isCorrectOption && 'border-green-500 bg-green-500',
                                            isAnswered && isSelected && !isCorrect && 'border-red-500 bg-red-500',
                                            !isAnswered && isSelected && 'border-purple-500 bg-purple-500',
                                            !isAnswered && !isSelected && 'border-purple-500/30'
                                        )}
                                    >
                                        {isAnswered && isCorrectOption && <Check className="w-4 h-4 text-white"/>}
                                        {isAnswered && isSelected && !isCorrect && <X className="w-4 h-4 text-white"/>}
                                    </div>
                                    <span className="text-sm leading-snug break-words">
                                        {t(`challenges.${currentChallenge.id}.options.${optionId}`)}
                                    </span>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {showExplanation && (
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
                                    <X className="w-5 h-5 text-red-500"/>
                                    <span className="font-semibold text-red-500">{t('feedback.incorrect')}</span>
                                </>
                            )}
                        </div>
                        <p className="text-sm text-muted-foreground">{t(`challenges.${currentChallenge.id}.explanation`)}</p>
                    </div>
                )}

                {isAnswered && (
                    <Button onClick={handleNext} className="w-full gap-2">
                        {t('next')}
                        <ChevronRight className="w-4 h-4"/>
                    </Button>
                )}
            </div>
        </div>
    );
}
