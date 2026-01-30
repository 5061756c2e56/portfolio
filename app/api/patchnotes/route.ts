import { NextRequest } from 'next/server';
import { apiError } from '@/lib/github/errors';
import { createJsonResponse, validateRequest } from '@/lib/github/security';
import {
    getPatchnoteById,
    isValidPatchnoteId,
    isValidPatchnoteLang,
    isValidSortOrder,
    listPatchnotes
} from '@/lib/patchnotes';

export async function GET(req: NextRequest) {
    const securityCheck = await validateRequest(req);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    const { searchParams } = new URL(req.url);

    const langRaw = searchParams.get('lang') ?? 'FR';
    const sortRaw = searchParams.get('sort') ?? 'newest';
    const id = searchParams.get('id');

    if (id) {
        if (!isValidPatchnoteId(id)) {
            const { payload, status } = apiError('INVALID_PARAMS');
            return createJsonResponse(payload, { status }, securityCheck);
        }
        try {
            const one = await getPatchnoteById(id);
            return createJsonResponse(one, {
                headers: {
                    'Cache-Control': 'private, no-store'
                }
            }, securityCheck);
        } catch {
            const { payload, status } = apiError('NOT_FOUND');
            return createJsonResponse(payload, { status }, securityCheck);
        }
    }

    if (!isValidPatchnoteLang(langRaw) || !isValidSortOrder(sortRaw)) {
        const { payload, status } = apiError('INVALID_PARAMS');
        return createJsonResponse(payload, { status }, securityCheck);
    }

    const list = await listPatchnotes(langRaw, sortRaw);
    return createJsonResponse(list, {
        headers: {
            'Cache-Control': 'private, no-store'
        }
    }, securityCheck);
}