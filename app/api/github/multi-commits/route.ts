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

import { NextRequest, NextResponse } from 'next/server';
import { getCommitsList } from '@/lib/github/api';
import { getTTLForRange } from '@/lib/github/cache';
import { apiError } from '@/lib/github/errors';
import { addSecurityHeaders, createJsonResponse, validateRequest } from '@/lib/github/security';
import { parseMultiRepoQueryParams } from '@/lib/github/route-params';
import { getStartDateForRange } from '@/lib/github/utils';
import { getCommitsFromDB, isDatabaseConfigured } from '@/lib/github/db-queries';
import { ALLOWED_REPOSITORIES, CommitItem, GitHubAPIError, Repository } from '@/lib/github/types';

export interface MultiRepoCommitItem extends CommitItem {
    repoOwner: string;
    repoName: string;
    repoDisplayName: string;
}

export interface MultiRepoCommitsResponse {
    commitsByRepo: Record<string, {
        displayName: string;
        commits: MultiRepoCommitItem[];
        total: number;
    }>;
    allCommits: MultiRepoCommitItem[];
    total: number;
}

async function fetchAllRepoCommits(
    repo: Repository,
    startDate: string
): Promise<CommitItem[]> {
    const allCommits: CommitItem[] = [];
    let page = 1;
    let hasMore = true;
    const maxPages = 20;

    while (hasMore && page <= maxPages) {
        try {
            const result = await getCommitsList(repo.owner, repo.name, startDate, undefined, page, 100);

            if (result.commits.length === 0) {
                break;
            }

            allCommits.push(...result.commits);
            hasMore = result.hasMore;
            page++;
        } catch (error) {
            console.error(`[Multi-commits] Error fetching page ${page} for ${repo.name}:`, error);
            break;
        }
    }

    return allCommits;
}

async function fetchRepoCommits(
    repo: Repository,
    startDate: string,
    searchQuery?: string
): Promise<MultiRepoCommitItem[]> {
    try {
        const allCommits = await fetchAllRepoCommits(repo, startDate);

        let commits = allCommits.map(c => (
            {
                ...c,
                repoOwner: repo.owner,
                repoName: repo.name,
                repoDisplayName: repo.displayName || repo.name
            }
        ));

        if (searchQuery && searchQuery.length >= 1) {
            commits = commits.filter(c =>
                c.sha.toLowerCase().startsWith(searchQuery.toLowerCase()) ||
                c.shortSha.toLowerCase().startsWith(searchQuery.toLowerCase())
            );
        }

        return commits;
    } catch (error) {
        console.error(`[Multi-commits] Error fetching ${repo.name}:`, error);
        return [];
    }
}

export async function GET(request: NextRequest) {
    const securityCheck = await validateRequest(request);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    const parsed = parseMultiRepoQueryParams(request, { defaultRange: '12m' });
    if (!parsed.ok) {
        return addSecurityHeaders(parsed.response, securityCheck.rateLimitRemaining);
    }
    const { repos: validReposParam, range } = parsed;

    const validRepos = validReposParam.map(r => {
        const config = ALLOWED_REPOSITORIES.find(ar => ar.owner === r.owner && ar.name === r.name);
        return {
            owner: r.owner,
            name: r.name,
            displayName: config?.displayName || r.name
        };
    });

    const rawQ = new URL(request.url).searchParams.get('q') || '';
    const searchQuery = rawQ.length > 128 ? rawQ.slice(0, 128) : rawQ;

    try {
        const useDB = await isDatabaseConfigured();

        if (useDB) {
            const dbResult = await getCommitsFromDB(validRepos, range, searchQuery || undefined);

            const response: MultiRepoCommitsResponse = {
                commitsByRepo: dbResult.commitsByRepo,
                allCommits: dbResult.allCommits.slice(0, 100),
                total: dbResult.total
            };

            return addSecurityHeaders(NextResponse.json(response, {
                headers: {
                    'Cache-Control': 'no-store, no-cache, must-revalidate',
                    'X-Data-Source': 'database'
                }
            }), securityCheck.rateLimitRemaining);
        }

        const startDate = ['6m', '12m'].includes(range)
            ? new Date('2020-01-01')
            : getStartDateForRange(range);

        const results = await Promise.all(
            validRepos.map(repo => fetchRepoCommits(repo, startDate.toISOString(), searchQuery))
        );

        const commitsByRepo: Record<string, {
            displayName: string;
            commits: MultiRepoCommitItem[];
            total: number;
        }> = {};

        const allCommits: MultiRepoCommitItem[] = [];

        validRepos.forEach((repo, index) => {
            const repoCommits = results[index];
            commitsByRepo[repo.name] = {
                displayName: repo.displayName || repo.name,
                commits: repoCommits,
                total: repoCommits.length
            };
            allCommits.push(...repoCommits);
        });

        allCommits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        const response: MultiRepoCommitsResponse = {
            commitsByRepo,
            allCommits: allCommits.slice(0, 100),
            total: allCommits.length
        };

        return createJsonResponse(response, {
            headers: {
                'Cache-Control': `public, s-maxage=${getTTLForRange(range)}, stale-while-revalidate`,
                'X-Data-Source': 'github-api'
            }
        }, securityCheck);

    } catch (error) {
        console.error('[Multi-commits API] Error:', error);

        if (error instanceof GitHubAPIError) {
            if (error.statusCode === 401) {
                const { payload, status } = apiError('UNAUTHORIZED', { message: 'GitHub configuration error' });
                return createJsonResponse(payload, { status }, securityCheck);
            }
            if (error.statusCode === 403) {
                const { payload, status } = apiError('RATE_LIMIT', {
                    message: 'GitHub rate limit reached',
                    retryAfter: error.rateLimitReset
                });
                return createJsonResponse(payload, { status }, securityCheck);
            }
        }

        const { payload, status } = apiError('SERVER_ERROR');
        return createJsonResponse(payload, { status }, securityCheck);
    }
}
