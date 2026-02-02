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
import { ArrowDownWideNarrow, ArrowUpNarrowWide, GitBranch, GitCommit, Hash, Loader2, Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommitDetail, Repository, TimeRange, VALID_TIME_RANGES } from '@/lib/github/types';
import { CommitDetailPanel } from './CommitDetail';
import { PeriodSelector } from './PeriodSelector';
import { Spinner } from '@/components/ui/spinner';

interface MultiRepoCommitItem {
    sha: string;
    shortSha: string;
    message: string;
    messageTitle: string;
    date: string;
    author: string;
    authorAvatar?: string;
    repoOwner: string;
    repoName: string;
    repoDisplayName: string;
}

interface MultiRepoCommitsResponse {
    commitsByRepo: Record<
        string,
        {
            displayName: string;
            commits: MultiRepoCommitItem[];
            total: number;
        }
    >;
    allCommits: MultiRepoCommitItem[];
    total: number;
}

interface MultiRepoCommitSearchProps {
    selectedRepos: Repository[];
}

type SelectedCommitRef = { owner: string; name: string; sha: string } | null;

export function MultiRepoCommitSearch({ selectedRepos }: MultiRepoCommitSearchProps) {
    const t = useTranslations('githubStats.search');

    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [commitsData, setCommitsData] = useState<MultiRepoCommitsResponse | null>(null);

    const [selectedCommit, setSelectedCommit] = useState<CommitDetail | null>(null);
    const [selectedCommitRef, setSelectedCommitRef] = useState<SelectedCommitRef>(null);
    const [commitDetailLoading, setCommitDetailLoading] = useState(false);

    const [expandedRepos, setExpandedRepos] = useState<string[]>([]);
    const [selectedRange, setSelectedRange] = useState<TimeRange>('7d');
    const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

    const searchTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const fetchCommits = useCallback(
        async (query: string = '', range: TimeRange = selectedRange) => {
            if (selectedRepos.length === 0) return;

            setIsLoading(true);

            try {
                const reposParam = selectedRepos.map((r) => (
                    { owner: r.owner, name: r.name }
                ));

                const url = new URL('/api/github/multi-commits', window.location.origin);
                url.searchParams.set('repos', JSON.stringify(reposParam));
                url.searchParams.set('range', range);

                if (query) url.searchParams.set('q', query);

                const response = await fetch(url.toString(), { cache: 'no-store' });
                if (!response.ok) throw new Error('Failed to fetch commits');

                const data: MultiRepoCommitsResponse = await response.json();
                setCommitsData(data);
            } catch (error) {
                console.error('Error fetching commits:', error);
                setCommitsData(null);
            } finally {
                setIsLoading(false);
            }
        },
        [selectedRepos, selectedRange]
    );

    useEffect(() => {
        if (selectedRepos.length > 0) {
            void fetchCommits(searchQuery, selectedRange);
        } else {
            setCommitsData(null);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedRepos, selectedRange]);

    const handleRangeChange = (range: TimeRange) => {
        setSelectedRange(range);
    };

    const handleSearchChange = (value: string) => {
        const sanitized = value.replace(/[^a-zA-Z0-9:/@-]/g, '');
        setSearchQuery(sanitized);

        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
            void fetchCommits(sanitized, selectedRange);
        }, 300);
    };

    const handleSelectCommit = async (commit: MultiRepoCommitItem) => {
        setCommitDetailLoading(true);
        setSelectedCommit(null);
        setSelectedCommitRef({ owner: commit.repoOwner, name: commit.repoName, sha: commit.sha });
        setExpandedRepos([]);

        try {
            const response = await fetch(
                `/api/github/commit/${commit.sha}?owner=${encodeURIComponent(commit.repoOwner)}&repo=${encodeURIComponent(
                    commit.repoName
                )}`
            );

            if (!response.ok) throw new Error('Failed to fetch commit details');

            const data: CommitDetail = await response.json();
            setSelectedCommit(data);
        } catch (error) {
            console.error('Error fetching commit details:', error);
        } finally {
            setCommitDetailLoading(false);
        }
    };

    const handleClearSelection = () => {
        setSelectedCommit(null);
        setSelectedCommitRef(null);
        setSearchQuery('');
    };

    const toggleRepoExpanded = (repoName: string) => {
        setExpandedRepos((prev) => (
            prev.includes(repoName) ? prev.filter((r) => r !== repoName) : [...prev, repoName]
        ));
    };

    const getFilteredCommits = (commits: MultiRepoCommitItem[]) => {
        let filtered = [...commits];

        if (searchQuery) {
            const q = searchQuery.toLowerCase();
            filtered = filtered.filter((c) => c.sha.toLowerCase().startsWith(q)
                                              || c.shortSha.toLowerCase().startsWith(q));
        }

        filtered.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
        });

        return filtered.slice(0, 50);
    };

    return (
        <div className="rounded-2xl border border-blue-500/10 bg-card/50 overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-blue-500/10 bg-blue-500/5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="p-2 rounded-xl bg-blue-500/10 border border-blue-500/20">
                            <Search className="w-4 h-4 text-blue-500"/>
                        </div>
                        <div>
                            <h3 className="font-medium">{t('title')}</h3>
                            <p className="text-xs text-muted-foreground mt-0.5">{t('placeholder')}</p>
                        </div>
                    </div>

                    <div className="w-full sm:w-auto flex flex-col sm:flex-row sm:items-center gap-2">
                        <div className="w-full sm:w-auto">
                            <PeriodSelector
                                selectedRange={selectedRange}
                                availablePeriods={[...VALID_TIME_RANGES]}
                                onRangeChange={handleRangeChange}
                                isLoading={isLoading}
                            />
                        </div>

                        {selectedCommitRef && !commitDetailLoading && (
                            <button
                                type="button"
                                onClick={handleClearSelection}
                                className={cn(
                                    'w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2',
                                    'border-blue-500/20 bg-blue-500/5',
                                    'text-sm font-medium text-muted-foreground',
                                    'hover:text-blue-500 hover:bg-blue-500/10 hover:border-blue-500/40',
                                    'transition-all duration-200'
                                )}
                            >
                                <X className="w-4 h-4"/>
                                <span>{t('clearSelection')}</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>

            <div className="p-4 sm:p-6 space-y-4">
                <div className="relative">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500/50"/>
                    <input
                        type="text"
                        placeholder={t('placeholder')}
                        value={searchQuery}
                        onChange={(e) => handleSearchChange(e.target.value)}
                        className={cn(
                            'w-full pl-10 pr-10 py-3 rounded-xl',
                            'border border-blue-500/20 bg-background/50',
                            'text-sm font-mono',
                            'placeholder:text-muted-foreground placeholder:font-sans',
                            'focus:outline-none focus:border-blue-500/50 focus:shadow-[0_0_15px_rgba(59,130,246,0.1)]',
                            'transition-all duration-300'
                        )}
                    />
                    {isLoading && <Loader2
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 animate-spin text-blue-500"/>}
                </div>

                {isLoading && !commitsData ? (
                    <div className="p-8 text-center">
                        <Spinner className="w-6 h-6 text-blue-500 mx-auto mb-2"/>
                        <span className="text-sm text-muted-foreground">{t('loading')}</span>
                    </div>
                ) : commitsData && Object.keys(commitsData.commitsByRepo).length > 0 ? (
                    <div className="space-y-2">
                        {Object.entries(commitsData.commitsByRepo).map(([repoName, repoData]) => {
                            const filteredCommits = getFilteredCommits(repoData.commits);
                            const isRepoExpanded = expandedRepos.includes(repoName);

                            if (filteredCommits.length === 0 && searchQuery) return null;

                            return (
                                <div key={repoName} className="rounded-xl border border-blue-500/10 overflow-hidden">
                                    <div
                                        className={cn(
                                            'w-full flex items-center justify-between gap-3 px-4 py-3',
                                            'text-left transition-all duration-200',
                                            isRepoExpanded && 'bg-blue-500/5 border-b border-blue-500/10'
                                        )}
                                    >
                                        <button
                                            type="button"
                                            onClick={() => toggleRepoExpanded(repoName)}
                                            className="flex items-center gap-3 flex-1 min-w-0 hover:opacity-80 transition-opacity"
                                        >
                                            <GitBranch className="w-4 h-4 text-blue-500 shrink-0"/>
                                            <span className="font-medium truncate">{repoData.displayName}</span>
                                            <span
                                                className="text-xs text-muted-foreground px-2 py-0.5 rounded-full bg-blue-500/10 shrink-0">
                                                {filteredCommits.length} commit{filteredCommits.length > 1 ? 's' : ''}
                                            </span>
                                            <span className={cn('text-xs text-muted-foreground ml-auto', isRepoExpanded
                                                                                                         && 'text-blue-500')}>
                                                {isRepoExpanded ? '—' : '+'}
                                            </span>
                                        </button>
                                        {isRepoExpanded && (
                                            <button
                                                type="button"
                                                onClick={() => setSortOrder(sortOrder
                                                                            === 'newest' ? 'oldest' : 'newest')}
                                                className={cn(
                                                    'flex items-center gap-1.5 px-2 py-1 rounded-lg text-xs shrink-0',
                                                    'border border-blue-500/20 bg-blue-500/5',
                                                    'hover:bg-blue-500/10 hover:border-blue-500/40',
                                                    'transition-all duration-200'
                                                )}
                                                title={sortOrder === 'newest' ? t('sortOldest') : t('sortNewest')}
                                            >
                                                {sortOrder === 'newest' ? (
                                                    <ArrowDownWideNarrow className="w-3.5 h-3.5 text-blue-500"/>
                                                ) : (
                                                    <ArrowUpNarrowWide className="w-3.5 h-3.5 text-blue-500"/>
                                                )}
                                                <span className="text-muted-foreground hidden sm:inline">
                                                    {sortOrder === 'newest' ? t('sortNewest') : t('sortOldest')}
                                                </span>
                                            </button>
                                        )}
                                    </div>

                                    <div
                                        className={cn('overflow-hidden transition-all duration-300 ease-in-out', isRepoExpanded ? 'max-h-96' : 'max-h-0')}>
                                        <div className="max-h-80 overflow-auto scrollbar-custom scrollbar-autohide">
                                            {filteredCommits.length === 0 ? (
                                                <div
                                                    className="p-4 text-center text-muted-foreground text-sm">{t('noResults')}</div>
                                            ) : (
                                                <ul>
                                                    {filteredCommits.map((commit, index) => {
                                                        const isSelected =
                                                            selectedCommitRef?.sha === commit.sha &&
                                                            selectedCommitRef?.owner === commit.repoOwner &&
                                                            selectedCommitRef?.name === commit.repoName;

                                                        return (
                                                            <li key={`${commit.repoOwner}/${commit.repoName}@${commit.sha}`}>
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleSelectCommit(commit)}
                                                                    className={cn(
                                                                        'w-full px-4 py-3 text-left transition-all duration-200 flex items-start gap-3',
                                                                        'hover:bg-blue-500/10',
                                                                        isSelected && 'bg-blue-500/10',
                                                                        index !== filteredCommits.length - 1
                                                                        && 'border-b border-border/50'
                                                                    )}
                                                                >
                                                                    <GitCommit
                                                                        className="w-4 h-4 mt-0.5 text-blue-500 shrink-0"/>
                                                                    <div className="min-w-0 flex-1">
                                                                        <div
                                                                            className="flex items-center gap-2 flex-wrap">
                                                                            <code
                                                                                className="text-xs bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded font-mono border border-blue-500/20">
                                                                                {commit.shortSha}
                                                                            </code>
                                                                            <span
                                                                                className="text-xs text-muted-foreground">
                                        {new Date(commit.date).toLocaleDateString()}
                                      </span>
                                                                        </div>
                                                                        <p className="text-sm truncate mt-1.5 text-foreground/80">{commit.messageTitle}</p>
                                                                    </div>
                                                                </button>
                                                            </li>
                                                        );
                                                    })}
                                                </ul>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="p-8 text-center text-muted-foreground text-sm">{t('noResults')}</div>
                )}

                {(
                     selectedCommit || commitDetailLoading
                 ) && <CommitDetailPanel commit={selectedCommit} isLoading={commitDetailLoading}/>}
            </div>
        </div>
    );
}