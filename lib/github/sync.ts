import { getPrisma } from '@/lib/prisma';
import { ALLOWED_REPOSITORIES, GitHubAPIError } from './types';

const GITHUB_API_BASE = 'https://api.github.com';

interface GitHubCommitRaw {
    sha: string;
    commit: {
        message: string;
        author: {
            name: string;
            email: string;
            date: string;
        };
    };
    author?: {
        login: string;
        avatar_url: string;
    };
    html_url: string;
    parents: { sha: string }[];
}

interface GitHubCommitDetailRaw extends GitHubCommitRaw {
    stats?: {
        additions: number;
        deletions: number;
        total: number;
    };
    files?: Array<{
        filename: string;
        additions: number;
        deletions: number;
    }>;
}

function getToken(): string {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
        throw new GitHubAPIError('Token GitHub manquant', 401);
    }
    return token;
}

async function githubFetch<T>(endpoint: string, params?: Record<string, string | number>): Promise<T> {
    const token = getToken();
    const url = new URL(`${GITHUB_API_BASE}${endpoint}`);

    if (params) {
        Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
        });
    }

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28'
        }
    });

    if (!response.ok) {
        const rateLimitRemaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
        const rateLimitReset = parseInt(response.headers.get('x-ratelimit-reset') || '0');

        if (response.status === 403 && rateLimitRemaining === 0) {
            throw new GitHubAPIError('Rate limit GitHub atteint', 403, rateLimitRemaining, rateLimitReset);
        }
        throw new GitHubAPIError(`Erreur GitHub API: ${response.status}`, response.status);
    }

    return response.json();
}

async function fetchAllCommitsFromGitHub(owner: string, repo: string): Promise<GitHubCommitRaw[]> {
    const allCommits: GitHubCommitRaw[] = [];
    let page = 1;
    const perPage = 100;
    let hasMore = true;

    console.log(`[Sync] Fetching all commits for ${owner}/${repo}...`);

    while (hasMore) {
        try {
            const commits = await githubFetch<GitHubCommitRaw[]>(
                `/repos/${owner}/${repo}/commits`,
                { per_page: perPage, page }
            );

            if (commits.length === 0) {
                hasMore = false;
            } else {
                allCommits.push(...commits);
                console.log(`[Sync] Fetched page ${page}: ${commits.length} commits (total: ${allCommits.length})`);
                hasMore = commits.length === perPage;
                page++;
            }

            if (hasMore) {
                await new Promise(resolve => setTimeout(resolve, 100));
            }
        } catch (error) {
            console.error(`[Sync] Error fetching page ${page}:`, error);
            throw error;
        }
    }

    return allCommits;
}

async function fetchCommitDetails(owner: string, repo: string, sha: string): Promise<GitHubCommitDetailRaw | null> {
    try {
        return await githubFetch<GitHubCommitDetailRaw>(`/repos/${owner}/${repo}/commits/${sha}`);
    } catch {
        return null;
    }
}

export async function syncRepository(owner: string, repo: string, displayName?: string): Promise<{
    success: boolean;
    commitsAdded: number;
    error?: string;
}> {
    const prisma = getPrisma();
    if (!prisma) {
        return { success: false, commitsAdded: 0, error: 'Database not configured' };
    }

    const syncLog = await prisma.syncLog.create({
        data: {
            type: 'initial',
            status: 'started'
        }
    });

    try {
        const repository = await prisma.repository.upsert({
            where: { owner_name: { owner, name: repo } },
            update: { displayName, updatedAt: new Date() },
            create: { owner, name: repo, displayName }
        });

        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: { repositoryId: repository.id }
        });

        const githubCommits = await fetchAllCommitsFromGitHub(owner, repo);
        console.log(`[Sync] Found ${githubCommits.length} commits for ${owner}/${repo}`);

        const existingShas = new Set(
            (
                await prisma.commit.findMany({
                    where: { repositoryId: repository.id },
                    select: { sha: true }

                })
            ).map((c: any) => c.sha)
        );

        const newCommits = githubCommits.filter(c => !existingShas.has(c.sha));
        console.log(`[Sync] ${newCommits.length} new commits to add`);

        const batchSize = 50;
        let commitsAdded = 0;

        for (let i = 0; i < newCommits.length; i += batchSize) {
            const batch = newCommits.slice(i, i + batchSize);

            const commitsWithDetails = await Promise.all(
                batch.map(async (commit) => {
                    const details = await fetchCommitDetails(owner, repo, commit.sha);
                    return { raw: commit, details };
                })
            );

            const commitData = commitsWithDetails.map(({ raw, details }) => {
                const authorLogin = details?.author?.login ?? raw.author?.login ?? null;
                const authorAvatar = details?.author?.avatar_url ?? raw.author?.avatar_url ?? null;
                return {
                    sha: raw.sha,
                    shortSha: raw.sha.substring(0, 7),
                    message: raw.commit.message,
                    messageTitle: raw.commit.message.split('\n')[0].substring(0, 255),
                    author: raw.commit.author.name,
                    authorEmail: raw.commit.author.email,
                    authorAvatar,
                    authorLogin,
                    committedAt: new Date(raw.commit.author.date),
                    additions: details?.stats?.additions || 0,
                    deletions: details?.stats?.deletions || 0,
                    filesChanged: details?.files?.length || 0,
                    htmlUrl: raw.html_url,
                    isMergeCommit: raw.parents.length > 1,
                    repositoryId: repository.id
                };
            });

            await prisma.commit.createMany({
                data: commitData,
                skipDuplicates: true
            });

            commitsAdded += batch.length;
            console.log(`[Sync] Processed ${Math.min(i + batchSize, newCommits.length)}/${newCommits.length} commits`);

            if (i + batchSize < newCommits.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        const authorBySha = new Map<string, { login: string | null; avatar_url: string | null }>();
        for (const c of githubCommits) {
            const login = c.author?.login ?? null;
            const avatar_url = c.author?.avatar_url ?? null;
            if (login !== null || avatar_url !== null) {
                authorBySha.set(c.sha, { login, avatar_url });
            }
        }

        const commitsWithoutLogin = await prisma.commit.findMany({
            where: { repositoryId: repository.id, authorLogin: null },
            select: { id: true, sha: true }
        });
        if (commitsWithoutLogin.length > 0 && authorBySha.size > 0) {
            console.log(`[Sync] Backfilling authorLogin for ${commitsWithoutLogin.length} existing commits (from list)`);
            let backfilled = 0;
            for (const commit of commitsWithoutLogin) {
                const author = authorBySha.get(commit.sha);
                if (author && (author.login !== null || author.avatar_url !== null)) {
                    await prisma.commit.update({
                        where: { id: commit.id },
                        data: { authorLogin: author.login, authorAvatar: author.avatar_url }
                    });
                    backfilled++;
                }
            }
            if (backfilled > 0) {
                console.log(`[Sync] Backfilled authorLogin for ${backfilled} commits`);
            }
        }

        await prisma.repository.update({
            where: { id: repository.id },
            data: { lastSyncAt: new Date() }
        });

        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: 'completed',
                commitsAdded,
                completedAt: new Date()
            }
        });

        console.log(`[Sync] Completed for ${owner}/${repo}: ${commitsAdded} commits added`);
        return { success: true, commitsAdded };

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`[Sync] Failed for ${owner}/${repo}:`, errorMessage);

        await prisma.syncLog.update({
            where: { id: syncLog.id },
            data: {
                status: 'failed',
                error: errorMessage,
                completedAt: new Date()
            }
        });

        return { success: false, commitsAdded: 0, error: errorMessage };
    }
}

