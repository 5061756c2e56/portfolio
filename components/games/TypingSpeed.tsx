'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Check, ChevronDown, Clock, Keyboard, Play, RotateCcw, Target, X, Zap } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';
type Mode = 'quotes' | 'numbers' | 'punctuation' | 'mixed';
type GameState = 'idle' | 'playing' | 'finished';

const GAME_DURATIONS = [15, 30, 60, 120] as const;

const DEFAULT_DIFFICULTY: Difficulty = 'easy';
const DEFAULT_MODE: Mode = 'mixed';
const DEFAULT_DURATION: ( typeof GAME_DURATIONS )[number] = 60;

const BEST_WPM_PREFIX = 'typingSpeed.bestWpm.v1';

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

function pick<T>(arr: readonly T[]) {
    return arr[randInt(arr.length)];
}

function maybe(prob: number) {
    return randInt(1000) < prob * 1000;
}

function normalizeQuotes(s: string) {
    return s
        .replace(/[’‘]/g, '\'')
        .replace(/[“”]/g, '"')
        .replace(/\s+/g, ' ')
        .trim();
}

function formatColonsByLocale(input: string, locale: 'fr' | 'en') {
    const s = normalizeQuotes(input);
    const out: string[] = [];
    for (let i = 0; i < s.length; i++) {
        const ch = s[i];
        if (ch !== ':') {
            out.push(ch);
            continue;
        }

        const prev = s[i - 1] ?? '';
        const next = s[i + 1] ?? '';

        const isTimeColon = /\d/.test(prev) && /\d/.test(next);
        if (isTimeColon) {
            out.push(':');
            continue;
        }

        if (locale === 'fr') {
            if (out.length && out[out.length - 1] === ' ') out.pop();
            out.push(' ', ':', ' ');
            if (next === ' ') i += 1;
        } else {
            if (out.length && out[out.length - 1] === ' ') out.pop();
            out.push(':', ' ');
            if (next === ' ') i += 1;
        }
    }

    return out.join('').replace(/\s+/g, ' ').trim();
}

