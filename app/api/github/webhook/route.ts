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
import crypto from 'crypto';
import { getPrisma } from '@/lib/prisma';
import { getClientIP } from '@/lib/request-utils';
import { addCommitFromWebhook } from '@/lib/github/sync';
import { isAllowedRepository } from '@/lib/github/types';

// GitHub webhook IPs (CIDR ranges)
// Source: https://api.github.com/meta
const GITHUB_WEBHOOK_IPS = [
    '192.30.252.0/22',
    '185.199.108.0/22',
    '140.82.112.0/20',
    '143.55.64.0/20',
    '2a0a:a440::/29',
    '2606:50c0::/32'
];

function ipToLong(ip: string): number {
    const parts = ip.split('.').map(Number);
    return (
               (
                   parts[0] << 24
               ) | (
                   parts[1] << 16
               ) | (
                   parts[2] << 8
               ) | parts[3]
           ) >>> 0;
}

function isIPv4InCIDR(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const mask = ~(
        (
            1 << (
                32 - parseInt(bits)
            )
        ) - 1
    ) >>> 0;
    const ipLong = ipToLong(ip);
    const rangeLong = ipToLong(range);
    return (
               ipLong & mask
           ) === (
               rangeLong & mask
           );
}

function expandIPv6(ip: string): string {
    const parts = ip.split(':');
    const emptyIndex = parts.indexOf('');

    if (emptyIndex !== -1) {
        const missing = 8 - parts.filter(p => p !== '').length;
        const expansion = Array(missing).fill('0000');
        parts.splice(emptyIndex, 1, ...expansion);
    }

    return parts.map(p => p.padStart(4, '0')).join(':');
}

function ipv6ToBigInt(ip: string): bigint {
    const expanded = expandIPv6(ip);
    const hex = expanded.replace(/:/g, '');
    return BigInt('0x' + hex);
}

function isIPv6InCIDR(ip: string, cidr: string): boolean {
    const [range, bits] = cidr.split('/');
    const prefixLen = parseInt(bits);
    const mask = (
                     BigInt(1) << BigInt(128 - prefixLen)
                 ) - BigInt(1);
    const inverseMask = ~mask;

    const ipBigInt = ipv6ToBigInt(ip);
    const rangeBigInt = ipv6ToBigInt(range);

    return (
               ipBigInt & inverseMask
           ) === (
               rangeBigInt & inverseMask
           );
}

function isGitHubIP(ip: string): boolean {
    const cleanIP = ip.replace(/^::ffff:/, '');
    const isIPv6 = cleanIP.includes(':');

    for (const cidr of GITHUB_WEBHOOK_IPS) {
        const cidrIsIPv6 = cidr.includes(':');

        if (isIPv6 && cidrIsIPv6) {
            if (isIPv6InCIDR(cleanIP, cidr)) return true;
        } else if (!isIPv6 && !cidrIsIPv6) {
            if (isIPv4InCIDR(cleanIP, cidr)) return true;
        }
    }

    return false;
}

interface GitHubPushPayload {
    ref: string;
    repository: {
        name: string;
        owner: {
            login: string;
            name?: string;
        };
    };
    commits: Array<{
        id: string;
        message: string;
        timestamp: string;
        url: string;
        author: {
            name: string;
            email: string;
        };
    }>;
    head_commit?: {
        id: string;
        message: string;
        timestamp: string;
        url: string;
        author: {
            name: string;
            email: string;
        };
    };
}

function verifySignature(payload: string, signature: string | null, secret: string): boolean {
    if (!signature) return false;

    const hmac = crypto.createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(payload).digest('hex');
    const sigBuf = Buffer.from(signature, 'utf8');
    const digestBuf = Buffer.from(digest, 'utf8');

    if (sigBuf.length !== digestBuf.length) return false;
    try {
        return crypto.timingSafeEqual(sigBuf, digestBuf);
    } catch {
        return false;
    }
}

export async function POST(request: NextRequest) {
    const prisma = getPrisma();
    if (!prisma) {
        console.error('[Webhook] Database not configured');
        return NextResponse.json(
            { error: 'Database not configured' },
            { status: 500 }
        );
    }

    const webhookSecret = process.env.GITHUB_WEBHOOK_SECRET;

    if (!webhookSecret) {
        console.error('[Webhook] GITHUB_WEBHOOK_SECRET not configured');
        return NextResponse.json(
            { error: 'Webhook not configured' },
            { status: 500 }
        );
    }

    if (process.env.NODE_ENV === 'production') {
        const clientIP = getClientIP(request);

        if (clientIP === 'unknown' || !clientIP || !isGitHubIP(clientIP)) {
            console.warn('[Webhook] Request from unauthorized IP:', clientIP);
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 403 }
            );
        }
    }

    const contentLength = request.headers.get('content-length');
    const MAX_WEBHOOK_BODY = 1024 * 1024;
    if (contentLength && parseInt(contentLength, 10) > MAX_WEBHOOK_BODY) {
        return NextResponse.json(
            { error: 'Payload too large' },
            { status: 413 }
        );
    }

    const rawBody = await request.text();
    if (rawBody.length > MAX_WEBHOOK_BODY) {
        return NextResponse.json(
            { error: 'Payload too large' },
            { status: 413 }
        );
    }

    const signature = request.headers.get('x-hub-signature-256');
    const event = request.headers.get('x-github-event');
    const deliveryId = request.headers.get('x-github-delivery');

    if (!verifySignature(rawBody, signature, webhookSecret)) {
        console.warn('[Webhook] Invalid signature');
        return NextResponse.json(
            { error: 'Invalid signature' },
            { status: 401 }
        );
    }

    let payload: GitHubPushPayload;
    try {
        payload = JSON.parse(rawBody);
    } catch {
        return NextResponse.json(
            { error: 'Invalid JSON payload' },
            { status: 400 }
        );
    }

    const webhookEvent = await prisma.webhookEvent.create({
        data: {
            eventType: event || 'unknown',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            payload: payload as any
        }
    });

    if (event === 'ping') {
        await prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: { processed: true, processedAt: new Date() }
        });

        return NextResponse.json({ message: 'pong' });
    }

    if (event !== 'push') {
        await prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: { processed: true, processedAt: new Date() }
        });

        return NextResponse.json({ message: 'Event ignored' });
    }

    const owner = payload.repository.owner.login;
    const repo = payload.repository.name;

    if (!isAllowedRepository(owner, repo)) {
        await prisma.webhookEvent.update({
            where: { id: webhookEvent.id },
            data: {
                processed: true,
                processedAt: new Date(),
                error: 'Repository not allowed'
            }
        });

        return NextResponse.json({ message: 'Repository not allowed' });
    }

    const commits = payload.commits || (
        payload.head_commit ? [payload.head_commit] : []
    );
    let addedCount = 0;

    for (const commit of commits) {
        const success = await addCommitFromWebhook(owner, repo, {
            sha: commit.id,
            message: commit.message,
            author: commit.author,
            timestamp: commit.timestamp,
            url: commit.url
        });

        if (success) addedCount++;
    }

    await prisma.webhookEvent.update({
        where: { id: webhookEvent.id },
        data: { processed: true, processedAt: new Date() }
    });

    return NextResponse.json({
        message: 'Push processed',
        commits: {
            received: commits.length,
            added: addedCount
        }
    });
}