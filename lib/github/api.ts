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
    CommitDetail, CommitItem, Contributor, GitHubAPIError, GitHubCodeFrequency, GitHubCommitActivity,
    GitHubCommitDetailRaw, GitHubCommitRaw, GitHubContributor, GitHubRepoInfo, isAllowedRepository, LanguageStats
} from './types';

const GITHUB_API_BASE = 'https://api.github.com';

export const DEFAULT_OWNER = '5061756c2e56';
export const DEFAULT_REPO = 'portfolio';

interface GitHubRequestOptions {
    endpoint: string;
    params?: Record<string, string | number>;
}

function getToken(): string {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
        throw new GitHubAPIError(
            'Token GitHub manquant. Configurez GITHUB_TOKEN dans .env',
            401
        );
    }

    return token;
}

export async function githubFetch<T>(options: GitHubRequestOptions): Promise<T> {
    const token = getToken();

    const url = new URL(`${GITHUB_API_BASE}${options.endpoint}`);
    if (options.params) {
        Object.entries(options.params).forEach(([key, value]) => {
            url.searchParams.set(key, String(value));
        });
    }

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'Portfolio-GitHub-Stats/1.0'
        },
        next: { revalidate: 0 }
    });

    const rateLimitRemaining = parseInt(response.headers.get('x-ratelimit-remaining') || '0');
    const rateLimitReset = parseInt(response.headers.get('x-ratelimit-reset') || '0');

    if (!response.ok) {
        if (response.status === 403 && rateLimitRemaining === 0) {
            throw new GitHubAPIError(
                'Rate limit GitHub atteint',
                403,
                rateLimitRemaining,
                rateLimitReset
            );
        }

        if (response.status === 404) {
            throw new GitHubAPIError('Ressource non trouvée', 404);
        }

        if (response.status === 401) {
            throw new GitHubAPIError('Token GitHub invalide', 401);
        }

        throw new GitHubAPIError(
            `Erreur GitHub API: ${response.status}`,
            response.status,
            rateLimitRemaining,
            rateLimitReset
        );
    }

    return response.json();
}

async function fetchWithRetry<T>(
    fetchFn: () => Promise<Response>,
    maxAttempts = 15,
    initialDelayMs = 1000
): Promise<T> {
    for (let attempts = 0; attempts < maxAttempts; attempts++) {
        const response = await fetchFn();

        if (response.status === 202) {
            const delay = Math.min(initialDelayMs * Math.pow(1.7, attempts), 15000);
            await new Promise(r => setTimeout(r, delay));
            continue;
        }

        if (!response.ok) {
            const body = await response.text().catch(() => '');
            throw new GitHubAPIError(`Erreur: ${response.status} ${body}`, response.status);
        }

        return response.json();
    }

    throw new GitHubAPIError('Stats encore en génération (202)', 503);
}

export async function getCommitActivity(owner: string = DEFAULT_OWNER, repo: string = DEFAULT_REPO): Promise<GitHubCommitActivity[]> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    const token = getToken();

    return fetchWithRetry<GitHubCommitActivity[]>(
        () => fetch(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/commit_activity`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': 'Portfolio-GitHub-Stats/1.0'
                }
            }
        )
    );
}

export async function getCodeFrequency(owner: string = DEFAULT_OWNER, repo: string = DEFAULT_REPO): Promise<GitHubCodeFrequency> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    const token = getToken();

    return fetchWithRetry<GitHubCodeFrequency>(
        () => fetch(
            `${GITHUB_API_BASE}/repos/${owner}/${repo}/stats/code_frequency`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'X-GitHub-Api-Version': '2022-11-28',
                    'User-Agent': 'Portfolio-GitHub-Stats/1.0'
                }
            }
        )
    );
}

export async function getCommitsList(
    owner: string = DEFAULT_OWNER,
    repo: string = DEFAULT_REPO,
    since?: string,
    until?: string,
    page: number = 1,
    perPage: number = 100
): Promise<{ commits: CommitItem[]; hasMore: boolean }> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    const params: Record<string, string | number> = {
        per_page: perPage,
        page
    };

    if (since) params.since = since;
    if (until) params.until = until;

    const data = await githubFetch<GitHubCommitRaw[]>({
        endpoint: `/repos/${owner}/${repo}/commits`,
        params
    });

    const commits: CommitItem[] = data.map(item => (
        {
            sha: item.sha,
            shortSha: item.sha.substring(0, 7),
            message: item.commit.message,
            messageTitle: item.commit.message.split('\n')[0],
            date: item.commit.author.date,
            author: item.commit.author.name,
            authorAvatar: item.author?.avatar_url
        }
    ));

    return {
        commits,
        hasMore: data.length === perPage
    };
}

export async function getCommitDetail(owner: string = DEFAULT_OWNER, repo: string = DEFAULT_REPO, sha: string): Promise<CommitDetail> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    const data = await githubFetch<GitHubCommitDetailRaw>({
        endpoint: `/repos/${owner}/${repo}/commits/${sha}`
    });

    return {
        sha: data.sha,
        shortSha: data.sha.substring(0, 7),
        message: data.commit.message,
        messageTitle: data.commit.message.split('\n')[0],
        date: data.commit.author.date,
        author: data.commit.author.name,
        authorAvatar: data.author?.avatar_url,
        additions: data.stats.additions,
        deletions: data.stats.deletions,
        changes: data.stats.total,
        filesChanged: data.files.length,
        files: data.files.map(f => (
            {
                filename: f.filename,
                status: f.status as 'added' | 'modified' | 'removed' | 'renamed',
                additions: f.additions,
                deletions: f.deletions
            }
        )),
        htmlUrl: `https://github.com/${owner}/${repo}/commit/${data.sha}`
    };
}

