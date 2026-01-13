import { NextRequest, NextResponse } from 'next/server';
import { rateLimit, validateOrigin } from '@/lib/rate-limit';

const GITHUB_USERNAME = '5061756c2e56';
const GITHUB_API_BASE = 'https://api.github.com';

async function fetchGitHubStats() {
    try {
        const [userResponse, reposResponse] = await Promise.all([
            fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'portfolio-app'
                },
                next: { revalidate: 300 }
            }),
            fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100&type=public`, {
                headers: {
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'portfolio-app'
                },
                next: { revalidate: 300 }
            })
        ]);

        if (!userResponse.ok || !reposResponse.ok) {
            if (process.env.NODE_ENV !== 'production') {
                console.error('[GitHub API] Request failed');
            }
            return null;
        }

        const userData = await userResponse.json();
        const reposData = await reposResponse.json();

        const totalStars = reposData.reduce((sum: number, repo: { stargazers_count: number }) => sum
                                                                                                 + repo.stargazers_count, 0);
        const totalForks = reposData.reduce((sum: number, repo: { forks_count: number }) => sum + repo.forks_count, 0);

        return {
            publicRepos: userData.public_repos || 0,
            totalStars,
            totalForks,
            followers: userData.followers || 0
        };
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[GitHub API] Error fetching stats');
        }
        return null;
    }
}

export async function GET(request: NextRequest) {
    if (request.method !== 'GET') {
        return NextResponse.json(
            { error: 'Méthode non autorisée' },
            {
                status: 405,
                headers: {
                    'Allow': 'GET',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    const rateLimitResult = await rateLimit(request);

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
            {
                status: 429,
                headers: {
                    'Retry-After': '60',
                    'X-RateLimit-Remaining': '0',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    if (!validateOrigin(request)) {
        return NextResponse.json(
            { error: 'Origine non autorisée' },
            {
                status: 403,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    try {
        const stats = await fetchGitHubStats();

        if (!stats) {
            // Retourner des valeurs par défaut si l'API GitHub échoue
            return NextResponse.json(
                {
                    publicRepos: 0,
                    totalStars: 0,
                    totalForks: 0,
                    followers: 0
                },
                {
                    status: 200,
                    headers: {
                        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY',
                        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
                    }
                }
            );
        }

        return NextResponse.json(
            stats,
            {
                status: 200,
                headers: {
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
                }
            }
        );
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[GitHub Stats API] Error');
        }
        return NextResponse.json(
            {
                publicRepos: 0,
                totalStars: 0,
                totalForks: 0,
                followers: 0
            },
            {
                status: 200,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120'
                }
            }
        );
    }
}