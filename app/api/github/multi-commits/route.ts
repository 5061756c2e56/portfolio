import { NextRequest, NextResponse } from 'next/server';
import { getCommitsList } from '@/lib/github/api';
import { getTTLForRange } from '@/lib/github/cache';
import { addSecurityHeaders, validateRequest } from '@/lib/github/security';
import { getStartDateForRange } from '@/lib/github/utils';
import { getCommitsFromDB, isDatabaseConfigured } from '@/lib/github/db-queries';
import {
    ALLOWED_REPOSITORIES, CommitItem, GitHubAPIError, isAllowedRepository, Repository, TimeRange
} from '@/lib/github/types';

interface RepoParam {
    owner: string;
    name: string;
}

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

const VALID_RANGES: TimeRange[] = ['7d', '30d', '6m', '12m'];

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
    const cacheKey = `github:multi-commits:${repo.owner}:${repo.name}:${startDate}`;

    try {
        const allCommits = await fetchAllRepoCommits(repo, startDate);

        if (allCommits.length === 0) {
        }

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
    const securityCheck = validateRequest(request);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const reposParam = searchParams.get('repos');
    const range = (
                      searchParams.get('range') as TimeRange
                  ) || '12m';
    const searchQuery = searchParams.get('q') || '';

    if (!VALID_RANGES.includes(range)) {
        return addSecurityHeaders(NextResponse.json(
            { error: 'Période invalide', code: 'INVALID_RANGE' },
            { status: 400 }
        ), securityCheck.rateLimitRemaining);
    }

    let repos: RepoParam[] = [];

    if (reposParam) {
        try {
            repos = JSON.parse(reposParam) as RepoParam[];
        } catch {
            return addSecurityHeaders(NextResponse.json(
                { error: 'Paramètre repos invalide', code: 'INVALID_PARAMS' },
                { status: 400 }
            ), securityCheck.rateLimitRemaining);
        }
    } else {
        repos = ALLOWED_REPOSITORIES.map(r => (
            { owner: r.owner, name: r.name }
        ));
    }

    const validRepos = repos
        .filter(r => isAllowedRepository(r.owner, r.name))
        .map(r => {
            const config = ALLOWED_REPOSITORIES.find(
                ar => ar.owner === r.owner && ar.name === r.name
            );
            return {
                owner: r.owner,
                name: r.name,
                displayName: config?.displayName || r.name
            };
        });

    if (validRepos.length === 0) {
        return addSecurityHeaders(NextResponse.json(
            { error: 'Aucun dépôt valide fourni', code: 'INVALID_REPOS' },
            { status: 400 }
        ), securityCheck.rateLimitRemaining);
    }

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
                    'Cache-Control': `public, s-maxage=${getTTLForRange(range)}, stale-while-revalidate`,
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

        return addSecurityHeaders(NextResponse.json(response, {
            headers: {
                'Cache-Control': `public, s-maxage=${getTTLForRange(range)}, stale-while-revalidate`,
                'X-Data-Source': 'github-api'
            }
        }), securityCheck.rateLimitRemaining);

    } catch (error) {
        console.error('[Multi-commits API] Error:', error);

        if (error instanceof GitHubAPIError) {
            if (error.statusCode === 401) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'Configuration GitHub manquante', code: 'UNAUTHORIZED' },
                    { status: 401 }
                ), securityCheck.rateLimitRemaining);
            }
            if (error.statusCode === 403) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'Rate limit GitHub atteint', code: 'RATE_LIMIT', retryAfter: error.rateLimitReset },
                    { status: 429 }
                ), securityCheck.rateLimitRemaining);
            }
        }

        return addSecurityHeaders(NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        ), securityCheck.rateLimitRemaining);
    }
}
