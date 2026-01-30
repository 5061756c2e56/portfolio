import { getPrisma } from '@/lib/prisma';
import { getStartDateForRange } from '@/lib/github/utils';
import { ALLOWED_REPOSITORIES, CommitItem, PERIOD_CONFIGS, RepoParam, TimeRange } from './types';

export interface DBCommitItem extends CommitItem {
    repoOwner: string;
    repoName: string;
    repoDisplayName: string;
    additions: number;
    deletions: number;
    filesChanged: number;
    isMergeCommit: boolean;
}

export interface CommitsByRepo {
    displayName: string;
    commits: DBCommitItem[];
    total: number;
}

export async function isDatabaseConfigured(): Promise<boolean> {
    if (!process.env.DATABASE_URL || process.env.USE_GITHUB_API === 'true') {
        return false;
    }

    const prisma = getPrisma();
    if (!prisma) {
        return false;
    }

    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
    } catch {
        return false;
    }
}

export async function getCommitsFromDB(
    repos: RepoParam[],
    range: TimeRange,
    searchQuery?: string
): Promise<{
    commitsByRepo: Record<string, CommitsByRepo>;
    allCommits: DBCommitItem[];
    total: number;
}> {
    const prisma = getPrisma();
    if (!prisma) {
        return { commitsByRepo: {}, allCommits: [], total: 0 };
    }

    const startDate = ['6m', '12m'].includes(range)
        ? new Date('2020-01-01')
        : getStartDateForRange(range);

    const dbRepos = await prisma.repository.findMany({
        where: {
            OR: repos.map((r: RepoParam) => (
                { owner: r.owner, name: r.name }
            ))
        }
    });

    if (dbRepos.length === 0) {
        return { commitsByRepo: {}, allCommits: [], total: 0 };
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const whereClause: any = {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repositoryId: { in: dbRepos.map((r: any) => r.id) },
        committedAt: { gte: startDate }
    };

    if (searchQuery && searchQuery.length >= 1) {
        whereClause.OR = [
            { sha: { startsWith: searchQuery.toLowerCase() } },
            { shortSha: { startsWith: searchQuery.toLowerCase() } }
        ];
    }

    const commits = await prisma.commit.findMany({
        where: whereClause,
        include: {
            repository: true
        },
        orderBy: { committedAt: 'desc' }
    });

    const commitsByRepo: Record<string, CommitsByRepo> = {};
    const allCommits: DBCommitItem[] = [];

    for (const repo of dbRepos) {
        const repoConfig = ALLOWED_REPOSITORIES.find(
            r => r.owner === repo.owner && r.name === repo.name
        );

        commitsByRepo[repo.name] = {
            displayName: repo.displayName || repoConfig?.displayName || repo.name,
            commits: [],
            total: 0
        };
    }

    for (const commit of commits) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const repo = dbRepos.find((r: any) => r.id === commit.repositoryId)!;
        const repoConfig = ALLOWED_REPOSITORIES.find(
            r => r.owner === repo.owner && r.name === repo.name
        );

        const commitItem: DBCommitItem = {
            sha: commit.sha,
            shortSha: commit.shortSha,
            message: commit.message,
            messageTitle: commit.messageTitle,
            date: commit.committedAt.toISOString(),
            author: commit.author,
            authorAvatar: commit.authorAvatar || undefined,
            repoOwner: repo.owner,
            repoName: repo.name,
            repoDisplayName: repo.displayName || repoConfig?.displayName || repo.name,
            additions: commit.additions,
            deletions: commit.deletions,
            filesChanged: commit.filesChanged,
            isMergeCommit: commit.isMergeCommit
        };

        commitsByRepo[repo.name].commits.push(commitItem);
        commitsByRepo[repo.name].total++;
        allCommits.push(commitItem);
    }

    return {
        commitsByRepo,
        allCommits,
        total: allCommits.length
    };
}

