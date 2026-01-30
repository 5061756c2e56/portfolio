import { NextRequest, NextResponse } from 'next/server';
import { getCodeFrequency, getCommitActivity, getContributors, getLanguages, getRepoInfo } from '@/lib/github/api';
import { transformCommitActivity } from '@/lib/github/utils';
import { getTTLForRange, withCache } from '@/lib/github/cache';
import { addSecurityHeaders, validateRequest } from '@/lib/github/security';
import { getCodeTotalsFromDB, getTimelineFromDB, isDatabaseConfigured } from '@/lib/github/db-queries';
import {
    ALLOWED_REPOSITORIES, CACHE_TTL, Contributor, GitHubAPIError, GitHubCodeFrequency, GitHubCommitActivity,
    isAllowedRepository, LanguageStats, MultiRepoStatsResponse, MultiRepoTimelinePoint, REPO_COLORS, RepoStats,
    RepoTimeline, TimeRange
} from '@/lib/github/types';

interface RepoParam {
    owner: string;
    name: string;
}

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

function generateCacheKey(repos: RepoParam[]): string {
    const repoKeys = repos.map(r => `${r.owner}:${r.name}`).sort().join(',');
    return `github:multi-stats:${repoKeys}`;
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
        const cacheKey = `github:repo-data:${repo.owner}:${repo.name}`;

        const { data: cachedData } = await withCache<RepoDataResult>(
            cacheKey,
            CACHE_TTL.stats,
            async () => {
                const [repoInfo, languages, contributors] = await Promise.all([
                    getRepoInfo(repo.owner, repo.name),
                    getLanguages(repo.owner, repo.name),
                    getContributors(repo.owner, repo.name)
                ]);

                let codeFrequency: GitHubCodeFrequency = [];
                let commitActivity: GitHubCommitActivity[] = [];

                try {
                    codeFrequency = await getCodeFrequency(repo.owner, repo.name);
                } catch (e) {
                    console.warn(`[Multi-stats] Code frequency unavailable for ${repo.name}`, e);
                    codeFrequency = [];
                }

                try {
                    commitActivity = await getCommitActivity(repo.owner, repo.name);
                } catch (e) {
                    console.warn(`[Multi-stats] Commit activity unavailable for ${repo.name}`, e);
                    commitActivity = [];
                }

                let totalAdditions = 0;
                let totalDeletions = 0;

                if (codeFrequency && Array.isArray(codeFrequency)) {
                    for (const week of codeFrequency) {
                        totalAdditions += week[1] || 0;
                        totalDeletions += Math.abs(week[2] || 0);
                    }
                }

                const totalCommits = contributors.reduce((sum, c) => sum + c.commits, 0);
                const timeline = transformCommitActivity(commitActivity, range, locale);
                const timelineCommits = timeline.reduce((sum, p) => sum + p.commits, 0);

                return {
                    repoName: repo.name,
                    displayName,
                    color,
                    languages,
                    contributors,
                    commitActivity,
                    timeline,
                    timelineCommits,
                    stats: {
                        stars: repoInfo.stargazers_count,
                        forks: repoInfo.forks_count,
                        issues: repoInfo.open_issues_count,
                        size: repoInfo.size,
                        createdAt: repoInfo.created_at,
                        lastPush: repoInfo.pushed_at,
                        defaultBranch: repoInfo.default_branch,
                        totalCommits,
                        totalContributors: contributors.length,
                        totalAdditions,
                        totalDeletions
                    }
                };
            }
        );

        if (cachedData) {
            const updatedTimeline = transformCommitActivity(cachedData.commitActivity, range, locale);
            return {
                ...cachedData,
                color,
                timeline: updatedTimeline,
                timelineCommits: updatedTimeline.reduce((sum, p) => sum + p.commits, 0)
            };
        }

        return null;
    } catch (error) {
        console.error(`[Multi-stats] Error fetching ${repo.name}:`, error);
        return null;
    }
}

