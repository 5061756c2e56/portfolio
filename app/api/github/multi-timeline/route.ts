import { NextRequest, NextResponse } from 'next/server';
import { getCommitActivity } from '@/lib/github/api';
import { getTTLForRange, withCache } from '@/lib/github/cache';
import { addSecurityHeaders, validateRequest } from '@/lib/github/security';
import { getTimelineFromDB, isDatabaseConfigured } from '@/lib/github/db-queries';
import { transformCommitActivity } from '@/lib/github/utils';
import {
    ALLOWED_REPOSITORIES, GitHubAPIError, isAllowedRepository, MultiRepoTimelinePoint, REPO_COLORS, RepoTimeline,
    TimeRange
} from '@/lib/github/types';

interface RepoParam {
    owner: string;
    name: string;
}

function generateCacheKey(repos: RepoParam[], range: TimeRange, locale: string) {
    const repoKeys = repos.map(r => `${r.owner}:${r.name}`).sort().join(',');
    return `github:multi-timeline:${repoKeys}:${range}:${locale}`;
}

export async function GET(request: NextRequest) {
    const securityCheck = validateRequest(request);
    if (!securityCheck.allowed) return securityCheck.response;

    const { searchParams } = new URL(request.url);
    const reposParam = searchParams.get('repos');
    const range = (
                      searchParams.get('range') as TimeRange
                  ) || '7d';
    const locale = searchParams.get('locale') || 'fr';

    const validRanges: TimeRange[] = ['7d', '30d', '6m', '12m'];
    if (!validRanges.includes(range)) {
        return addSecurityHeaders(
            NextResponse.json({ error: 'Invalid range', code: 'INVALID_RANGE' }, { status: 400 }),
            securityCheck.rateLimitRemaining
        );
    }

    let repos: RepoParam[] = [];
    if (reposParam) {
        try {
            repos = JSON.parse(reposParam) as RepoParam[];
        } catch {
            return addSecurityHeaders(
                NextResponse.json({ error: 'Invalid repos', code: 'INVALID_PARAMS' }, { status: 400 }),
                securityCheck.rateLimitRemaining
            );
        }
    } else {
        repos = ALLOWED_REPOSITORIES.map(r => (
            { owner: r.owner, name: r.name }
        ));
    }

    const validRepos = repos.filter(r => isAllowedRepository(r.owner, r.name));
    if (validRepos.length === 0) {
        return addSecurityHeaders(
            NextResponse.json({ error: 'No valid repos', code: 'INVALID_REPOS' }, { status: 400 }),
            securityCheck.rateLimitRemaining
        );
    }

    try {
        const useDB = await isDatabaseConfigured();
        const cacheKey = generateCacheKey(validRepos, range, locale);

        const { data, fromCache } = await withCache<{
            timelines: RepoTimeline[];
            combinedTimeline: MultiRepoTimelinePoint[];
            availablePeriods: TimeRange[];
            defaultPeriod: TimeRange;
        }>(
            cacheKey,
            getTTLForRange(range),
            async () => {
                let timelines: RepoTimeline[] = [];
                let combinedTimeline: MultiRepoTimelinePoint[] = [];

                if (useDB) {
                    const db = await getTimelineFromDB(validRepos, range, locale);
                    timelines = db.timelines.map((t, index) => (
                        {
                            repoName: t.repoName,
                            repoDisplayName: t.displayName,
                            color: REPO_COLORS[index % REPO_COLORS.length],
                            data: t.timeline,
                            totalCommits: t.totalCommits
                        }
                    ));
                    combinedTimeline = db.combinedTimeline as MultiRepoTimelinePoint[];
                } else {
                    const commitActivities = await Promise.all(
                        validRepos.map(r => getCommitActivity(r.owner, r.name).catch(() => []))
                    );

                    timelines = validRepos.map((r, index) => {
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
                    combinedTimeline = Array.from(dateMap.values()).sort(
                        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
                    );
                }

                return {
                    timelines,
                    combinedTimeline,
                    availablePeriods: ['7d', '30d', '6m', '12m'],
                    defaultPeriod: '7d'
                };
            }
        );

        return addSecurityHeaders(
            NextResponse.json(data, {
                headers: {
                    'Cache-Control': `public, s-maxage=${getTTLForRange(range)}, stale-while-revalidate`,
                    'X-Cache': fromCache ? 'HIT' : 'MISS'
                }
            }),
            securityCheck.rateLimitRemaining
        );
    } catch (e) {
        console.error('[Multi-timeline API] Error:', e);
        if (e instanceof GitHubAPIError) {
            return addSecurityHeaders(
                NextResponse.json({ error: e.message, code: 'SERVER_ERROR' }, { status: 500 }),
                securityCheck.rateLimitRemaining
            );
        }
        return addSecurityHeaders(
            NextResponse.json({ error: 'Erreur serveur', code: 'SERVER_ERROR' }, { status: 500 }),
            securityCheck.rateLimitRemaining
        );
    }
}