export async function getRepoInfo(owner: string = DEFAULT_OWNER, repo: string = DEFAULT_REPO): Promise<GitHubRepoInfo> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    return githubFetch<GitHubRepoInfo>({
        endpoint: `/repos/${owner}/${repo}`
    });
}

const LANGUAGE_COLORS: Record<string, string> = {
    TypeScript: '#3178c6',
    JavaScript: '#f1e05a',
    CSS: '#563d7c',
    HTML: '#e34c26',
    Python: '#3572A5',
    Java: '#b07219',
    Go: '#00ADD8',
    Rust: '#dea584',
    Ruby: '#701516',
    PHP: '#4F5D95',
    'C#': '#178600',
    'C++': '#f34b7d',
    C: '#555555',
    Shell: '#89e051',
    SCSS: '#c6538c',
    Vue: '#41b883',
    Svelte: '#ff3e00',
    MDX: '#fcb32c',
    JSON: '#292929',
    YAML: '#cb171e',
    Markdown: '#083fa1'
};

export async function getLanguages(owner: string = DEFAULT_OWNER, repo: string = DEFAULT_REPO): Promise<LanguageStats[]> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    const data = await githubFetch<Record<string, number>>({
        endpoint: `/repos/${owner}/${repo}/languages`
    });

    const total = Object.values(data).reduce((sum, bytes) => sum + bytes, 0);

    return Object.entries(data)
                 .map(([name, bytes]) => (
                     {
                         name,
                         bytes,
                         percentage: Math.round((
                                                    bytes / total
                                                ) * 1000) / 10,
                         color: LANGUAGE_COLORS[name] || '#8b8b8b'
                     }
                 ))
                 .sort((a, b) => b.bytes - a.bytes);
}

export async function getContributors(owner: string = DEFAULT_OWNER, repo: string = DEFAULT_REPO): Promise<Contributor[]> {
    if (!isAllowedRepository(owner, repo)) {
        throw new GitHubAPIError('Repository not allowed', 403);
    }

    const data = await githubFetch<GitHubContributor[]>({
        endpoint: `/repos/${owner}/${repo}/contributors`,
        params: { per_page: 10 }
    });

    if (data && data.length > 0) {
        return data.map(c => (
            {
                username: c.login,
                avatar: c.avatar_url,
                commits: c.contributions,
                profileUrl: c.html_url
            }
        ));
    }

    const commits = await githubFetch<GitHubCommitRaw[]>({
        endpoint: `/repos/${owner}/${repo}/commits`,
        params: { per_page: 100 }
    });

    const contributorMap = new Map<string, {
        username: string;
        avatar: string;
        commits: number;
        profileUrl: string;
    }>();

    for (const commit of commits) {
        const gitAuthor = commit.commit.author;
        const githubAuthor = commit.author;

        const key = githubAuthor?.login || gitAuthor.email;
        const existing = contributorMap.get(key);

        if (existing) {
            existing.commits++;
        } else {
            const username = githubAuthor?.login || gitAuthor.name;
            const isLikelyGitHubUsername = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/.test(username);

            contributorMap.set(key, {
                username,
                avatar: githubAuthor?.avatar_url || `https://github.com/${username}.png?size=100`,
                commits: 1,
                profileUrl: githubAuthor?.html_url || (
                    isLikelyGitHubUsername
                        ? `https://github.com/${username}`
                        : `https://github.com/search?q=${encodeURIComponent(gitAuthor.email)}&type=users`
                )
            });
        }
    }

    return Array.from(contributorMap.values())
                .sort((a, b) => b.commits - a.commits)
                .slice(0, 10);
}
