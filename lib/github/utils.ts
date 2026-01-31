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

import {
    CodePoint, CommitItem, GitHubCodeFrequency, GitHubCommitActivity, Granularity, PERIOD_CONFIGS, TimelinePoint,
    TimeRange, VALID_TIME_RANGES
} from './types';

export function getStartDateForRange(range: TimeRange): Date {
    const now = new Date();
    const days = PERIOD_CONFIGS[range].days;
    return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

export function formatDateLabel(
    date: Date | string,
    granularity: Granularity,
    locale: string = 'fr'
): string {
    const d = typeof date === 'string' ? new Date(date) : date;

    if (granularity === 'daily') {
        return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
            weekday: 'short',
            day: 'numeric'
        });
    }

    return d.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        year: '2-digit'
    });
}

export function transformCommitActivity(
    data: GitHubCommitActivity[],
    range: TimeRange,
    locale: string = 'fr'
): TimelinePoint[] {
    const config = PERIOD_CONFIGS[range];
    const startDate = getStartDateForRange(range);
    const granularity = config.granularity;

    if (granularity === 'weekly') {
        return data
            .filter(week => {
                const weekDate = new Date(week.week * 1000);
                return weekDate >= startDate;
            })
            .map(week => {
                const weekDate = new Date(week.week * 1000);
                return {
                    date: weekDate.toISOString(),
                    commits: week.total,
                    label: formatDateLabel(weekDate, 'weekly', locale)
                };
            });
    }

    const dailyPoints: TimelinePoint[] = [];

    data.forEach(week => {
        const weekStartDate = new Date(week.week * 1000);

        week.days.forEach((commits, dayIndex) => {
            const dayDate = new Date(weekStartDate);
            dayDate.setDate(dayDate.getDate() + dayIndex);

            if (dayDate >= startDate && dayDate <= new Date()) {
                dailyPoints.push({
                    date: dayDate.toISOString(),
                    commits,
                    label: formatDateLabel(dayDate, 'daily', locale)
                });
            }
        });
    });

    return dailyPoints.sort((a, b) =>
        new Date(a.date).getTime() - new Date(b.date).getTime()
    );
}

export function transformCodeFrequency(
    data: GitHubCodeFrequency,
    range: TimeRange,
    locale: string = 'fr'
): CodePoint[] {
    const config = PERIOD_CONFIGS[range];
    const startDate = getStartDateForRange(range);
    const granularity = config.granularity;

    const filtered = data.filter(([timestamp]) => {
        const date = new Date(timestamp * 1000);
        return date >= startDate;
    });

    return filtered.map(([timestamp, additions, deletions]) => {
        const date = new Date(timestamp * 1000);
        const absAdditions = Math.abs(additions);
        const absDeletions = Math.abs(deletions);
        return {
            date: date.toISOString(),
            additions: absAdditions,
            deletions: absDeletions,
            changes: absAdditions + absDeletions,
            label: formatDateLabel(date, granularity, locale)
        };
    });
}

export function getAvailablePeriods(
    _oldestCommitDate: string,
    dataPoints: number
): TimeRange[] {
    if (dataPoints === 0) {
        return ['7d'];
    }
    return [...VALID_TIME_RANGES];
}

export function getDefaultPeriod(availablePeriods: TimeRange[]): TimeRange {
    const priority: TimeRange[] = ['12m', '6m', '30d', '7d'];

    for (const period of priority) {
        if (availablePeriods.includes(period)) {
            return period;
        }
    }

    return '7d';
}

export function filterCommitsBySearch(
    commits: CommitItem[],
    query: string
): CommitItem[] {
    if (!query.trim()) return commits;

    const lowerQuery = query.toLowerCase().trim();

    return commits.filter(commit => {
        if (commit.sha.toLowerCase().startsWith(lowerQuery)) {
            return true;
        }

        if (commit.message.toLowerCase().includes(lowerQuery)) {
            return true;
        }

        return false;
    });
}

export function getOldestCommitDate(data: GitHubCommitActivity[]): string {
    const oldestWeek = data.find(w => w.total > 0);
    return oldestWeek
        ? new Date(oldestWeek.week * 1000).toISOString()
        : new Date().toISOString();
}
