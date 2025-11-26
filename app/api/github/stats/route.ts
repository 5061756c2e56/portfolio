import {
    NextRequest,
    NextResponse
} from 'next/server';
import {
    getSecurityHeaders,
    validateOrigin,
    validateUserAgent,
    validatePayloadSize,
    getCorsHeaders,
    createSecurityResponse
} from '@/lib/api-security';
import { rateLimit } from '@/lib/rate-limit';

const GITHUB_USERNAME = '5061756c2e56';
const GITHUB_API_BASE = 'https://api.github.com';

async function fetchGitHubData(endpoint: string) {
    try {
        const response = await fetch(`${GITHUB_API_BASE}${endpoint}`, {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            },
            next: { revalidate: 3600 }
        });

        if (!response.ok) {
            throw new Error(`GitHub API error: ${response.status}`);
        }

        return await response.json();
    } catch (error) {
        console.error(`Error fetching GitHub data from ${endpoint}:`, error);
        return null;
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') {
        return createSecurityResponse('Méthode non autorisée', 405, { 'Allow': 'GET' });
    }

    if (!validateUserAgent(request)) {
        return createSecurityResponse('Requête non autorisée', 403);
    }

    if (!validateOrigin(request)) {
        return createSecurityResponse('Origine non autorisée', 403);
    }

    if (!validatePayloadSize(request)) {
        return createSecurityResponse('Requête trop volumineuse', 413);
    }

    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
            {
                status: 429,
                headers: {
                    ...getSecurityHeaders(),
                    'Retry-After': '60',
                    'X-RateLimit-Remaining': '0'
                }
            }
        );
    }

    try {
        const [repos, user] = await Promise.all([
            fetchGitHubData(`/users/${GITHUB_USERNAME}/repos?sort=updated&per_page=100`),
            fetchGitHubData(`/users/${GITHUB_USERNAME}`)
        ]);

        if (!repos || !user) {
            return NextResponse.json(
                { error: 'Failed to fetch GitHub data' },
                {
                    status: 500,
                    headers: getSecurityHeaders()
                }
            );
        }

        const publicRepos = repos.filter((repo: any) => !repo.fork);
        const totalStars = publicRepos.reduce((sum: number, repo: any) => sum + repo.stargazers_count, 0);
        const totalForks = publicRepos.reduce((sum: number, repo: any) => sum + repo.forks_count, 0);

        const recentRepos = publicRepos
            .slice(0, 6)
            .map((repo: any) => ({
                name: repo.name,
                description: repo.description,
                url: repo.html_url,
                stars: repo.stargazers_count,
                forks: repo.forks_count,
                language: repo.language,
                updatedAt: repo.updated_at
            }));

        const origin = request.headers.get('origin');
        return NextResponse.json(
            {
                username: user.login,
                publicRepos: publicRepos.length,
                totalStars,
                totalForks,
                followers: user.followers,
                following: user.following,
                recentRepos
            },
            {
                headers: {
                    ...getCorsHeaders(origin),
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400, max-age=3600',
                    'Vary': 'Origin',
                    'X-Content-Type-Options': 'nosniff'
                }
            }
        );
    } catch (error) {
        console.error('Error in GitHub stats API:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            {
                status: 500,
                headers: getSecurityHeaders()
            }
        );
    }
}