export async function GET(request: NextRequest) {
    const securityCheck = validateRequest(request);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    const { searchParams } = new URL(request.url);
    const reposParam = searchParams.get('repos');
    const timelineRange = (
                              searchParams.get('range') as TimeRange
                          ) || '12m';
    const statsRange: TimeRange = '12m';
    const locale = searchParams.get('locale') || 'fr';

    const validRanges: TimeRange[] = ['7d', '30d', '6m', '12m'];
    if (!validRanges.includes(timelineRange)) {
        return addSecurityHeaders(NextResponse.json(
            { error: 'Invalid range parameter', code: 'INVALID_RANGE' },
            { status: 400 }
        ), securityCheck.rateLimitRemaining);
    }

    let repos: RepoParam[] = [];

    if (reposParam) {
        try {
            repos = JSON.parse(reposParam) as RepoParam[];
        } catch {
            return addSecurityHeaders(NextResponse.json(
                { error: 'Invalid repos parameter', code: 'INVALID_PARAMS' },
                { status: 400 }
            ), securityCheck.rateLimitRemaining);
        }
    } else {
        repos = ALLOWED_REPOSITORIES.map(r => (
            { owner: r.owner, name: r.name }
        ));
    }

    const validRepos = repos.filter(r => isAllowedRepository(r.owner, r.name));
    if (validRepos.length === 0) {
        return addSecurityHeaders(NextResponse.json(
            { error: 'No valid repositories provided', code: 'INVALID_REPOS' },
            { status: 400 }
        ), securityCheck.rateLimitRemaining);
    }

    try {
        const cacheKey = generateCacheKey(validRepos);

        const useDB = await isDatabaseConfigured();

        const { data: cachedResponse, fromCache } = await withCache<MultiRepoStatsResponse>(
            cacheKey,
            getTTLForRange(statsRange),
            async () => {
                const results = await Promise.all(
                    validRepos.map((repo, index) =>
                        fetchRepoDataWithFallback(repo, index, statsRange, locale)
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
                    const { additions, deletions } = await getCodeTotalsFromDB(validRepos, statsRange);
                    aggregatedStats.totalAdditions = additions;
                    aggregatedStats.totalDeletions = deletions;
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
                const aggregatedContributors: Contributor[] = Array.from(contributorMap.values())
                                                                   .sort((a, b) => b.commits - a.commits)
                                                                   .slice(0, 10);

                let timelines: RepoTimeline[];
                let combinedTimeline: MultiRepoTimelinePoint[];

                if (useDB) {
                    const dbTimelines = await getTimelineFromDB(validRepos, timelineRange, locale);

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
                        const data = transformCommitActivity(r.commitActivity, timelineRange, locale);
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
                    availablePeriods: ['7d', '30d', '6m', '12m'] as TimeRange[],
                    defaultPeriod: '7d' as TimeRange
                };
            }
        );

        const responseData = {
            ...cachedResponse,
            availablePeriods: ['7d', '30d', '6m', '12m'] as const,
            defaultPeriod: '7d' as const
        };

        return addSecurityHeaders(NextResponse.json(responseData, {
            headers: {
                'Cache-Control': `public, s-maxage=${getTTLForRange(statsRange)}, stale-while-revalidate`,
                'X-Cache': fromCache ? 'HIT' : 'MISS'
            }
        }), securityCheck.rateLimitRemaining);

    } catch (error) {
        console.error('[Multi-stats API] Error:', error);

        if (error instanceof GitHubAPIError) {
            if (error.statusCode === 401) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'GitHub configuration error', code: 'UNAUTHORIZED' },
                    { status: 401 }
                ), securityCheck.rateLimitRemaining);
            }
            if (error.statusCode === 403) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'GitHub rate limit reached', code: 'RATE_LIMIT', retryAfter: error.rateLimitReset },
                    { status: 429 }
                ), securityCheck.rateLimitRemaining);
            }
            if (error.statusCode === 503) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'GitHub stats temporarily unavailable', code: 'SERVICE_UNAVAILABLE' },
                    { status: 503 }
                ), securityCheck.rateLimitRemaining);
            }
        }

        return addSecurityHeaders(NextResponse.json(
            { error: 'Failed to fetch stats', code: 'SERVER_ERROR' },
            { status: 500 }
        ), securityCheck.rateLimitRemaining);
    }
}