const BANK = {
    fr: {
        quotes: [
            'Ce matin, la ville semblait plus calme que d\'habitude.',
            'Il suffit parfois d\'une bonne idée pour débloquer une journée.',
            'La pluie n\'empêche pas d\'avancer ; elle change seulement le rythme.',
            'Un café chaud, une playlist, et tout devient plus simple.',
            'Les petits efforts répétés finissent toujours par payer.',
            'Parfois, le meilleur plan, c\'est de commencer.',
            'On ne contrôle pas tout, mais on peut choisir la prochaine action.',
            'Un message inattendu peut remettre le sourire au bon moment.',
            'La curiosité ouvre des portes que la routine ne voit pas.',
            'Le silence aide à entendre ce qui compte vraiment.',
            'Les meilleures décisions sont souvent les plus simples.',
            'Une bonne nuit peut réparer une mauvaise journée.',
            'Rater un détail n\'est pas grave ; abandonner l\'effort, oui.',
            'Une promenade courte vaut mieux qu\'une hésitation longue.',
            'On apprend plus vite quand on reste patient avec soi-même.',
            'Ce que tu fais chaque jour te construit en secret.',
            'Un objectif clair rend les distractions moins fortes.',
            'Chaque minute gagnée s\'additionne sur une semaine.',
            'Un bon rythme, c\'est celui qu\'on peut tenir longtemps.',
            'Le progrès se voit rarement le jour même, mais il arrive.',
            'On peut être fatigué et avancer quand même.',
            'Le courage, c\'est souvent une petite action discrète.',
            'Un bon timing peut transformer une idée ordinaire.',
            'Respire, recommence, et laisse le temps faire son travail.',
            'Une erreur est une information, pas une sentence.',
            'La discipline est une forme de liberté.',
            'La constance bat la motivation sur le long terme.',
            'L\'essentiel, c\'est d\'être régulier, pas parfait.',
            'Les bonnes habitudes rendent les journées plus légères.',
            'Fais simple, puis améliore.',
            'Quand c\'est flou, note-le.',
            'Une liste courte vaut mieux qu’un plan immense.',
            'La meilleure énergie vient d\'un départ net.',
            'La qualité naît des détails répétés.',
            'Un petit pas maintenant, c\'est énorme demain.',
            'Une décision claire enlève beaucoup de stress.',
            'Le calme est un super pouvoir moderne.',
            'Tu peux changer d\'avis, pas ton effort.',
            'Ce qui compte, c\'est la direction, pas la vitesse.',
            'La persévérance n\'a pas besoin d\'être bruyante.',
            'Quand tu doutes, reviens à l\'essentiel : une action.',
            'Choisis une priorité, puis protège-la.',
            'Un bon rangement peut libérer la tête.',
            'La simplicité rend la vitesse possible.',
            'On avance mieux quand on sait pourquoi.',
            'Une pause courte évite une fatigue longue.',
            'Le mieux est l\'ennemi du fait.',
            'L\'élan vient après le premier pas.',
            'Une tâche finie vaut mieux que dix commencées.',
            'Aujourd\'hui, vise le progrès, pas la perfection.'
        ],
        numbers: [
            'Objectif : 2 tâches importantes, puis 1 pause.',
            'Rappel : 1 % par jour, c\'est énorme sur une année.',
            'Plan : 25 minutes focus, 5 minutes off, et on recommence.',
            'Budget : 120 € pour l\'essentiel, 30 € pour le plaisir.',
            'Trajet : 18 minutes à pied, 4 minutes de marge.',
            'Routine : eau, lumière, mouvement, puis travail.',
            'Score : 9 / 10 quand tu restes simple et constant.',
            'Ce soir : une chose à terminer, puis repos.',
            'Il est 07:45, et la journée vient juste de commencer.',
            'Top 3 : dormir, bouger, créer.'
        ],
        punctuation: [
            'D\'accord... mais cette fois, on y va doucement.',
            'Tu sais quoi ? On fait simple : une chose à la fois.',
            'Oui, c\'est possible ; non, ce n\'est pas magique.',
            'Respire : inspire, expire, recommence.',
            'Tu peux hésiter — mais tu avances quand même.',
            'Ce n\'est pas parfait, et alors ?',
            'Un pas, puis un autre ; c\'est tout.',
            'Parfois, "assez bien" est déjà excellent.',
            'On se concentre ici : maintenant.',
            'Ça arrive ; on corrige ; on continue.'
        ],
        coherent: {
            starters: [
                'Ce matin',
                'Aujourd\'hui',
                'Cette semaine',
                'Quand tu veux avancer',
                'Si tu manques d\'énergie',
                'Quand tout s\'accélère',
                'Quand tu veux rester concentré',
                'Avant de te lancer',
                'Si tu hésites',
                'Quand tu veux progresser'
            ],
            actions: [
                'choisis une seule priorité',
                'écris une liste courte',
                'commence par la tâche la plus simple',
                'termine une étape, puis la suivante',
                'coupe les distractions pendant 15 minutes',
                'range ton espace pendant 2 minutes',
                'respire et reprends un rythme stable',
                'avance sans te juger',
                'fais une pause puis reviens',
                'garde une cadence que tu peux tenir'
            ],
            outcomes: [
                'et tu verras la différence.',
                'et tout devient plus fluide.',
                'et tu gagnes du temps.',
                'et tu gardes l\'élan.',
                'et tu réduis le stress.',
                'et tu fais mieux, sans forcer.',
                'et tu restes clair.',
                'et tu avances vraiment.',
                'et tu retrouves du calme.',
                'et tu finis plus souvent.'
            ],
            addOns: [
                'Rappelle-toi que la régularité bat la vitesse.',
                'Mieux vaut faire peu, mais le faire bien.',
                'La constance transforme les journées.',
                'Un petit pas maintenant vaut beaucoup plus qu\'une intention.',
                'L\'important est de continuer, même lentement.'
            ]
        }
    },
    en: {
        quotes: [
            'This morning, the city felt quieter than usual.',
            'Sometimes one good idea unlocks the whole day.',
            'Rain doesn\'t stop progress; it only changes the rhythm.',
            'A warm drink and a playlist can reset everything.',
            'Small efforts, repeated, always add up.',
            'Sometimes the best plan is simply to begin.',
            'You can\'t control everything, but you can choose the next move.',
            'An unexpected message can bring a smile right on time.',
            'Curiosity opens doors routine never notices.',
            'Silence helps you hear what matters.',
            'The best decisions are often the simplest ones.',
            'A good night can fix a rough day.',
            'Missing a detail is fine; quitting isn\'t.',
            'A short walk beats a long hesitation.',
            'You learn faster when you stay patient with yourself.',
            'What you do daily builds you quietly.',
            'A clear goal makes distractions weaker.',
            'Every minute saved stacks up over a week.',
            'A good pace is one you can keep.',
            'Progress is rarely visible today, but it shows up.',
            'You can be tired and move forward anyway.',
            'Courage is often a small, quiet action.',
            'Good timing can elevate an ordinary idea.',
            'Breathe, restart, and let time do its work.',
            'A mistake is information, not a sentence.',
            'Discipline is a kind of freedom.',
            'Consistency beats motivation long-term.',
            'Regular beats perfect.',
            'Good habits make days lighter.',
            'Keep it simple, then improve.',
            'When it\'s fuzzy, write it down.',
            'A short list beats a huge plan.',
            'Clean starts create clean energy.',
            'Quality comes from repeated details.',
            'A small step now is huge later.',
            'A clear decision removes most stress.',
            'Calm is a modern superpower.',
            'You can change your mind, not your effort.',
            'Direction matters more than speed.',
            'Persistence doesn\'t need to be loud.',
            'When you doubt, return to one next action.',
            'Pick one priority and protect it.',
            'A tidy space can clear the mind.',
            'Simplicity makes speed possible.',
            'You move better when you know why.',
            'A short break prevents a long burnout.',
            'Done beats perfect most days.',
            'Momentum starts after the first step.',
            'One finished task beats ten half-started.',
            'Aim for progress, not perfection.'
        ],
        numbers: [
            'Goal: 2 important tasks, then 1 break.',
            'Reminder: 1% a day adds up over a year.',
            'Plan: 25 minutes focus, 5 minutes off, repeat.',
            'Budget: $120 essentials, $30 fun.',
            'Commute: 18 minutes walking, 4 minutes buffer.',
            'Routine: water, light, movement, then work.',
            'Score: 9/10 when you keep it simple and steady.',
            'Tonight: finish one thing, then rest.',
            'It is 07:45, and the day just started.',
            'Top 3: sleep, move, create.'
        ],
        punctuation: [
            'Alright... but this time, we go gently.',
            'You know what? Keep it simple: one thing at a time.',
            'Yes, it\'s possible; no, it\'s not magic.',
            'Breathe: in, out, repeat.',
            'You can hesitate — and still move forward.',
            'It\'s not perfect, so what?',
            'One step, then another; that\'s it.',
            'Sometimes "good enough" is already great.',
            'Focus here: now.',
            'It happens; we fix it; we continue.'
        ],
        coherent: {
            starters: [
                'This morning',
                'Today',
                'This week',
                'When you want to move forward',
                'If you\'re low on energy',
                'When things speed up',
                'When you want to stay focused',
                'Before you start',
                'If you hesitate',
                'When you want to improve'
            ],
            actions: [
                'pick one priority',
                'write a short list',
                'start with the easiest step',
                'finish one step, then the next',
                'cut distractions for 15 minutes',
                'tidy your space for 2 minutes',
                'breathe and return to a steady rhythm',
                'move without judging yourself',
                'take a short break, then come back',
                'keep a pace you can maintain'
            ],
            outcomes: [
                'and you\'ll feel the difference.',
                'and everything gets smoother.',
                'and you save time.',
                'and you keep momentum.',
                'and stress drops.',
                'and you do better without forcing it.',
                'and your mind stays clear.',
                'and you actually move forward.',
                'and calm comes back.',
                'and you finish more often.'
            ],
            addOns: [
                'Remember: consistency beats speed.',
                'Do less, but do it well.',
                'Steady habits shape the day.',
                'A small step now beats a big intention later.',
                'The point is to continue, even slowly.'
            ]
        }
    }
} as const;

