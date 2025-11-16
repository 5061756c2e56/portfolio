'use client';

import React, { useMemo } from 'react';

interface FormattedTextProps {
    text: string;
    className?: string;
}

export default function FormattedText({
    text,
    className = ''
}: FormattedTextProps) {
    const formattedContent = useMemo(() => {
        let key = 0;

        const formatInlineText = (
            inlineText: string,
            inlinePatterns: Array<{ regex: RegExp; component: (match: string, key: number) => React.ReactNode }>,
            startKey: number
        ): React.ReactNode[] => {
            const parts: React.ReactNode[] = [];
            let inlineKey = startKey;
            const matches: Array<{ start: number; end: number; component: React.ReactNode; priority: number }> = [];

            inlinePatterns.forEach(({
                regex,
                component
            }, priority) => {
                let match;
                regex.lastIndex = 0;
                while ((match = regex.exec(inlineText)) !== null) {
                    matches.push({
                        start: match.index,
                        end: match.index + match[0].length,
                        component: component(match[1], inlineKey++),
                        priority
                    });
                }
            });

            matches.sort((a, b) => {
                if (a.start !== b.start) return a.start - b.start;
                return a.priority - b.priority;
            });

            const usedRanges: Array<{ start: number; end: number }> = [];
            const validMatches = matches.filter(match => {
                const overlaps = usedRanges.some(range =>
                    (match.start < range.end && match.end > range.start)
                );
                if (!overlaps) {
                    usedRanges.push({
                        start: match.start,
                        end: match.end
                    });
                    return true;
                }
                return false;
            });

            let currentIndex = 0;
            validMatches.forEach((match) => {
                if (match.start > currentIndex) {
                    parts.push(
                        <span key={`text-${inlineKey++}`}>
                            {inlineText.substring(currentIndex, match.start)}
                        </span>
                    );
                }
                parts.push(match.component);
                currentIndex = match.end;
            });

            if (currentIndex < inlineText.length) {
                parts.push(
                    <span key={`text-${inlineKey++}`}>
                        {inlineText.substring(currentIndex)}
                    </span>
                );
            }

            return parts.length > 0 ? parts : [<span key={`text-${inlineKey}`}>{inlineText}</span>];
        };

        const patterns = [
            {
                regex: /\*\*(.*?)\*\*/g,
                component: (match: string, matchKey: number) => (
                    <strong key={matchKey} className="font-semibold text-foreground">
                        {match}
                    </strong>
                )
            },
            {
                regex: /\*(.*?)\*/g,
                component: (match: string, matchKey: number) => (
                    <em key={matchKey} className="italic text-foreground/90">
                        {match}
                    </em>
                )
            },
            {
                regex: /`(.*?)`/g,
                component: (match: string, matchKey: number) => (
                    <code
                        key={matchKey}
                        className="px-1.5 py-0.5 rounded-md bg-muted/80 text-foreground text-xs sm:text-sm font-mono border border-border/50"
                    >
                        {match}
                    </code>
                )
            }
        ];

        const lines = text.split('\n');
        const processedLines: React.ReactNode[] = [];

        lines.forEach((line, lineIndex) => {
            const trimmedLine = line.trim();

            if (trimmedLine === '') {
                if (lineIndex > 0 && lineIndex < lines.length - 1) {
                    processedLines.push(<div key={`empty-${key++}`} className="h-2"/>);
                }
                return;
            }

            if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
                const listContent = trimmedLine.substring(1).trim();
                processedLines.push(
                    <div key={`list-${key++}`} className="flex items-start gap-2.5 my-1.5">
                        <span className="text-primary font-semibold mt-0.5 flex-shrink-0">•</span>
                        <span className="flex-1">{formatInlineText(listContent, patterns, key)}</span>
                    </div>
                );
                return;
            }

            processedLines.push(
                <p key={`para-${key++}`} className="mb-2 last:mb-0">
                    {formatInlineText(trimmedLine, patterns, key)}
                </p>
            );
        });

        return processedLines;
    }, [text]);

    return (
        <div className={className}>
            {formattedContent}
        </div>
    );
}