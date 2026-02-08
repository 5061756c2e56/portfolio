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

import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useSyncExternalStore } from 'react';
import { useTranslations } from 'next-intl';
import GamesNavigation from '@/components/navbars/Games/GamesNavigation';
import Quiz from '@/components/games/Quiz';
import MemoryGame from '@/components/games/MemoryGame';
import TypingSpeed from '@/components/games/TypingSpeed';
import BugHunt from '@/components/games/BugHunt';
import TechWordle from '@/components/games/TechWordle';
import MentalCpu from '@/components/games/MentalCpu';
import RegexRush from '@/components/games/RegexRush';
import HttpDetective from '@/components/games/HttpDetective';
import SqlSleuth from '@/components/games/SqlSleuth';
import { Brain, Bug, Code2, Database, Globe, Keyboard, Regex, Sparkles, SquareFunction } from 'lucide-react';
import { cn } from '@/lib/utils';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
    Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext,
    PaginationPrevious
} from '@/components/ui/pagination';

type GameType =
    | 'quiz'
    | 'memory'
    | 'typing'
    | 'bughunt'
    | 'wordle'
    | 'mentalcpu'
    | 'regexrush'
    | 'httpdetective'
    | 'sqlsleuth';

const GAME_IDS: GameType[] = [
    'quiz',
    'memory',
    'typing',
    'bughunt',
    'wordle',
    'mentalcpu',
    'regexrush',
    'httpdetective',
    'sqlsleuth'
];

function isGameType(v: string | null): v is GameType {
    return !!v && (
        GAME_IDS as string[]
    ).includes(v);
}

function useMediaQuery(query: string, ssrDefault = true) {
    return useSyncExternalStore(
        (onStoreChange) => {
            const mq = window.matchMedia(query);
            mq.addEventListener('change', onStoreChange);
            return () => mq.removeEventListener('change', onStoreChange);
        },
        () => window.matchMedia(query).matches,
        () => ssrDefault
    );
}

function buildPagination(current: number, total: number): Array<number | 'ellipsis'> {
    if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

    const items: Array<number | 'ellipsis'> = [];
    const push = (v: number | 'ellipsis') => items.push(v);

    push(1);

    const left = Math.max(2, current - 1);
    const right = Math.min(total - 1, current + 1);

    if (left > 2) push('ellipsis');
    for (let p = left; p <= right; p++) push(p);
    if (right < total - 1) push('ellipsis');

    push(total);
    return items;
}

interface GameCardProps {
    title: string;
    description: string;
    icon: ReactNode;
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
                <div
                    className={cn(
                        'h-11 w-11 rounded-lg flex items-center justify-center shrink-0 transition-colors duration-200',
                        isActive ? 'bg-foreground text-background' : 'bg-muted text-foreground'
                    )}
                >
                    {icon}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold mb-1 truncate">{title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
                </div>
            </div>
        </button>
    );
}