function makeCoherentLine(locale: 'fr' | 'en') {
    const c = BANK[locale].coherent;
    let line = `${pick(c.starters)}, ${pick(c.actions)} ${pick(c.outcomes)}`;
    if (maybe(0.35)) line += ` ${pick(c.addOns)}`;
    return normalizeQuotes(line);
}

function generateChunk(locale: 'fr' | 'en', mode: Mode, difficulty: Difficulty, used: Set<string>) {
    const bank = BANK[locale];

    const targetSentences =
        difficulty === 'easy' ? 2 + randInt(2) : difficulty === 'medium' ? 3 + randInt(2) : 4 + randInt(3);

    const parts: string[] = [];
    for (let i = 0; i < targetSentences; i++) {
        let s = '';

        const roll = randInt(100);
        if (mode === 'quotes') {
            s = roll < 75 ? pick(bank.quotes) : makeCoherentLine(locale);
        } else if (mode === 'numbers') {
            s = roll < 65 ? pick(bank.numbers) : makeCoherentLine(locale);
        } else if (mode === 'punctuation') {
            s = roll < 65 ? pick(bank.punctuation) : makeCoherentLine(locale);
        } else {
            if (roll < 70) {
                s = makeCoherentLine(locale);
            } else if (roll < 82) {
                s = pick(bank.quotes);
            } else if (roll < 92) {
                s = pick(bank.punctuation);
            } else {
                s = pick(bank.numbers);
            }
        }

        s = formatColonsByLocale(s, locale);

        let tries = 0;
        while (used.has(s) && tries < 6) {
            s = makeCoherentLine(locale);
            s = formatColonsByLocale(s, locale);
            tries++;
        }
        used.add(s);
        parts.push(s);
    }

    return parts.join(' ');
}

