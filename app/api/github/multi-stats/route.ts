import { NextRequest } from 'next/server';
import { getCodeFrequency, getCommitActivity, getContributors, getLanguages, getRepoInfo } from '@/lib/github/api';
import { transformCommitActivity } from '@/lib/github/utils';
import { getTTLForRange, withCache } from '@/lib/github/cache';
import { apiError } from '@/lib/github/errors';
import { addSecurityHeaders, createJsonResponse, validateRequest } from '@/lib/github/security';
import { parseMultiRepoQueryParams } from '@/lib/github/route-params';
import {
    getCodeTotalsFromDB, getCommitStatsFromDB, getContributorCommitCountsFromDB, getTimelineFromDB, isDatabaseConfigured
} from '@/lib/github/db-queries';
import {
    ALLOWED_REPOSITORIES, CACHE_TTL, Contributor, GitHubAPIError, GitHubCodeFrequency, GitHubCommitActivity,
    LanguageStats, MultiRepoStatsResponse, MultiRepoTimelinePoint, REPO_COLORS, RepoParam, RepoStats, RepoTimeline,
    TimeRange, VALID_TIME_RANGES
} from '@/lib/github/types';

interface RepoDataResult {
    repoName: string;
    displayName: string;
    color: string;
    languages: LanguageStats[];
    contributors: Contributor[];
    commitActivity: GitHubCommitActivity[];
    timeline: { date: string; commits: number; label: string }[];
    timelineCommits: number;
    stats: RepoStats;
}

function generateCacheKey(repos: RepoParam[], range: TimeRange): string {
    const repoKeys = repos.map(r => `${r.owner}:${r.name}`).sort().join(',');
    return `github:multi-stats:${repoKeys}:${range}`;
}

interface RepoDataCache {
    repoName: string;
    displayName: string;
    color: string;
    languages: LanguageStats[];
    commitActivity: GitHubCommitActivity[];
    stats: Omit<RepoStats, 'totalCommits'> & { totalCommits: number };
}

