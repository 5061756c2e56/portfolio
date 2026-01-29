import { NextRequest, NextResponse } from 'next/server';
import { getPatchnoteById, listPatchnotes } from '@/lib/patchnotes';
import { addSecurityHeaders, validateRequest } from '@/lib/github/security';

export async function GET(req: NextRequest) {
    const securityCheck = validateRequest(req);
    if (!securityCheck.allowed) {
        return securityCheck.response;
    }

    const { searchParams } = new URL(req.url);

    const lang = (
        searchParams.get('lang') ?? 'FR'
    ) as 'FR' | 'EN';
    const sort = (
        searchParams.get('sort') ?? 'newest'
    ) as 'newest' | 'oldest';
    const id = searchParams.get('id');

    if (id) {
        const one = await getPatchnoteById(id);
        return addSecurityHeaders(NextResponse.json(one, {
            headers: {
                'Cache-Control': 'private, no-store'
            }
        }), securityCheck.rateLimitRemaining);
    }

    const list = await listPatchnotes(lang, sort);
    return addSecurityHeaders(NextResponse.json(list, {
        headers: {
            'Cache-Control': 'private, no-store'
        }
    }), securityCheck.rateLimitRemaining);
}