function CustomSelect<T extends string>({
    value,
    onChange,
    options,
    label,
    disabled
}: {
    value: T;
    onChange: (v: T) => void;
    options: { value: T; label: string }[];
    label: string;
    disabled?: boolean;
}) {
    const [open, setOpen] = useState(false);
    const rootRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const onPointerDown = (e: PointerEvent) => {
            if (!rootRef.current) return;
            if (!rootRef.current.contains(e.target as Node)) setOpen(false);
        };
        window.addEventListener('pointerdown', onPointerDown);
        return () => window.removeEventListener('pointerdown', onPointerDown);
    }, []);

    useEffect(() => {
        if (disabled) setOpen(false);
    }, [disabled]);

    const current = options.find((o) => o.value === value);

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                aria-label={label}
                aria-haspopup="listbox"
                aria-expanded={open}
                disabled={disabled}
                onClick={() => !disabled && setOpen((v) => !v)}
                className={cn(
                    'h-10 px-3 rounded-lg border border-border bg-transparent text-sm',
                    'inline-flex items-center gap-2',
                    'transition-colors',
                    disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-accent hover:text-foreground',
                    'focus:outline-none focus-visible:ring-2 focus-visible:ring-foreground/10'
                )}
            >
                <span className="whitespace-nowrap">{current?.label ?? value}</span>
                <ChevronDown className={cn('w-4 h-4 transition-transform', open && 'rotate-180')}/>
            </button>

            <div
                role="listbox"
                aria-label={label}
                className={cn(
                    'absolute right-0 mt-2 w-48 origin-top-right rounded-lg border border-border bg-card shadow-lg p-1 z-50',
                    'transition-all duration-150',
                    open ? 'opacity-100 scale-100' : 'pointer-events-none opacity-0 scale-95'
                )}
            >
                {options.map((opt) => {
                    const active = opt.value === value;
                    return (
                        <button
                            key={opt.value}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                                onChange(opt.value);
                                setOpen(false);
                            }}
                            className={cn(
                                'w-full px-2.5 py-2 rounded-md text-sm text-left',
                                'flex items-center justify-between gap-2',
                                'transition-colors',
                                active ? 'bg-accent text-foreground' : 'hover:bg-accent/70 text-muted-foreground hover:text-foreground'
                            )}
                        >
                            <span>{opt.label}</span>
                            {active && <Check className="w-4 h-4"/>}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

export default function TypingSpeed() {
    const t = useTranslations('games.typing');
    const rawLocale = useLocale();
    const locale = rawLocale === 'fr' || rawLocale === 'en' ? rawLocale : 'fr';

    const [gameState, setGameState] = useState<GameState>('idle');

    const [difficulty, setDifficulty] = useState<Difficulty>(DEFAULT_DIFFICULTY);
    const [mode, setMode] = useState<Mode>(DEFAULT_MODE);
    const [duration, setDuration] = useState<( typeof GAME_DURATIONS )[number]>(DEFAULT_DURATION);

    const [text, setText] = useState('');
    const [typed, setTyped] = useState('');

    const [timeLeft, setTimeLeft] = useState<number>(DEFAULT_DURATION);

    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
    const usedRef = useRef<Set<string>>(new Set());

    const inputRef = useRef<HTMLInputElement>(null);
    const typedRef = useRef('');
    const textRef = useRef('');

    const [totalKeystrokes, setTotalKeystrokes] = useState(0);
    const [mistakeKeystrokes, setMistakeKeystrokes] = useState(0);
    const [correctKeystrokes, setCorrectKeystrokes] = useState(0);

    const [bestWpm, setBestWpm] = useState<number | null>(null);
    const [isNewBest, setIsNewBest] = useState(false);

    const bestKey = useMemo(() => {
        return `${BEST_WPM_PREFIX}:${locale}:${difficulty}:${mode}:${duration}`;
    }, [difficulty, duration, locale, mode]);

    useEffect(() => {
        textRef.current = text;
    }, [text]);

    useEffect(() => {
        if (gameState === 'idle') setTimeLeft(duration);
    }, [duration, gameState]);

    useEffect(() => {
        try {
            const raw = localStorage.getItem(bestKey);
            const n = raw == null ? null : Number(raw);
            setBestWpm(Number.isFinite(n as number) ? (
                n as number
            ) : null);
        } catch {
            setBestWpm(null);
        }
    }, [bestKey]);

    const stopTimer = useCallback(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    }, []);

    const hardReset = useCallback(() => {
        stopTimer();
        usedRef.current.clear();

        setGameState('idle');

        setDifficulty(DEFAULT_DIFFICULTY);
        setMode(DEFAULT_MODE);
        setDuration(DEFAULT_DURATION);

        setText('');
        setTyped('');
        typedRef.current = '';
        textRef.current = '';

        setTimeLeft(DEFAULT_DURATION);

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setIsNewBest(false);

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [stopTimer]);

    const cancelGame = useCallback(() => {
        stopTimer();
        usedRef.current.clear();

        setGameState('idle');

        setText('');
        setTyped('');
        typedRef.current = '';
        textRef.current = '';

        setTimeLeft(duration);

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setIsNewBest(false);

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [duration, stopTimer]);

    const backToIdleFromResults = useCallback(() => {
        stopTimer();
        usedRef.current.clear();

        setGameState('idle');

        setText('');
        setTyped('');
        typedRef.current = '';
        textRef.current = '';

        setTimeLeft(duration);

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setIsNewBest(false);

        requestAnimationFrame(() => inputRef.current?.blur());
    }, [duration, stopTimer]);

    useEffect(() => {
        return () => stopTimer();
    }, [stopTimer]);

    const ensureMoreText = useCallback(() => {
        const need = Math.max(120, difficulty === 'easy' ? 160 : difficulty === 'medium' ? 240 : 320);
        if (text.length - typedRef.current.length > need) return;

        const used = usedRef.current;
        const more = generateChunk(locale, mode, difficulty, used);
        setText((prev) => (
            prev ? `${prev} ${more}` : more
        ));
    }, [difficulty, locale, mode, text.length]);

    const startGame = useCallback(() => {
        stopTimer();
        usedRef.current.clear();
        setIsNewBest(false);

        const used = usedRef.current;
        const initial = generateChunk(locale, mode, difficulty, used);
        const second = generateChunk(locale, mode, difficulty, used);
        const initialText = `${initial} ${second}`;

        setText(initialText);
        textRef.current = initialText;

        setTyped('');
        typedRef.current = '';

        setTotalKeystrokes(0);
        setCorrectKeystrokes(0);
        setMistakeKeystrokes(0);

        setTimeLeft(duration);
        setGameState('playing');

        intervalRef.current = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    stopTimer();
                    setGameState('finished');
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        requestAnimationFrame(() => inputRef.current?.focus());
    }, [difficulty, duration, locale, mode, stopTimer]);

    const pushChars = useCallback(
        (raw: string) => {
            if (gameState !== 'playing') return;
            if (!raw) return;

            const target = textRef.current;
            let next = typedRef.current;

            let addTotal = 0;
            let addCorrect = 0;
            let addMistakes = 0;

            for (const ch of raw) {
                if (ch === '\n' || ch === '\r') continue;

                const pos = next.length;
                const expected = target[pos] ?? '';

                addTotal += 1;
                if (ch === expected) {
                    addCorrect += 1;
                } else {
                    addMistakes += 1;
                }

                next += ch;
            }

            typedRef.current = next;
            setTyped(next);

            setTotalKeystrokes((v) => v + addTotal);
            setCorrectKeystrokes((v) => v + addCorrect);
            setMistakeKeystrokes((v) => v + addMistakes);

            ensureMoreText();
        },
        [ensureMoreText, gameState]
    );

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (gameState !== 'playing') return;

        if (e.key === 'Backspace') {
            e.preventDefault();
            const cur = typedRef.current;
            if (!cur) return;

            const next = cur.slice(0, -1);
            typedRef.current = next;
            setTyped(next);
            return;
        }

        if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            e.preventDefault();
            pushChars(e.key);
        }
    };

    const handleBeforeInput = (e: any) => {
        if (gameState !== 'playing') return;
        const data = e?.data as string | undefined;
        if (!data) return;
        e.preventDefault();
        pushChars(data);
    };

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
    };

    const elapsedSeconds = useMemo(() => {
        if (gameState === 'idle') return 0;
        const elapsed = duration - timeLeft;
        return Math.max(0, elapsed);
    }, [duration, gameState, timeLeft]);

    const netWpm = useMemo(() => {
        if (elapsedSeconds <= 0) return 0;
        const minutes = elapsedSeconds / 60;

        const gross = (
                      totalKeystrokes / 5
                      ) / minutes;
        const penalty = (
                        mistakeKeystrokes / 5
                        ) / minutes;
        const net = Math.max(0, gross - penalty);

        return Math.round(Math.min(300, net));
    }, [elapsedSeconds, mistakeKeystrokes, totalKeystrokes]);

    const accuracy = useMemo(() => {
        if (totalKeystrokes === 0) return 100;
        return Math.max(0, Math.min(100, Math.round((
                                                        correctKeystrokes / totalKeystrokes
                                                    ) * 100)));
    }, [correctKeystrokes, totalKeystrokes]);

    const progress = useMemo(() => {
        if (duration <= 0) return 0;
        return Math.max(0, Math.min(100, Math.round((
                                                        (
                                                            duration - timeLeft
                                                        ) / duration
                                                    ) * 100)));
    }, [duration, timeLeft]);

    useEffect(() => {
        if (gameState !== 'finished') return;

        let prevBest: number | null = null;
        try {
            const raw = localStorage.getItem(bestKey);
            const n = raw == null ? null : Number(raw);
            prevBest = Number.isFinite(n as number) ? (
                n as number
            ) : null;
        } catch {
            prevBest = bestWpm;
        }

        const improved = prevBest == null ? true : netWpm > prevBest;
        if (improved) {
            try {
                localStorage.setItem(bestKey, String(netWpm));
            } catch {
            }
            setBestWpm(netWpm);
            setIsNewBest(true);
        } else {
            setBestWpm(prevBest);
            setIsNewBest(false);
        }
    }, [bestKey, bestWpm, gameState, netWpm]);

    const renderText = () => {
        const out: React.ReactNode[] = [];
        const showLen = Math.min(text.length, typed.length + 240);
        for (let i = 0; i < showLen; i++) {
            const target = text[i];
            const typedChar = typed[i];

            if (typedChar == null) {
                const isCaret = i === typed.length;
                out.push(
                    <span
                        key={i}
                        className={cn('text-muted-foreground', isCaret
                                                               && 'bg-foreground/20 text-foreground rounded-sm')}
                    >
            {target}
          </span>
                );
            } else {
                const ok = typedChar === target;
                out.push(
                    <span key={i} className={cn(ok ? 'text-green-500' : 'text-red-500 bg-red-500/20 rounded-sm')}>
            {target}
          </span>
                );
            }
        }
        return out;
    };

    const difficultyOptions = useMemo(
        () => [
            { value: 'easy' as const, label: t('levels.easy') },
            { value: 'medium' as const, label: t('levels.medium') },
            { value: 'hard' as const, label: t('levels.hard') }
        ],
        [t]
    );

    const modeOptions = useMemo(
        () => [
            { value: 'mixed' as const, label: t('modes.mixed') },
            { value: 'quotes' as const, label: t('modes.quotes') },
            { value: 'numbers' as const, label: t('modes.numbers') },
            { value: 'punctuation' as const, label: t('modes.punctuation') }
        ],
        [t]
    );

    const durationOptions = useMemo(
        () =>
            GAME_DURATIONS.map((d) => (
                {
                    value: String(d) as `${typeof d}`,
                    label: `${d}s`
                }
            )),
        []
    );

    const controlsDisabled = gameState === 'playing';
    const canCancel = gameState === 'playing';
    const canReset = gameState !== 'playing';

    if (gameState === 'finished') {
        return (
            <div className="space-y-6">
                <div className="flex items-center gap-3 mb-2">
                    <div className="p-2.5 rounded-lg bg-muted">
                        <Keyboard className="w-5 h-5"/>
                    </div>
                    <div>
                        <h2 className="text-xl font-semibold">{t('title')}</h2>
                        <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card text-center">
                    <div className="text-4xl mb-4">⌨️</div>
                    <h3 className="text-xl font-semibold mb-2">{t('results.title')}</h3>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold gradient-text">{netWpm}</div>
                            <div className="text-sm text-muted-foreground">WPM</div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{accuracy}%</div>
                            <div className="text-sm text-muted-foreground">{t('results.accuracy')}</div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{Math.round(elapsedSeconds)}s</div>
                            <div className="text-sm text-muted-foreground">{t('results.time')}</div>
                        </div>

                        <div className="p-4 rounded-lg bg-muted">
                            <div className="text-2xl font-bold">{bestWpm ?? netWpm}</div>
                            <div className="text-sm text-muted-foreground">
                                {isNewBest ? (
                                    locale === 'fr' ? 'Nouveau record !' : 'New best!'
                                ) : t('results.best')}
                            </div>
                        </div>
                    </div>

                    <div className="mt-6 flex items-center justify-center gap-2">
                        <Button onClick={backToIdleFromResults} className="gap-2">
                            <RotateCcw className="w-4 h-4"/>
                            {t('playAgain')}
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-2.5 rounded-lg bg-muted">
                    <Keyboard className="w-5 h-5"/>
                </div>
                <div>
                    <h2 className="text-xl font-semibold">{t('title')}</h2>
                    <p className="text-sm text-muted-foreground">{t('subtitle')}</p>
                </div>
            </div>

            <div className="p-4 rounded-xl border border-border bg-card space-y-3">
                <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-muted-foreground"/>
                            <span className={cn('font-mono text-lg', timeLeft <= 10 && gameState === 'playing'
                                                                     && 'text-red-500')}>
                {timeLeft}s
              </span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Zap className="w-4 h-4 text-muted-foreground"/>
                            <span className="font-mono text-lg">{netWpm} WPM</span>
                        </div>

                        <div className="flex items-center gap-2">
                            <Target className="w-4 h-4 text-muted-foreground"/>
                            <span className="font-mono text-lg">{accuracy}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        {gameState === 'idle' ? (
                            <Button onClick={startGame} className="gap-2">
                                <Play className="w-4 h-4"/>
                                {t('start')}
                            </Button>
                        ) : (
                            <Button variant="outline" onClick={startGame} className="gap-2">
                                <RotateCcw className="w-4 h-4"/>
                                {t('restart')}
                            </Button>
                        )}

                        <Button
                            variant="outline"
                            onClick={cancelGame}
                            className="gap-2"
                            disabled={!canCancel}
                            title={locale === 'fr' ? 'Annule la partie en cours' : 'Cancel current run'}
                        >
                            <X className="w-4 h-4"/>
                            {locale === 'fr' ? 'Annuler' : 'Cancel'}
                        </Button>
                    </div>
                </div>

                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full transition-all duration-300" style={{ width: `${progress}%` }}/>
                </div>

                <div className="flex flex-wrap items-center gap-2 justify-between">
                    <div className="flex items-center gap-2">
                        <CustomSelect
                            value={difficulty}
                            onChange={(v) => setDifficulty(v as Difficulty)}
                            options={difficultyOptions}
                            label="Difficulty"
                            disabled={controlsDisabled}
                        />
                        <CustomSelect
                            value={mode}
                            onChange={(v) => setMode(v as Mode)}
                            options={modeOptions}
                            label="Mode"
                            disabled={controlsDisabled}
                        />
                        <CustomSelect
                            value={String(duration) as any}
                            onChange={(v) => setDuration(Number(v) as any)}
                            options={durationOptions as any}
                            label="Duration"
                            disabled={controlsDisabled}
                        />
                    </div>

                    <button
                        type="button"
                        onClick={hardReset}
                        disabled={!canReset}
                        className={cn(
                            'text-sm text-muted-foreground hover:text-foreground transition-colors',
                            !canReset && 'opacity-60 cursor-not-allowed hover:text-muted-foreground'
                        )}
                    >
                        {t('reset')}
                    </button>
                </div>
            </div>

            <div className="p-6 rounded-xl border border-border bg-card">
                <div className="text-base sm:text-lg leading-relaxed mb-6 p-4 rounded-lg bg-muted min-h-16">
                    {gameState === 'idle' ? (
                        <span className="text-muted-foreground">{t('pressStart')}</span>
                    ) : (
                        <span className="whitespace-pre-wrap break-words">{renderText()}</span>
                    )}
                </div>

                <input
                    ref={inputRef}
                    type="text"
                    value=""
                    readOnly
                    onKeyDown={handleKeyDown}
                    onBeforeInput={handleBeforeInput}
                    onPaste={handlePaste}
                    disabled={gameState !== 'playing'}
                    placeholder={gameState === 'playing' ? t('typeHere') : ''}
                    autoComplete="off"
                    autoCorrect="off"
                    autoCapitalize="off"
                    spellCheck={false}
                    inputMode="text"
                    name="typing-speed"
                    enterKeyHint="done"
                    className={cn(
                        'w-full h-12 px-4 rounded-lg border bg-transparent text-base',
                        'focus:outline-none focus:ring-2 focus:ring-foreground/10',
                        'disabled:opacity-50 disabled:cursor-not-allowed',
                        gameState === 'playing' ? 'border-foreground/20' : 'border-border'
                    )}
                />
            </div>
        </div>
    );
}