export async function getCommitDetailFromDB(
    owner: string,
    repo: string,
    sha: string
): Promise<DBCommitItem | null> {
    const prisma = getPrisma();
    if (!prisma) {
        return null;
    }

    const repository = await prisma.repository.findUnique({
        where: { owner_name: { owner, name: repo } }
    });

    if (!repository) return null;

    const commit = await prisma.commit.findUnique({
        where: {
            repositoryId_sha: {
                repositoryId: repository.id,
                sha
            }
        },
        include: { repository: true }
    });

    if (!commit) return null;

    const repoConfig = ALLOWED_REPOSITORIES.find(
        r => r.owner === owner && r.name === repo
    );

    return {
        sha: commit.sha,
        shortSha: commit.shortSha,
        message: commit.message,
        messageTitle: commit.messageTitle,
        date: commit.committedAt.toISOString(),
        author: commit.author,
        authorAvatar: commit.authorAvatar || undefined,
        repoOwner: owner,
        repoName: repo,
        repoDisplayName: repository.displayName || repoConfig?.displayName || repo,
        additions: commit.additions,
        deletions: commit.deletions,
        filesChanged: commit.filesChanged,
        isMergeCommit: commit.isMergeCommit
    };
}

export async function getCommitStatsFromDB(
    repos: RepoParam[],
    range: TimeRange
): Promise<{
    totalCommits: number;
    commitsByDate: Array<{ date: string; commits: number }>;
}> {
    const prisma = getPrisma();
    if (!prisma) {
        return { totalCommits: 0, commitsByDate: [] };
    }

    const startDate = getStartDateForRange(range);

    const dbRepos = await prisma.repository.findMany({
        where: {
            OR: repos.map((r: RepoParam) => (
                { owner: r.owner, name: r.name }
            ))
        }
    });

    if (dbRepos.length === 0) {
        return { totalCommits: 0, commitsByDate: [] };
    }

    const totalCommits = await prisma.commit.count({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            repositoryId: { in: dbRepos.map((r: any) => r.id) },
            committedAt: { gte: startDate }
        }
    });

    const commits = await prisma.commit.findMany({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            repositoryId: { in: dbRepos.map((r: any) => r.id) },
            committedAt: { gte: startDate }
        },
        select: { committedAt: true },
        orderBy: { committedAt: 'asc' }
    });

    const granularity = PERIOD_CONFIGS[range].granularity;
    const groupedCommits = new Map<string, number>();

    for (const commit of commits) {
        const date = commit.committedAt;
        let key: string;

        if (granularity === 'daily') {
            key = date.toISOString().split('T')[0];
        } else {
            const monday = new Date(date);
            monday.setDate(date.getDate() - date.getDay() + 1);
            key = monday.toISOString().split('T')[0];
        }

        groupedCommits.set(key, (
                                    groupedCommits.get(key) || 0
                                ) + 1);
    }

    const commitsByDate = Array.from(groupedCommits.entries())
                               .map(([date, commits]) => (
                                   { date, commits }
                               ))
                               .sort((a, b) => a.date.localeCompare(b.date));

    return { totalCommits, commitsByDate };
}

export interface TimelinePoint {
    date: string;
    commits: number;
    label: string;
}

export interface RepoTimelineFromDB {
    repoName: string;
    displayName: string;
    timeline: TimelinePoint[];
    totalCommits: number;
}

function formatDateLabel(date: Date, granularity: 'daily' | 'weekly', locale: string): string {
    if (granularity === 'daily') {
        return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
            day: 'numeric',
            month: 'short'
        });
    }
    return date.toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
        month: 'short',
        year: '2-digit'
    });
}

function generateAllDatesInRange(startDate: Date, endDate: Date, granularity: 'daily' | 'weekly'): Date[] {
    const dates: Date[] = [];
    const current = new Date(startDate);

    if (granularity === 'weekly') {
        const dayOfWeek = current.getUTCDay();
        const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
        current.setUTCDate(current.getUTCDate() - daysToMonday);
    }

    while (current <= endDate) {
        dates.push(new Date(current));
        if (granularity === 'daily') {
            current.setUTCDate(current.getUTCDate() + 1);
        } else {
            current.setUTCDate(current.getUTCDate() + 7);
        }
    }

    return dates;
}

