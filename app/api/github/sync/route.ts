import { NextRequest, NextResponse } from 'next/server';
import { syncAllRepositories, syncRepository } from '@/lib/github/sync';
import { isAllowedRepository } from '@/lib/github/types';

export async function POST(request: NextRequest) {
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!adminSecret) {
        return NextResponse.json(
            { error: 'Admin secret not configured' },
            { status: 500 }
        );
    }

    if (authHeader !== `Bearer ${adminSecret}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const { searchParams } = new URL(request.url);
    const owner = searchParams.get('owner');
    const repo = searchParams.get('repo');

    try {
        if (owner && repo) {
            if (!isAllowedRepository(owner, repo)) {
                return NextResponse.json(
                    { error: 'Repository not allowed' },
                    { status: 400 }
                );
            }

            const result = await syncRepository(owner, repo);
            return NextResponse.json(result);
        }

        const results = await syncAllRepositories();
        return NextResponse.json(results);

    } catch (error) {
        console.error('[Sync API] Error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Sync failed' },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest) {
    const adminSecret = process.env.ADMIN_SECRET;
    const authHeader = request.headers.get('authorization');

    if (!adminSecret || authHeader !== `Bearer ${adminSecret}`) {
        return NextResponse.json(
            { error: 'Unauthorized' },
            { status: 401 }
        );
    }

    const { getPrisma } = await import('@/lib/prisma');
    const prisma = getPrisma();

    if (!prisma) {
        return NextResponse.json(
            { error: 'Database not configured' },
            { status: 500 }
        );
    }

    const repositories = await prisma.repository.findMany({
        include: {
            _count: {
                select: { commits: true }
            }
        },
        orderBy: { name: 'asc' }
    });

    const recentLogs = await prisma.syncLog.findMany({
        take: 10,
        orderBy: { startedAt: 'desc' }
    });

    return NextResponse.json({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        repositories: repositories.map((r: any) => (
            {
                owner: r.owner,
                name: r.name,
                displayName: r.displayName,
                commitsCount: r._count.commits,
                lastSyncAt: r.lastSyncAt
            }
        )),
        recentSyncs: recentLogs
    });
}
