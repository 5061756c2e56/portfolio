'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Code2, Info, RotateCcw, Trophy, Zap } from 'lucide-react';

type LetterState = 'correct' | 'present' | 'absent' | 'empty';
type GameStatus = 'playing' | 'won' | 'lost';

interface CellData {
    letter: string;
    state: LetterState;
}

const TECH_WORDS = [
    'REACT', 'VUEJS', 'REDIS', 'NGINX', 'LINUX', 'FLASK', 'SWIFT', 'SCALA',
    'JULIA', 'UNITY', 'BLADE', 'SVELT', 'REGEX',

    'CACHE', 'TOKEN', 'QUERY', 'STACK', 'QUEUE', 'CRYPT', 'ASYNC', 'CLASS',
    'HTTPS', 'OAUTH', 'PROXY', 'SHARD', 'INDEX', 'TABLE', 'PIXEL', 'BYTES',
    'CODEC', 'SHELL', 'DEBUG', 'PATCH', 'BUILD', 'MERGE', 'CLONE', 'FETCH',
    'ARRAY', 'MUTEX', 'REGEX', 'PARSE', 'ROUTE',

    'NGINX', 'CICDN', 'CLOUD', 'NODES', 'VAULT', 'KAFKA', 'MESOS',

    'MYSQL', 'MONGO', 'SQLOG', 'GRAPH', 'STORE',

    'HTTPS', 'OAUTH', 'TOKEN', 'CRYPT', 'BCRYP', 'VAULT',

    'FETCH', 'AXIOS', 'ROUTE', 'HOOKS', 'STATE', 'PROPS', 'REDUX',

    'IONIC', 'SWIFT', 'XCODE',

    'NUMPY', 'KERAS', 'TORCH', 'LLAMA', 'NODES',

    'BINAR', 'HASHE', 'TREES', 'GRAPH', 'NODES', 'EDGES', 'DEPTH', 'WIDTH',
    'MUTEX', 'LOCKS', 'PORTS', 'SOCKS', 'CORES', 'CACHE', 'LAYER',

    'VSCODE', 'JIRA', 'SLACK', 'FIGMA', 'TRELLO',

    'FLOAT', 'RANGE', 'LOOPS', 'WHILE', 'BREAK', 'PRINT', 'INPUT', 'CONST',
    'TYPES', 'ENUMS', 'TRAIT', 'MACRO', 'CODES', 'TESTS', 'MOCKS', 'STUBS',
    'AGENT', 'BATCH', 'EVENT', 'QUEUE', 'TOPIC', 'GRANT', 'ROLES', 'SCOPE',
    'SEEDS', 'LIMIT', 'GROUP', 'ORDER', 'INNER', 'OUTER', 'JOINS', 'UNION',
    'VIEWS', 'ALIAS', 'EXECS', 'PIPES', 'FORKS', 'SPAWN', 'KILLS', 'PROCS',
    'TASKS', 'JOBS', 'CRONS', 'HOOKS', 'PLUGS', 'MIXIN', 'SUPER', 'BASES',
    'CHILD', 'CALLS', 'BACKS', 'AWAIT', 'DEFER', 'PANIC', 'ERROR', 'WARNS',
    'INFOS', 'TRACE', 'LEVEL', 'FLAGS', 'MODES', 'ENVIR', 'PATHS', 'FILES',
    'BLOBS', 'CREDS', 'AUTHS', 'PERMS', 'CHMOD', 'CHOWN', 'HOSTS', 'ZONES',
    'LEASE', 'RENEW', 'QUOTE', 'SANIC', 'CELERY', 'GUNIC', 'WSGI', 'ASGI',

    'SOLID', 'CLEAN', 'AGILE', 'SCRUM', 'KANBA', 'TASKS', 'EPICS', 'STORY',
    'SPIKE', 'BLOAT', 'DEBTS', 'SCOPE', 'SHIPS', 'DEMOS', 'SYNCS', 'STAND',
    'RETRO', 'PLANN', 'ESTIM', 'POINT', 'LOADS', 'PEAKS', 'SCALE', 'SHRED',
    'SHARD', 'SPLIT', 'BATCH', 'STRUC', 'FORMS', 'VALID', 'SANIT', 'SCRUB',
    'STRIP', 'TRIMS', 'PADS', 'FILLS', 'JOINS', 'SPLIT', 'SLICE', 'CHOPS',
    'MAPS', 'FILTE', 'REDUC', 'SORTS', 'FINDS', 'EVERY', 'SOMES', 'PUSHS',
    'SHIFT', 'UNPOP', 'CONCA', 'REVER', 'FLATS', 'ENTRY', 'KEYS', 'VALUE',
    'PAIRS', 'ITEMS', 'ITERA', 'GENER', 'YIELD', 'NEXTS', 'THROW', 'FINAL',
    'NULLS', 'VOIDS', 'UNDEF', 'NONES', 'TRUES', 'FALSE', 'ZEROS', 'EMPTY'
];