export async function getTimelineFromDB(
    repos: RepoParam[],
    range: TimeRange,
    locale: string = 'fr'
): Promise<{
    timelines: RepoTimelineFromDB[];
    combinedTimeline: Array<{ date: string; label: string; [repoName: string]: number | string }>;
}> {
    const prisma = getPrisma();
    if (!prisma) {
        return { timelines: [], combinedTimeline: [] };
    }

    const config = PERIOD_CONFIGS[range];
    const startDate = getStartDateForRange(range);
    const endDate = new Date();

    const dbRepos = await prisma.repository.findMany({
        where: {
            OR: repos.map((r: RepoParam) => (
                { owner: r.owner, name: r.name }
            ))
        }
    });

    if (dbRepos.length === 0) {
        return { timelines: [], combinedTimeline: [] };
    }

    const allDates = generateAllDatesInRange(startDate, endDate, config.granularity);

    const commits = await prisma.commit.findMany({
        where: {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            repositoryId: { in: dbRepos.map((r: any) => r.id) },
            committedAt: { gte: startDate }
        },
        select: {
            committedAt: true,
            repositoryId: true
        },
        orderBy: { committedAt: 'asc' }
    });

    const commitsByRepoAndDate = new Map<string, Map<string, number>>();

    for (const repo of dbRepos) {
        commitsByRepoAndDate.set(repo.id, new Map());
    }

    for (const commit of commits) {
        const date = new Date(commit.committedAt);
        let key: string;

        if (config.granularity === 'daily') {
            key = date.toISOString().split('T')[0];
        } else {
            const dayOfWeek = date.getUTCDay();
            const monday = new Date(date);
            const daysToMonday = dayOfWeek === 0 ? 6 : dayOfWeek - 1;
            monday.setUTCDate(date.getUTCDate() - daysToMonday);
            key = monday.toISOString().split('T')[0];
        }

        const repoMap = commitsByRepoAndDate.get(commit.repositoryId);
        if (repoMap) {
            repoMap.set(key, (
                                 repoMap.get(key) || 0
                             ) + 1);
        }
    }

    const timelines: RepoTimelineFromDB[] = [];

    for (const repo of dbRepos) {
        const repoConfig = ALLOWED_REPOSITORIES.find(
            r => r.owner === repo.owner && r.name === repo.name
        );
        const displayName = repo.displayName || repoConfig?.displayName || repo.name;
        const repoCommits = commitsByRepoAndDate.get(repo.id) || new Map();

        const timeline: TimelinePoint[] = allDates.map(date => {
            const key = date.toISOString().split('T')[0];
            const commits = repoCommits.get(key) || 0;
            return {
                date: key,
                commits,
                label: formatDateLabel(date, config.granularity, locale)
            };
        });

        const totalCommits = timeline.reduce((sum, p) => sum + p.commits, 0);

        timelines.push({
            repoName: repo.name,
            displayName,
            timeline,
            totalCommits
        });
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const combinedTimeline: Array<any> = allDates.map(date => {
        const key = date.toISOString().split('T')[0];
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const point: any = {
            date: key,
            label: formatDateLabel(date, config.granularity, locale)
        };

        for (const repo of dbRepos) {
            const repoCommits = commitsByRepoAndDate.get(repo.id) || new Map();
            point[repo.name] = repoCommits.get(key) || 0;
        }

        return point;
    });

    return { timelines, combinedTimeline };
}

export async function getCodeTotalsFromDB(
    repos: RepoParam[],
    range: TimeRange
): Promise<{ additions: number; deletions: number }> {
    const prisma = getPrisma();
    if (!prisma) return { additions: 0, deletions: 0 };

    const startDate = getStartDateForRange(range);

    const dbRepos = await prisma.repository.findMany({
        where: {
            OR: repos.map((r: RepoParam) => (
                { owner: r.owner, name: r.name }
            ))
        },
        select: { id: true }
    });

    if (dbRepos.length === 0) return { additions: 0, deletions: 0 };

    const rows = await prisma.commit.aggregate({
        where: {
            repositoryId: { in: dbRepos.map((r: { id: string }) => r.id) },
            committedAt: { gte: startDate }
        },
        _sum: { additions: true, deletions: true }
    });

    return {
        additions: rows._sum.additions ?? 0,
        deletions: rows._sum.deletions ?? 0
    };
}

export async function getContributorCommitCountsFromDB(
    repos: RepoParam[],
    range: TimeRange
): Promise<Record<string, number>> {
    const prisma = getPrisma();
    if (!prisma) return {};

    const startDate = getStartDateForRange(range);

    const dbRepos = await prisma.repository.findMany({
        where: {
            OR: repos.map((r: RepoParam) => ({ owner: r.owner, name: r.name }))
        },
        select: { id: true }
    });

    if (dbRepos.length === 0) return {};

    const grouped = await prisma.commit.groupBy({
        by: ['authorLogin'],
        where: {
            repositoryId: { in: dbRepos.map((r: { id: string }) => r.id) },
            committedAt: { gte: startDate },
            authorLogin: { not: null }
        },
        _count: { id: true }
    });

    const result: Record<string, number> = {};
    for (const row of grouped) {
        if (row.authorLogin != null) {
            result[row.authorLogin] = row._count.id;
        }
    }
    return result;
}