async function fetchRepoDataWithFallback(
    repo: RepoParam,
    index: number,
    range: TimeRange,
    locale: string
): Promise<RepoDataResult | null> {
    const repoConfig = ALLOWED_REPOSITORIES.find(
        r => r.owner === repo.owner && r.name === repo.name
    );
    const displayName = repoConfig?.displayName || repo.name;
    const color = REPO_COLORS[index % REPO_COLORS.length];

    try {
        const repoDataKey = `github:repo-data:${repo.owner}:${repo.name}`;
        const contributorsKey = `github:contributors:${repo.owner}:${repo.name}`;

        const { data: contributors } = await withCache<Contributor[]>(
            contributorsKey,
            CACHE_TTL.contributors,
            () => getContributors(repo.owner, repo.name)
        );

        const { data: cachedRepo } = await withCache<RepoDataCache>(
            repoDataKey,
            CACHE_TTL.stats,
            async () => {
                const [repoInfo, languages] = await Promise.all([
                    getRepoInfo(repo.owner, repo.name),
                    getLanguages(repo.owner, repo.name)
                ]);

                let codeFrequency: GitHubCodeFrequency = [];
                let commitActivity: GitHubCommitActivity[] = [];

                try {
                    codeFrequency = await getCodeFrequency(repo.owner, repo.name);
                } catch (e) {
                    console.warn(`[Multi-stats] Code frequency unavailable for ${repo.name}`, e);
                }
                try {
                    commitActivity = await getCommitActivity(repo.owner, repo.name);
                } catch (e) {
                    console.warn(`[Multi-stats] Commit activity unavailable for ${repo.name}`, e);
                }

                let totalAdditions = 0;
                let totalDeletions = 0;
                if (Array.isArray(codeFrequency)) {
                    for (const week of codeFrequency) {
                        totalAdditions += week[1] || 0;
                        totalDeletions += Math.abs(week[2] || 0);
                    }
                }

                return {
                    repoName: repo.name,
                    displayName,
                    color,
                    languages,
                    commitActivity,
                    stats: {
                        stars: repoInfo.stargazers_count,
                        forks: repoInfo.forks_count,
                        issues: repoInfo.open_issues_count,
                        size: repoInfo.size,
                        lastPush: repoInfo.pushed_at,
                        defaultBranch: repoInfo.default_branch,
                        totalCommits: 0,
                        totalAdditions,
                        totalDeletions
                    }
                };
            }
        );

        if (!cachedRepo) return null;

        const timeline = transformCommitActivity(cachedRepo.commitActivity, range, locale);
        const timelineCommits = timeline.reduce((sum, p) => sum + p.commits, 0);
        const totalCommitsFromContributors = contributors.reduce((sum, c) => sum + c.commits, 0);

        return {
            repoName: cachedRepo.repoName,
            displayName: cachedRepo.displayName,
            color,
            languages: cachedRepo.languages,
            contributors,
            commitActivity: cachedRepo.commitActivity,
            timeline,
            timelineCommits,
            stats: {
                ...cachedRepo.stats,
                totalCommits: totalCommitsFromContributors
            }
        };
    } catch (error) {
        console.error(`[Multi-stats] Error fetching ${repo.name}:`, error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const securityCheck = await validateRequest(request);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    const parsed = parseMultiRepoQueryParams(request, { defaultRange: '12m', defaultLocale: 'fr' });
    if (!parsed.ok) {
        return addSecurityHeaders(parsed.response, securityCheck.rateLimitRemaining);
    }
    const { repos: validRepos, range, locale } = parsed;

    try {
        const cacheKey = generateCacheKey(validRepos, range);

        const useDB = await isDatabaseConfigured();

        const { data: cachedResponse, fromCache } = await withCache<MultiRepoStatsResponse>(
            cacheKey,
            getTTLForRange(range),
            async () => {
                const results = await Promise.all(
                    validRepos.map((repo, index) =>
                        fetchRepoDataWithFallback(repo, index, range, locale)
                    )
                );

                const allResults = results.filter((r): r is RepoDataResult => r !== null);

                if (allResults.length === 0) {
                    throw new GitHubAPIError('No repository data available', 503);
                }

                const aggregatedStats: RepoStats = {
                    stars: allResults.reduce((sum, r) => sum + r.stats.stars, 0),
                    forks: allResults.reduce((sum, r) => sum + r.stats.forks, 0),
                    issues: allResults.reduce((sum, r) => sum + r.stats.issues, 0),
                    size: allResults.reduce((sum, r) => sum + r.stats.size, 0),

                    lastPush: allResults.reduce(
                        (newest, r) => (
                            r.stats.lastPush > newest ? r.stats.lastPush : newest
                        ),
                        allResults[0].stats.lastPush
                    ),
                    defaultBranch: allResults[0].stats.defaultBranch,
                    totalCommits: allResults.reduce((sum, r) => sum + r.stats.totalCommits, 0),

                    totalAdditions: allResults.reduce((sum, r) => sum + r.stats.totalAdditions, 0),
                    totalDeletions: allResults.reduce((sum, r) => sum + r.stats.totalDeletions, 0)
                };

                if (useDB) {
                    try {
                        const [commitStats, codeTotals] = await Promise.all([
                            getCommitStatsFromDB(validRepos, range),
                            getCodeTotalsFromDB(validRepos, range)
                        ]);
                        aggregatedStats.totalCommits = commitStats.totalCommits;
                        aggregatedStats.totalAdditions = codeTotals.additions;
                        aggregatedStats.totalDeletions = codeTotals.deletions;
                    } catch (dbError) {
                        console.warn('[Multi-stats] DB fallback failed, using API stats:', dbError);
                    }
                }

                const languageMap = new Map<string, { bytes: number; color: string }>();
                for (const result of allResults) {
                    for (const lang of result.languages) {
                        const existing = languageMap.get(lang.name);
                        if (existing) {
                            existing.bytes += lang.bytes;
                        } else {
                            languageMap.set(lang.name, { bytes: lang.bytes, color: lang.color });
                        }
                    }
                }
                const totalBytes = Array.from(languageMap.values()).reduce((sum, l) => sum + l.bytes, 0);
                const aggregatedLanguages: LanguageStats[] = Array.from(languageMap.entries())
                                                                  .map(([name, data]) => (
                                                                      {
                                                                          name,
                                                                          bytes: data.bytes,
                                                                          percentage: totalBytes > 0 ? Math.round((
                                                                                                                      data.bytes
                                                                                                                      / totalBytes
                                                                                                                  )
                                                                                                                  * 1000)
                                                                                                       / 10 : 0,
                                                                          color: data.color
                                                                      }
                                                                  ))
                                                                  .sort((a, b) => b.bytes - a.bytes);

                const contributorMap = new Map<string, Contributor>();
                for (const result of allResults) {
                    for (const contrib of result.contributors) {
                        const existing = contributorMap.get(contrib.username);
                        if (existing) {
                            existing.commits += contrib.commits;
                        } else {
                            contributorMap.set(contrib.username, { ...contrib });
                        }
                    }
                }
                let aggregatedContributors: Contributor[] = Array.from(contributorMap.values())
                                                                 .sort((a, b) => b.commits - a.commits)
                                                                 .slice(0, 10);

                if (useDB) {
                    try {
                        const dbContributorCounts = await getContributorCommitCountsFromDB(validRepos, range);
                        const apiUsernames = new Set(aggregatedContributors.map((c) => c.username));
                        const fromApi = aggregatedContributors.map((c) => (
                            {
                                ...c,
                                commits: dbContributorCounts[c.username] ?? 0
                            }
                        ));
                        const fromDbOnly = Object.entries(dbContributorCounts)
                                                 .filter(([login]) => !apiUsernames.has(login))
                                                 .map(([username, commits]) => (
                                                     {
                                                         username,
                                                         avatar: `https://github.com/${username}.png`,
                                                         profileUrl: `https://github.com/${username}`,
                                                         commits
                                                     }
                                                 ));
                        aggregatedContributors = [...fromApi, ...fromDbOnly]
                            .filter((c) => c.commits > 0)
                            .sort((a, b) => b.commits - a.commits)
                            .slice(0, 10);
                    } catch (dbContribError) {
                        console.warn('[Multi-stats] DB contributor counts failed, using API:', dbContribError);
                    }
                }

                let timelines: RepoTimeline[];
                let combinedTimeline: MultiRepoTimelinePoint[];

                if (useDB) {
                    const dbTimelines = await getTimelineFromDB(validRepos, range, locale);

                    timelines = dbTimelines.timelines.map((t, index) => (
                        {
                            repoName: t.repoName,
                            repoDisplayName: t.displayName,
                            color: REPO_COLORS[index % REPO_COLORS.length],
                            data: t.timeline,
                            totalCommits: t.totalCommits
                        }
                    ));

                    combinedTimeline = dbTimelines.combinedTimeline as MultiRepoTimelinePoint[];
                } else {
                    timelines = allResults.map(r => {
                        const data = transformCommitActivity(r.commitActivity, range, locale);

                        return {
                            repoName: r.repoName,
                            repoDisplayName: r.displayName,
                            color: r.color,
                            data,
                            totalCommits: data.reduce((sum, p) => sum + p.commits, 0)
                        };
                    });

                    const dateMap = new Map<string, MultiRepoTimelinePoint>();
                    for (const t of timelines) {
                        for (const point of t.data) {
                            const existing = dateMap.get(point.date);
                            if (existing) {
                                existing[t.repoName] = point.commits;
                            } else {
                                const newPoint: MultiRepoTimelinePoint = {
                                    date: point.date,
                                    label: point.label
                                };
                                newPoint[t.repoName] = point.commits;
                                dateMap.set(point.date, newPoint);
                            }
                        }
                    }

                    for (const t of timelines) {
                        for (const [, point] of dateMap) {
                            if (point[t.repoName] === undefined) point[t.repoName] = 0;
                        }
                    }

                    combinedTimeline = Array.from(dateMap.values()).sort(
                        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                }

                return {
                    stats: aggregatedStats,
                    languages: aggregatedLanguages,
                    contributors: aggregatedContributors,
                    codeChanges: [],
                    timelines,
                    combinedTimeline,
                    availablePeriods: [...VALID_TIME_RANGES],
                    defaultPeriod: '7d' as TimeRange
                };
            }
        );

        const responseData = {
            ...cachedResponse,
            availablePeriods: [...VALID_TIME_RANGES],
            defaultPeriod: '7d' as const
        };

        return createJsonResponse(responseData, {
            headers: {
                'Cache-Control': `public, s-maxage=${getTTLForRange(range)}, stale-while-revalidate`,
                'X-Cache': fromCache ? 'HIT' : 'MISS'
            }
        }, securityCheck);

    } catch (error) {
        console.error('[Multi-stats API] Error:', error);

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
            if (error.statusCode === 503) {
                const { payload, status } = apiError('SERVICE_UNAVAILABLE', {
                    message: 'GitHub stats temporarily unavailable'
                });
                return createJsonResponse(payload, { status }, securityCheck);
            }
        }

        const { payload, status } = apiError('SERVER_ERROR', { message: 'Failed to fetch stats' });
        return createJsonResponse(payload, { status }, securityCheck);
    }
}
