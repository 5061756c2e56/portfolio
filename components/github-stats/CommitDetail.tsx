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

import { useTranslations } from 'next-intl';
import { Calendar, ExternalLink, FileText, GitCommit, Minus, Plus, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { CommitDetail as CommitDetailType } from '@/lib/github/types';
import { Spinner } from '@/components/ui/spinner';

interface CommitDetailPanelProps {
    commit: CommitDetailType | null;
    isLoading: boolean;
}

interface CommitMessageListItem {
    text: string;
    children: string[];
}

type CommitMessageBlock =
    | {
          type: 'paragraph';
          text: string;
      }
    | {
          type: 'list';
          items: CommitMessageListItem[];
      };

function parseCommitMessageBody(body: string): CommitMessageBlock[] {
    const blocks: CommitMessageBlock[] = [];
    const lines = body.replace(/\r\n/g, '\n').split('\n');

    let paragraphLines: string[] = [];
    let listLines: Array<{ level: number; text: string }> = [];

    const flushParagraph = () => {
        if (paragraphLines.length === 0) return;
        blocks.push({
            type: 'paragraph',
            text: paragraphLines.join(' ')
        });
        paragraphLines = [];
    };

    const flushList = () => {
        if (listLines.length === 0) return;

        const items: CommitMessageListItem[] = [];
        let currentTopItem: CommitMessageListItem | null = null;

        listLines.forEach(({ level, text }) => {
            if (!text) return;

            if (level <= 0 || !currentTopItem) {
                currentTopItem = { text, children: [] };
                items.push(currentTopItem);
                return;
            }

            currentTopItem.children.push(text);
        });

        if (items.length > 0) {
            blocks.push({
                type: 'list',
                items
            });
        }

        listLines = [];
    };

    lines.forEach((line) => {
        const bulletMatch = line.match(/^(\s*)-\s+(.*)$/);

        if (bulletMatch) {
            flushParagraph();

            const spaces = bulletMatch[1].replace(/\t/g, '  ').length;
            const level = Math.max(0, Math.floor(spaces / 2));
            const text = bulletMatch[2].trim();

            listLines.push({ level, text });
            return;
        }

        if (line.trim() === '') {
            flushParagraph();
            flushList();
            return;
        }

        flushList();
        paragraphLines.push(line.trim());
    });

    flushParagraph();
    flushList();

    return blocks;
}

export function CommitDetailPanel({ commit, isLoading }: CommitDetailPanelProps) {
    const t = useTranslations('githubStats.commitDetail');
    const commitBody =
        commit && commit.message !== commit.messageTitle
            ? commit.message.replace(commit.messageTitle, '').trim()
            : '';
    const commitBodyBlocks = commitBody
        ? parseCommitMessageBody(commitBody)
        : [];

    if (isLoading) {
        return (
            <div className={cn(
                'rounded-xl border border-blue-500/20 bg-card/80 backdrop-blur-sm',
                'p-8 flex flex-col items-center justify-center min-h-[200px]',
                'shadow-[0_0_30px_rgba(59,130,246,0.05)]'
            )}>
                <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-500/20 animate-ping"/>
                    <Spinner className="w-10 h-10 text-blue-500 relative"/>
                </div>
                <p className="text-sm text-muted-foreground mt-4">{t('loading')}</p>
            </div>
        );
    }

    if (!commit) return null;

    return (
        <div className={cn(
            'rounded-xl border border-blue-500/20 bg-card/80 backdrop-blur-sm overflow-hidden',
            'shadow-[0_0_30px_rgba(59,130,246,0.05)]',
            'transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.08)]'
        )}>
            <div className="p-4 sm:p-5 border-b border-blue-500/10 bg-blue-500/5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="p-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <GitCommit className="w-4 h-4 text-blue-500"/>
                            </div>
                            <code
                                className="text-sm font-mono bg-blue-500/10 text-blue-500 px-2.5 py-1 rounded-lg border border-blue-500/20">
                                {commit.shortSha}
                            </code>
                        </div>
                        <p className="font-medium text-base sm:text-lg break-words leading-relaxed">
                            {commit.messageTitle}
                        </p>
                        {commitBodyBlocks.length > 0 && (
                            <div className="mt-3 space-y-3 text-sm text-muted-foreground break-words leading-relaxed">
                                {commitBodyBlocks.map((block, blockIndex) =>
                                    block.type === 'paragraph' ? (
                                        <p key={`paragraph-${blockIndex}`}>
                                            {block.text}
                                        </p>
                                    ) : (
                                        <ul
                                            key={`list-${blockIndex}`}
                                            className="list-disc space-y-1.5 pl-5"
                                        >
                                            {block.items.map(
                                                (item, itemIndex) => (
                                                    <li
                                                        key={`item-${blockIndex}-${itemIndex}`}
                                                    >
                                                        <span>{item.text}</span>
                                                        {item.children.length >
                                                        0 ? (
                                                            <ul className="mt-1 list-disc space-y-1 pl-5">
                                                                {item.children.map(
                                                                    (
                                                                        child,
                                                                        childIndex
                                                                    ) => (
                                                                        <li
                                                                            key={`child-${blockIndex}-${itemIndex}-${childIndex}`}
                                                                        >
                                                                            {
                                                                                child
                                                                            }
                                                                        </li>
                                                                    )
                                                                )}
                                                            </ul>
                                                        ) : null}
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )
                                )}
                            </div>
                        )}
                    </div>

                    {commit.htmlUrl && (
                        <a
                            href={commit.htmlUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className={cn(
                                'shrink-0 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl',
                                'text-sm font-medium text-blue-500',
                                'bg-blue-500/10 hover:bg-blue-500/20',
                                'border border-blue-500/20 hover:border-blue-500/40',
                                'transition-all duration-300',
                                'hover:shadow-[0_0_20px_rgba(59,130,246,0.2)]',
                                'w-full sm:w-auto cursor-pointer select-none'
                            )}
                        >
                            <span>{t('viewOnGithub')}</span>
                            <ExternalLink className="w-4 h-4"/>
                        </a>
                    )}
                </div>
            </div>

            <div className="p-4 sm:p-5">
                <div className="flex flex-wrap gap-x-5 gap-y-3 text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <User className="w-4 h-4 text-blue-500/70 shrink-0"/>
                        <span className="truncate">{commit.author}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4 text-blue-500/70 shrink-0"/>
                        <span>{new Date(commit.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <FileText className="w-4 h-4 text-blue-500/70 shrink-0"/>
                        <span>{t('filesChanged', { count: commit.filesChanged })}</span>
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mt-5 pt-4 border-t border-blue-500/10">
                    <div className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                        'bg-emerald-500/10 border border-emerald-500/20'
                    )}>
                        <Plus className="w-4 h-4 text-emerald-500"/>
                        <span className="font-medium text-emerald-500">{commit.additions.toLocaleString()}</span>
                    </div>
                    <div className={cn(
                        'flex items-center gap-2 px-3 py-1.5 rounded-lg',
                        'bg-rose-500/10 border border-rose-500/20'
                    )}>
                        <Minus className="w-4 h-4 text-rose-500"/>
                        <span className="font-medium text-rose-500">{commit.deletions.toLocaleString()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
