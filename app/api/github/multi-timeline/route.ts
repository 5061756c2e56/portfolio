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

import { NextRequest } from 'next/server';
import { getCommitActivity } from '@/lib/github/api';
import { getTTLForRange, withCache } from '@/lib/github/cache';
import { apiError } from '@/lib/github/errors';
import { addSecurityHeaders, createJsonResponse, validateRequest } from '@/lib/github/security';
import { parseMultiRepoQueryParams } from '@/lib/github/route-params';
import { getTimelineFromDB, isDatabaseConfigured } from '@/lib/github/db-queries';
import { transformCommitActivity } from '@/lib/github/utils';
import {
    ALLOWED_REPOSITORIES, GitHubAPIError, MultiRepoTimelinePoint, REPO_COLORS, RepoParam, RepoTimeline, TimeRange,
    VALID_TIME_RANGES
} from '@/lib/github/types';

function generateCacheKey(repos: RepoParam[], range: TimeRange, locale: string) {
    const repoKeys = repos.map(r => `${r.owner}:${r.name}`).sort().join(',');
    return `github:multi-timeline:${repoKeys}:${range}:${locale}`;
}

export async function GET(request: NextRequest) {
    const securityCheck = await validateRequest(request);
    if (!securityCheck.allowed) return securityCheck.response;

    const parsed = parseMultiRepoQueryParams(request, { defaultRange: '7d', defaultLocale: 'fr' });
    if (!parsed.ok) {
        return addSecurityHeaders(parsed.response, securityCheck.rateLimitRemaining);
    }
    const { repos: validRepos, range, locale } = parsed;

    try {
        const useDB = await isDatabaseConfigured();

        const fetchData = async () => {
            if (useDB) {
                try {
                    const db = await getTimelineFromDB(validRepos, range, locale);
                    const timelines: RepoTimeline[] = db.timelines.map((t, index) => (
                        {
                            repoName: t.repoName,
                            repoDisplayName: t.displayName,
                            color: REPO_COLORS[index % REPO_COLORS.length],
                            data: t.timeline,
                            totalCommits: t.totalCommits
                        }
                    ));
                    const combinedTimeline = db.combinedTimeline as MultiRepoTimelinePoint[];

                    return {
                        timelines,
                        combinedTimeline,
                        availablePeriods: [...VALID_TIME_RANGES],
                        defaultPeriod: '7d' as TimeRange
                    };
                } catch (dbError) {
                    console.warn('[Multi-timeline] DB query failed, falling back to API:', dbError);
                }
            }

            const commitActivities = await Promise.all(
                validRepos.map(r => getCommitActivity(r.owner, r.name).catch(() => []))
            );

            const timelines: RepoTimeline[] = validRepos.map((r, index) => {
                const repoConfig = ALLOWED_REPOSITORIES.find(a => a.owner === r.owner && a.name === r.name);
                const displayName = repoConfig?.displayName || r.name;
                const color = REPO_COLORS[index % REPO_COLORS.length];

                const data = transformCommitActivity(commitActivities[index], range, locale);
                return {
                    repoName: r.name,
                    repoDisplayName: displayName,
                    color,
                    data,
                    totalCommits: data.reduce((s, p) => s + p.commits, 0)
                };
            });

            const dateMap = new Map<string, MultiRepoTimelinePoint>();
            for (const t of timelines) {
                for (const p of t.data) {
                    const existing = dateMap.get(p.date);
                    if (existing) {
                        existing[t.repoName] = p.commits;
                    } else {
                        const pt: MultiRepoTimelinePoint = { date: p.date, label: p.label };
                        pt[t.repoName] = p.commits;
                        dateMap.set(p.date, pt);
                    }
                }
            }
            for (const t of timelines) {
                for (const [, pt] of dateMap) if (pt[t.repoName] === undefined) pt[t.repoName] = 0;
            }
            const combinedTimeline = Array.from(dateMap.values()).sort(
                (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
            );

            return {
                timelines,
                combinedTimeline,
                availablePeriods: [...VALID_TIME_RANGES],
                defaultPeriod: '7d' as TimeRange
            };
        };

        let data: {
            timelines: RepoTimeline[];
            combinedTimeline: MultiRepoTimelinePoint[];
            availablePeriods: TimeRange[];
            defaultPeriod: TimeRange;
        };
        let fromCache = false;

        if (useDB) {
            data = await fetchData();
        } else {
            const cacheKey = generateCacheKey(validRepos, range, locale);
            const result = await withCache(cacheKey, getTTLForRange(range), fetchData);
            data = result.data;
            fromCache = result.fromCache;
        }

        return createJsonResponse(data, {
            headers: {
                'Cache-Control': useDB
                    ? 'no-store, no-cache, must-revalidate'
                    : `public, s-maxage=${getTTLForRange(range)}, stale-while-revalidate`,
                'X-Cache': fromCache ? 'HIT' : 'MISS',
                ...(
                    useDB ? { 'X-Data-Source': 'database' } : {}
                )
            }
        }, securityCheck);
    } catch (e) {
        console.error('[Multi-timeline API] Error:', e);
        const { payload, status } = apiError(
            'SERVER_ERROR',
            e instanceof GitHubAPIError ? { message: e.message } : undefined
        );
        return createJsonResponse(payload, { status }, securityCheck);
    }
}