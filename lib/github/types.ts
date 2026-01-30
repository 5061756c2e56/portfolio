export type TimeRange = '7d' | '30d' | '6m' | '12m';

export type Granularity = 'daily' | 'weekly';

export interface Repository {
    owner: string;
    name: string;
    displayName?: string;
}

export type RepoParam = Pick<Repository, 'owner' | 'name'>;

export const VALID_TIME_RANGES: readonly TimeRange[] = ['7d', '30d', '6m', '12m'];

export const ALLOWED_REPOSITORIES: Repository[] = [
    { owner: '5061756c2e56', name: 'portfolio', displayName: 'Portfolio' },
    { owner: '5061756c2e56', name: 'Web-Security', displayName: 'Web Security' }
];

export function isAllowedRepository(owner: string, name: string): boolean {
    return ALLOWED_REPOSITORIES.some(r => r.owner === owner && r.name === name);
}

export function getRepoKey(owner: string, name: string): string {
    return `${owner}:${name}`;
}

export interface PeriodConfig {
    range: TimeRange;
    label: string;
    days: number;
    granularity: Granularity;
    minDataPoints: number;
}

export const PERIOD_CONFIGS: Record<TimeRange, PeriodConfig> = {
    '7d': { range: '7d', label: '7d', days: 7, granularity: 'daily', minDataPoints: 3 },
    '30d': { range: '30d', label: '30d', days: 30, granularity: 'daily', minDataPoints: 7 },
    '6m': { range: '6m', label: '6m', days: 180, granularity: 'weekly', minDataPoints: 4 },
    '12m': { range: '12m', label: '12m', days: 365, granularity: 'weekly', minDataPoints: 8 }
};

export interface TimelinePoint {
    date: string;
    commits: number;
    label: string;
}

export interface CodePoint {
    date: string;
    additions: number;
    deletions: number;
    changes: number;
    label: string;
}

export interface CommitItem {
    sha: string;
    shortSha: string;
    message: string;
    messageTitle: string;
    date: string;
    author: string;
    authorAvatar?: string;
}

export interface CommitDetail extends CommitItem {
    additions: number;
    deletions: number;
    changes: number;
    filesChanged: number;
    files?: FileChange[];
    htmlUrl: string;
}

export interface FileChange {
    filename: string;
    status: 'added' | 'modified' | 'removed' | 'renamed';
    additions: number;
    deletions: number;
}

export interface SummaryResponse {
    timeline: TimelinePoint[];
    totalCommits: number;
    availablePeriods: TimeRange[];
    defaultPeriod: TimeRange;
    repoCreatedAt: string;
    oldestCommitDate: string;
}

export interface CodeChangesResponse {
    data: CodePoint[];
    totals: {
        additions: number;
        deletions: number;
        changes: number;
    };
    availablePeriods: TimeRange[];
    defaultPeriod: TimeRange;
}

export interface CommitsListResponse {
    commits: CommitItem[];
    total: number;
    hasMore: boolean;
    page: number;
}

export type CommitDetailResponse = CommitDetail;

export type LoadingState = 'idle' | 'loading' | 'success' | 'error' | 'empty' | 'partial';

export const CACHE_KEYS = {
    COMMIT_ACTIVITY: (owner: string, repo: string) => `github:${owner}:${repo}:commit_activity`,
    CODE_FREQUENCY: (owner: string, repo: string) => `github:${owner}:${repo}:code_frequency`,
    COMMITS_LIST: (owner: string, repo: string, range: TimeRange, page: number) => `github:${owner}:${repo}:commits:${range}:${page}`,
    COMMIT_DETAIL: (owner: string, repo: string, sha: string) => `github:${owner}:${repo}:commit:${sha}`,
    REPO_INFO: (owner: string, repo: string) => `github:${owner}:${repo}:repo_info`
} as const;

export const CACHE_TTL: Record<TimeRange | 'detail' | 'stats' | 'contributors', number> = {
    '7d': 60,
    '30d': 3 * 60,
    '6m': 10 * 60,
    '12m': 30 * 60,
    'detail': 60 * 60,
    'stats': 5 * 60,
    contributors: 60
};

export class GitHubAPIError extends Error {
    constructor(
        message: string,
        public statusCode: number,
        public rateLimitRemaining?: number,
        public rateLimitReset?: number
    ) {
        super(message);
        this.name = 'GitHubAPIError';
    }
}

export interface APIErrorResponse {
    error: string;
    code: 'RATE_LIMIT' | 'NOT_FOUND' | 'UNAUTHORIZED' | 'SERVER_ERROR' | 'NETWORK_ERROR' | 'INVALID_RANGE' | 'INVALID_PARAMS' | 'INVALID_REPOS' | 'INVALID_SHA' | 'SERVICE_UNAVAILABLE';
    retryAfter?: number;
}

export interface GitHubCommitActivity {
    week: number;
    total: number;
    days: number[];
}

export type GitHubCodeFrequency = [number, number, number][];

export interface GitHubCommitRaw {
    sha: string;
    commit: {
        message: string;
        author: { name: string; email: string; date: string };
    };
    author?: {
        login: string;
        avatar_url: string;
        html_url: string;
    } | null;
    html_url: string;
}

export interface GitHubCommitDetailRaw extends GitHubCommitRaw {
    stats: { additions: number; deletions: number; total: number };
    files: Array<{
        filename: string;
        status: string;
        additions: number;
        deletions: number;
    }>;
}

export interface GitHubRepoInfo {
    created_at: string;
    pushed_at: string;
    stargazers_count: number;
    forks_count: number;
    open_issues_count: number;
    size: number;
    default_branch: string;
}

export interface GitHubContributor {
    login: string;
    avatar_url: string;
    contributions: number;
    html_url: string;
}

export interface Contributor {
    username: string;
    avatar: string;
    commits: number;
    profileUrl: string;
}

export interface LanguageStats {
    name: string;
    bytes: number;
    percentage: number;
    color: string;
}

export interface RepoStats {
    stars: number;
    forks: number;
    issues: number;
    size: number;
    lastPush: string;
    defaultBranch: string;
    totalCommits: number;
    totalAdditions: number;
    totalDeletions: number;
}

export interface ExtendedStatsResponse {
    stats: RepoStats;
    languages: LanguageStats[];
    contributors: Contributor[];
    codeChanges: CodePoint[];
}

export interface MultiRepoTimelinePoint {
    date: string;
    label: string;

    [repoName: string]: string | number;
}

export interface RepoTimeline {
    repoName: string;
    repoDisplayName: string;
    color: string;
    data: TimelinePoint[];
    totalCommits: number;
}

export interface MultiRepoStatsResponse extends ExtendedStatsResponse {
    timelines: RepoTimeline[];
    combinedTimeline: MultiRepoTimelinePoint[];
    availablePeriods: TimeRange[];
    defaultPeriod: TimeRange;
}

export const REPO_COLORS: string[] = [
    '#3b82f6',
    '#8b5cf6',
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#06b6d4',
    '#ec4899',
    '#84cc16'
];