export default function GamesPageClient() {
    const t = useTranslations('games');
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const id = searchParams.get('id');
    const activeGame: GameType | null = isGameType(id) ? id : null;

    const isMdUp = useMediaQuery('(min-width: 768px)', false);
    const itemsPerPage = isMdUp ? 6 : 2;

    const games = useMemo(
        () => [
            // {
            //     id: 'quiz' as GameType,
            //     title: t('gameTypes.quiz.title'),
            //     description: t('gameTypes.quiz.description'),
            //     icon: <Trophy className="w-5 h-5"/>
            // },
            {
                id: 'memory' as GameType,
                title: t('gameTypes.memory.title'),
                description: t('gameTypes.memory.description'),
                icon: <Brain className="w-5 h-5"/>
            },
            {
                id: 'typing' as GameType,
                title: t('gameTypes.typing.title'),
                description: t('gameTypes.typing.description'),
                icon: <Keyboard className="w-5 h-5"/>
            },
            {
                id: 'bughunt' as GameType,
                title: t('gameTypes.bughunt.title'),
                description: t('gameTypes.bughunt.subtitle'),
                icon: <Bug className="w-5 h-5"/>
            },
            {
                id: 'wordle' as GameType,
                title: t('gameTypes.wordle.title'),
                description: t('gameTypes.wordle.subtitle'),
                icon: <Code2 className="w-5 h-5"/>
            },
            {
                id: 'mentalcpu' as GameType,
                title: t('gameTypes.mentalcpu.title'),
                description: t('gameTypes.mentalcpu.subtitle'),
                icon: <SquareFunction className="w-5 h-5"/>
            },
            {
                id: 'regexrush' as GameType,
                title: t('gameTypes.regexrush.title'),
                description: t('gameTypes.regexrush.subtitle'),
                icon: <Regex className="w-5 h-5"/>
            },
            {
                id: 'httpdetective' as GameType,
                title: t('gameTypes.httpdetective.title'),
                description: t('gameTypes.httpdetective.subtitle'),
                icon: <Globe className="w-5 h-5"/>
            },
            {
                id: 'sqlsleuth' as GameType,
                title: t('gameTypes.sqlsleuth.title'),
                description: t('gameTypes.sqlsleuth.subtitle'),
                icon: <Database className="w-5 h-5"/>
            }
        ],
        [t]
    );

    const totalPages = Math.max(1, Math.ceil(games.length / itemsPerPage));

    const pageParam = searchParams.get('page');
    const hasPageParam = searchParams.has('page');
    const parsed = pageParam ? Number.parseInt(pageParam, 10) : 1;
    const pageFromUrl = Number.isFinite(parsed) && parsed >= 1 ? parsed : 1;
    const currentPage = Math.min(pageFromUrl, totalPages);

    const setPageInUrl = useCallback(
        (p: number) => {
            const nextPage = Math.max(1, Math.min(totalPages, p));
            const params = new URLSearchParams(searchParams.toString());
            params.set('page', String(nextPage));
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        },
        [pathname, router, searchParams, totalPages]
    );

    useEffect(() => {
        if (!hasPageParam || pageFromUrl !== currentPage) {
            setPageInUrl(currentPage);
        }
    }, [currentPage, hasPageParam, pageFromUrl, setPageInUrl]);

    const pagedGames = useMemo(() => {
        const start = (
                          currentPage - 1
                      ) * itemsPerPage;
        return games.slice(start, start + itemsPerPage);
    }, [games, currentPage, itemsPerPage]);

    const pageItems = useMemo(() => buildPagination(currentPage, totalPages), [currentPage, totalPages]);

    const toggleGame = useCallback(
        (gameId: GameType) => {
            const params = new URLSearchParams(searchParams.toString());
            if (activeGame === gameId) {
                params.delete('id');
            } else {
                params.set('id', gameId);
            }
            params.set('page', String(currentPage));
            const qs = params.toString();
            router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
        },
        [activeGame, currentPage, pathname, router, searchParams]
    );

    const goPrev = useCallback(() => {
        setPageInUrl(currentPage - 1);
    }, [currentPage, setPageInUrl]);

    const goNext = useCallback(() => {
        setPageInUrl(currentPage + 1);
    }, [currentPage, setPageInUrl]);

    const goTo = useCallback(
        (p: number) => {
            setPageInUrl(p);
        },
        [setPageInUrl]
    );

    return (
        <>
            <GamesNavigation/>
            <div className="min-h-screen text-foreground">
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
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                            {pagedGames.map((game) => (
                                <GameCard
                                    key={game.id}
                                    title={game.title}
                                    description={game.description}
                                    icon={game.icon}
                                    isActive={activeGame === game.id}
                                    onClick={() => toggleGame(game.id)}
                                />
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <Pagination className="mt-6 mb-10 sm:mb-12 lg:mb-16">
                                <PaginationContent>
                                    <PaginationItem>
                                        <PaginationPrevious
                                            href="#"
                                            className={cn(currentPage === 1 && 'pointer-events-none opacity-50')}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                goPrev();
                                            }}
                                        />
                                    </PaginationItem>

                                    {pageItems.map((it, idx2) => (
                                        <PaginationItem key={`${it}-${idx2}`}>
                                            {it === 'ellipsis' ? (
                                                <PaginationEllipsis/>
                                            ) : (
                                                <PaginationLink
                                                    href="#"
                                                    isActive={it === currentPage}
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        goTo(it);
                                                    }}
                                                >
                                                    {it}
                                                </PaginationLink>
                                            )}
                                        </PaginationItem>
                                    ))}

                                    <PaginationItem>
                                        <PaginationNext
                                            href="#"
                                            className={cn(currentPage === totalPages
                         && 'pointer-events-none opacity-50')}
                                            onClick={(e) => {
                                                e.preventDefault();
                                                goNext();
                                            }}
                                        />
                                    </PaginationItem>
                                </PaginationContent>
                            </Pagination>
                        )}

                        {activeGame && (
                            <div className="min-h-100 mt-10 sm:mt-12 lg:mt-16">
                                {activeGame === 'quiz' && <Quiz/>}
                                {activeGame === 'memory' && <MemoryGame/>}
                                {activeGame === 'typing' && <TypingSpeed/>}
                                {activeGame === 'bughunt' && <BugHunt/>}
                                {activeGame === 'wordle' && <TechWordle/>}
                                {activeGame === 'mentalcpu' && <MentalCpu/>}
                                {activeGame === 'regexrush' && <RegexRush/>}
                                {activeGame === 'httpdetective' && <HttpDetective/>}
                                {activeGame === 'sqlsleuth' && <SqlSleuth/>}
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </>
    );
}