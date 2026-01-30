import { NextRequest } from 'next/server';
import { DEFAULT_OWNER, DEFAULT_REPO, getCommitDetail } from '@/lib/github/api';
import { withCache } from '@/lib/github/cache';
import { apiError } from '@/lib/github/errors';
import { createJsonResponse, validateRequest } from '@/lib/github/security';
import { CACHE_KEYS, CACHE_TTL, CommitDetailResponse, GitHubAPIError, isAllowedRepository } from '@/lib/github/types';

const SHA_REGEX = /^[a-fA-F0-9]{7,40}$/;

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ sha: string }> }
) {
    const securityCheck = await validateRequest(request);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    try {
        const owner = (request.nextUrl.searchParams.get('owner') || DEFAULT_OWNER).slice(0, 100);
        const repo = (request.nextUrl.searchParams.get('repo') || DEFAULT_REPO).slice(0, 100);
        const { sha } = await params;

        if (!isAllowedRepository(owner, repo)) {
            const { payload, status } = apiError('UNAUTHORIZED', { message: 'Repository not allowed' });
            return createJsonResponse(payload, { status }, securityCheck);
        }

        if (!sha || !SHA_REGEX.test(sha)) {
            const { payload, status } = apiError('INVALID_SHA');
            return createJsonResponse(payload, { status }, securityCheck);
        }

        const { data: commit } = await withCache(
            CACHE_KEYS.COMMIT_DETAIL(owner, repo, sha),
            CACHE_TTL.detail,
            () => getCommitDetail(owner, repo, sha)
        );

        return createJsonResponse(commit as CommitDetailResponse, {
            headers: {
                'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate'
            }
        }, securityCheck);
    } catch (error) {
        console.error('[GitHub Commit Detail API]', error);

        if (error instanceof GitHubAPIError) {
            if (error.statusCode === 404) {
                const { payload, status } = apiError('NOT_FOUND', { message: 'Commit not found' });
                return createJsonResponse(payload, { status }, securityCheck);
            }
            if (error.statusCode === 401) {
                const { payload, status } = apiError('UNAUTHORIZED', {
                    message: 'GitHub configuration error',
                    status: 401
                });
                return createJsonResponse(payload, { status }, securityCheck);
            }
        }

        const { payload, status } = apiError('SERVER_ERROR');
        return createJsonResponse(payload, { status }, securityCheck);
    }
}