export async function syncAllRepositories(): Promise<{
    total: number;
    success: number;
    failed: number;
    results: Array<{ repo: string; success: boolean; commitsAdded: number; error?: string }>;
}> {
    console.log(`[Sync] Starting sync for ${ALLOWED_REPOSITORIES.length} repositories...`);

    const results: Array<{ repo: string; success: boolean; commitsAdded: number; error?: string }> = [];

    for (const repo of ALLOWED_REPOSITORIES) {
        const result = await syncRepository(repo.owner, repo.name, repo.displayName);
        results.push({
            repo: `${repo.owner}/${repo.name}`,
            ...result
        });

        await new Promise(resolve => setTimeout(resolve, 1000));
    }

    const success = results.filter(r => r.success).length;
    const failed = results.filter(r => !r.success).length;

    console.log(`[Sync] Completed: ${success} success, ${failed} failed`);

    return {
        total: results.length,
        success,
        failed,
        results
    };
}

export async function addCommitFromWebhook(
    owner: string,
    repo: string,
    commitData: {
        sha: string;
        message: string;
        author: { name: string; email: string };
        timestamp: string;
        url: string;
    }
): Promise<boolean> {
    const prisma = getPrisma();
    if (!prisma) {
        console.warn('[Webhook] Database not configured');
        return false;
    }

    try {
        const repository = await prisma.repository.findUnique({
            where: { owner_name: { owner, name: repo } }
        });

        if (!repository) {
            console.warn(`[Webhook] Repository ${owner}/${repo} not found in database`);
            return false;
        }

        const details = await fetchCommitDetails(owner, repo, commitData.sha);

        const authorLogin = details?.author?.login ?? null;
        const authorAvatar = details?.author?.avatar_url ?? null;

        await prisma.commit.upsert({
            where: {
                repositoryId_sha: {
                    repositoryId: repository.id,
                    sha: commitData.sha
                }
            },
            update: {
                additions: details?.stats?.additions || 0,
                deletions: details?.stats?.deletions || 0,
                filesChanged: details?.files?.length || 0,
                authorLogin,
                authorAvatar
            },
            create: {
                sha: commitData.sha,
                shortSha: commitData.sha.substring(0, 7),
                message: commitData.message,
                messageTitle: commitData.message.split('\n')[0].substring(0, 255),
                author: commitData.author.name,
                authorEmail: commitData.author.email,
                authorAvatar,
                authorLogin,
                committedAt: new Date(commitData.timestamp),
                additions: details?.stats?.additions || 0,
                deletions: details?.stats?.deletions || 0,
                filesChanged: details?.files?.length || 0,
                htmlUrl: commitData.url,
                isMergeCommit: (
                                   details?.parents?.length || 0
                               ) > 1,
                repositoryId: repository.id
            }
        });

        console.log(`[Webhook] Added commit ${commitData.sha.substring(0, 7)} to ${owner}/${repo}`);
        return true;
    } catch (error) {
        console.error(`[Webhook] Failed to add commit:`, error);
        return false;
    }
}
