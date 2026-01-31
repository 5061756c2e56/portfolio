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

import { NextRequest, NextResponse } from 'next/server';
import { apiError } from './errors';
import { ALLOWED_REPOSITORIES, isAllowedRepository, RepoParam, TimeRange, VALID_TIME_RANGES } from './types';

const MAX_REPOS_PARAM_LENGTH = 4096;
const MAX_REPOS_COUNT = 20;
const REPO_NAME_REGEX = /^[a-zA-Z0-9_.-]{1,100}$/;
const VALID_LOCALES = ['fr', 'en'] as const;

export interface ParseMultiRepoParamsOptions {
    defaultRange?: TimeRange;
    defaultLocale?: string;
}

export type ParseMultiRepoParamsResult =
    | { ok: true; repos: RepoParam[]; range: TimeRange; locale: string }
    | { ok: false; response: NextResponse };

function isValidRepoParam(r: unknown): r is RepoParam {
    return (
        typeof r === 'object' &&
        r !== null &&
        'owner' in r &&
        'name' in r &&
        typeof (
            r as RepoParam
        ).owner === 'string' &&
        typeof (
            r as RepoParam
        ).name === 'string' &&
        REPO_NAME_REGEX.test((
            r as RepoParam
        ).owner) &&
        REPO_NAME_REGEX.test((
            r as RepoParam
        ).name)
    );
}

export function parseMultiRepoQueryParams(
    request: NextRequest,
    options: ParseMultiRepoParamsOptions = {}
): ParseMultiRepoParamsResult {
    const { defaultRange = '12m', defaultLocale = 'fr' } = options;
    const { searchParams } = new URL(request.url);

    const range = (
                      searchParams.get('range') as TimeRange | null
                  ) || defaultRange;
    if (!VALID_TIME_RANGES.includes(range)) {
        const { payload, status } = apiError('INVALID_RANGE');
        return { ok: false, response: NextResponse.json(payload, { status }) };
    }

    const localeRaw = searchParams.get('locale') || defaultLocale;
    const locale = VALID_LOCALES.includes(localeRaw as ( typeof VALID_LOCALES )[number])
        ? localeRaw
        : defaultLocale;

    let repos: RepoParam[];
    const reposParam = searchParams.get('repos');
    if (reposParam) {
        if (reposParam.length > MAX_REPOS_PARAM_LENGTH) {
            const { payload, status } = apiError('INVALID_PARAMS');
            return { ok: false, response: NextResponse.json(payload, { status }) };
        }
        try {
            const parsed = JSON.parse(reposParam) as unknown;
            if (!Array.isArray(parsed) || parsed.length > MAX_REPOS_COUNT) {
                const { payload, status } = apiError('INVALID_PARAMS');
                return { ok: false, response: NextResponse.json(payload, { status }) };
            }
            repos = parsed.filter(isValidRepoParam);
        } catch {
            const { payload, status } = apiError('INVALID_PARAMS');
            return { ok: false, response: NextResponse.json(payload, { status }) };
        }
    } else {
        repos = ALLOWED_REPOSITORIES.map(r => (
            { owner: r.owner, name: r.name }
        ));
    }

    const validRepos = repos.filter(r => isAllowedRepository(r.owner, r.name));
    if (validRepos.length === 0) {
        const { payload, status } = apiError('INVALID_REPOS');
        return { ok: false, response: NextResponse.json(payload, { status }) };
    }

    return { ok: true, repos: validRepos, range, locale };
}