const MAX_ATTEMPTS = 6;
const WORD_LENGTH = 5;

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

export default function TechWordle() {
    const t = useTranslations('games.wordle');

    const [targetWord, setTargetWord] = useState('');
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState<CellData[][]>([]);
    const [gameStatus, setGameStatus] = useState<GameStatus>('playing');
    const [shake, setShake] = useState(false);
    const [message, setMessage] = useState('');
    const [wins, setWins] = useState(0);
    const [losses, setLosses] = useState(0);
    const [currentStreak, setCurrentStreak] = useState(0);
    const [maxStreak, setMaxStreak] = useState(0);
    const [showHelp, setShowHelp] = useState(false);

    const pickRandomWord = useCallback(() => TECH_WORDS[randInt(TECH_WORDS.length)], []);

    const initializeGame = useCallback(() => {
        setTargetWord(pickRandomWord());
        setCurrentGuess('');
        setGuesses([]);
        setGameStatus('playing');
        setMessage('');
        setShowHelp(false);
    }, [pickRandomWord]);

    useEffect(() => {
        initializeGame();
    }, [initializeGame]);

    const checkGuess = useCallback(
        (guess: string): CellData[] => {
            const result: CellData[] = [];
            const targetLetters = targetWord.split('');
            const guessLetters = guess.split('');
            const usedIndices = new Set<number>();

            for (let i = 0; i < WORD_LENGTH; i++) {
                if (guessLetters[i] === targetLetters[i]) {
                    result[i] = { letter: guessLetters[i], state: 'correct' };
                    usedIndices.add(i);
                } else {
                    result[i] = { letter: guessLetters[i], state: 'absent' };
                }
            }

            for (let i = 0; i < WORD_LENGTH; i++) {
                if (result[i].state === 'correct') continue;

                for (let j = 0; j < WORD_LENGTH; j++) {
                    if (usedIndices.has(j)) continue;
                    if (guessLetters[i] === targetLetters[j]) {
                        result[i] = { letter: guessLetters[i], state: 'present' };
                        usedIndices.add(j);
                        break;
                    }
                }
            }

            return result;
        },
        [targetWord]
    );

    const triggerShake = useCallback(() => {
        setShake(true);
        window.setTimeout(() => setShake(false), 500);
    }, []);

    const handleSubmit = useCallback(() => {
        if (gameStatus !== 'playing') return;

        if (currentGuess.length !== WORD_LENGTH) {
            setMessage(t('messages.lengthError'));
            triggerShake();
            return;
        }

        const upperGuess = currentGuess.toUpperCase();
        const result = checkGuess(upperGuess);

        setGuesses((prev) => {
            const newGuesses = [...prev, result];

            if (upperGuess === targetWord) {
                setGameStatus('won');
                setWins((w) => w + 1);
                setCurrentStreak((s) => {
                    const next = s + 1;
                    setMaxStreak((m) => Math.max(m, next));
                    return next;
                });
                setMessage(t('messages.win', { word: targetWord }));
            } else if (newGuesses.length >= MAX_ATTEMPTS) {
                setGameStatus('lost');
                setLosses((l) => l + 1);
                setCurrentStreak(0);
                setMessage(t('messages.lose', { word: targetWord }));
            } else {
                setMessage(t('messages.remaining', { count: MAX_ATTEMPTS - newGuesses.length }));
            }

            return newGuesses;
        });

        setCurrentGuess('');
    }, [checkGuess, currentGuess, gameStatus, t, targetWord, triggerShake]);

    const handleKeyPress = useCallback(
        (key: string) => {
            if (gameStatus !== 'playing') return;

            if (key === 'ENTER') {
                handleSubmit();
            } else if (key === 'BACK') {
                setCurrentGuess((prev) => prev.slice(0, -1));
            } else if (currentGuess.length < WORD_LENGTH && /^[A-Z]$/.test(key)) {
                setCurrentGuess((prev) => prev + key);
            }
        },
        [currentGuess.length, gameStatus, handleSubmit]
    );

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if (gameStatus !== 'playing') return;

            if (e.key === 'Enter') {
                handleSubmit();
            } else if (e.key === 'Backspace') {
                setCurrentGuess((prev) => prev.slice(0, -1));
            } else if (/^[a-zA-Z]$/.test(e.key)) {
                setCurrentGuess((prev) => (
                    prev.length < WORD_LENGTH ? prev + e.key.toUpperCase() : prev
                ));
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [gameStatus, handleSubmit]);

    const getCellStyle = (state: LetterState) => {
        switch (state) {
            case 'correct':
                return 'bg-green-500 border-green-500 text-white';
            case 'present':
                return 'bg-yellow-500 border-yellow-500 text-white';
            case 'absent':
                return 'bg-muted border-muted-foreground/20 text-muted-foreground';
            default:
                return 'border-cyan-500/30 bg-card';
        }
    };

    const getKeyboardKeyState = (key: string): LetterState => {
        let state: LetterState = 'empty';

        guesses.forEach((guess) => {
            guess.forEach((cell) => {
                if (cell.letter === key) {
                    if (cell.state === 'correct') {
                        state = 'correct';
                    } else if (cell.state === 'present' && state !== 'correct') {
                        state = 'present';
                    } else if (cell.state === 'absent' && state === 'empty') state = 'absent';
                }
            });
        });

        return state;
    };

    const renderGrid = () => {
        const rows = [];

        for (let i = 0; i < MAX_ATTEMPTS; i++) {
            const row = [];

            for (let j = 0; j < WORD_LENGTH; j++) {
                let cellData: CellData;

                if (i < guesses.length) {
                    cellData = guesses[i][j];
                } else if (i === guesses.length && j < currentGuess.length) {
                    cellData = { letter: currentGuess[j], state: 'empty' };
                } else {
                    cellData = { letter: '', state: 'empty' };
                }

                row.push(
                    <div
                        key={`${i}-${j}`}
                        className={cn(
                            'w-14 h-14 border-2 rounded-lg flex items-center justify-center text-2xl font-bold transition-all duration-200',
                            getCellStyle(cellData.state),
                            i === guesses.length && shake && 'animate-shake'
                        )}
                    >
                        {cellData.letter}
                    </div>
                );
            }

            rows.push(
                <div key={i} className="flex gap-2 justify-center">
                    {row}
                </div>
            );
        }

        return rows;
    };

    const keyboard = useMemo(
        () => [
            ['A', 'Z', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['Q', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M'],
            ['ENTER', 'W', 'X', 'C', 'V', 'B', 'N', 'BACK']
        ],
        []
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                    <Code2 className="w-5 h-5 text-cyan-500"/>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                </div>
            </div>

            <div
                className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-cyan-500/20 bg-card">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-cyan-500"/>
                        <span className="font-mono text-lg">{t('stats.wl', { wins, losses })}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-cyan-500"/>
                        <span className="font-mono text-lg">
                            {t('stats.streak', { current: currentStreak, max: maxStreak })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        aria-pressed={showHelp}
                        onClick={() => setShowHelp((v) => !v)}
                        className={cn('gap-2', showHelp && 'bg-cyan-500/10 border-cyan-500/40 text-cyan-500')}
                    >
                        <Info className="w-4 h-4"/>
                        {t('help.button')}
                    </Button>
                    <Button variant="outline" size="sm" onClick={initializeGame} className="gap-2">
                        <RotateCcw className="w-4 h-4"/>
                        {t('newWord')}
                    </Button>
                </div>
            </div>

            {showHelp && (
                <div className="p-6 rounded-xl border border-cyan-500/20 bg-card space-y-4">
                    <h3 className="font-semibold text-lg">{t('help.title')}</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                        <p>{t('help.line1')}</p>
                        <p>{t('help.line2')}</p>
                        <p>{t('help.line3')}</p>

                        <div className="space-y-2 mt-3">
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center text-white font-bold">
                                    R
                                </div>
                                <span>{t('help.legend.correct')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-yellow-500 rounded-lg flex items-center justify-center text-white font-bold">
                                    E
                                </div>
                                <span>{t('help.legend.present')}</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 bg-muted border border-muted-foreground/20 rounded-lg flex items-center justify-center text-muted-foreground font-bold">
                                    A
                                </div>
                                <span>{t('help.legend.absent')}</span>
                            </div>
                        </div>

                        <p className="mt-3">{t('help.examples')}</p>
                    </div>
                </div>
            )}

            {message && (
                <div
                    className={cn(
                        'p-4 rounded-xl border text-center font-medium',
                        gameStatus === 'won'
                            ? 'border-green-500/20 bg-green-500/5 text-green-500'
                            : gameStatus === 'lost'
                                ? 'border-red-500/20 bg-red-500/5 text-red-500'
                                : 'border-cyan-500/20 bg-cyan-500/5 text-cyan-500'
                    )}
                >
                    {message}
                </div>
            )}

            <div className="space-y-2">{renderGrid()}</div>

            <div className="space-y-2">
                {keyboard.map((row, i) => (
                    <div key={i} className="flex gap-1 justify-center">
                        {row.map((key) => {
                            const state = key.length === 1 ? getKeyboardKeyState(key) : 'empty';
                            const isSpecial = key === 'ENTER' || key === 'BACK';

                            return (
                                <button
                                    key={key}
                                    onClick={() => handleKeyPress(key)}
                                    disabled={gameStatus !== 'playing'}
                                    className={cn(
                                        'h-12 rounded-lg font-semibold text-sm transition-all duration-200',
                                        isSpecial ? 'px-4' : 'w-9',
                                        'border-2',
                                        gameStatus !== 'playing' && 'opacity-50 cursor-not-allowed',
                                        getCellStyle(state),
                                        state === 'empty' && 'hover:bg-cyan-500/10 hover:border-cyan-500/40'
                                    )}
                                >
                                    {key === 'BACK' ? '←' : key}
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}