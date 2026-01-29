import { NextRequest, NextResponse } from 'next/server';
import { DEFAULT_OWNER, DEFAULT_REPO, getCommitDetail } from '@/lib/github/api';
import { withCache } from '@/lib/github/cache';
import { addSecurityHeaders, validateRequest } from '@/lib/github/security';
import { CACHE_KEYS, CACHE_TTL, CommitDetailResponse, GitHubAPIError, isAllowedRepository } from '@/lib/github/types';

const SHA_REGEX = /^[a-fA-F0-9]{7,40}$/;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sha: string }> }
) {
    const securityCheck = validateRequest(request);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    try {
        const owner = request.nextUrl.searchParams.get('owner') || DEFAULT_OWNER;
        const repo = request.nextUrl.searchParams.get('repo') || DEFAULT_REPO;
        const { sha } = await params;

        if (!isAllowedRepository(owner, repo)) {
            return addSecurityHeaders(NextResponse.json(
                { error: 'Repository non autorisé', code: 'UNAUTHORIZED' },
                { status: 403 }
            ));
        }

        if (!sha || !SHA_REGEX.test(sha)) {
            return addSecurityHeaders(NextResponse.json(
                { error: 'SHA invalide', code: 'INVALID_SHA' },
                { status: 400 }
            ));
        }

        const { data: commit } = await withCache(
            CACHE_KEYS.COMMIT_DETAIL(owner, repo, sha),
            CACHE_TTL.detail,
            () => getCommitDetail(owner, repo, sha)
        );

        return addSecurityHeaders(NextResponse.json(commit as CommitDetailResponse, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
            }
        }));
    } catch (error) {
        console.error('[GitHub Commit Detail API]', error);

        if (error instanceof GitHubAPIError) {
            if (error.statusCode === 404) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'Commit non trouvé', code: 'NOT_FOUND' },
                    { status: 404 }
                ));
            }
            if (error.statusCode === 401) {
                return addSecurityHeaders(NextResponse.json(
                    { error: 'Configuration GitHub manquante', code: 'UNAUTHORIZED' },
                    { status: 401 }
                ));
            }
        }

        return addSecurityHeaders(NextResponse.json(
            { error: 'Erreur serveur', code: 'SERVER_ERROR' },
            { status: 500 }
        ));
    }
}
