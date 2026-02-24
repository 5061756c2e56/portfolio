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
import { getEmailCounter } from '@/lib/db';
import { enqueueEmailJob, kickEmailQueueWorker } from '@/lib/email-queue';
import { runEmailAntiSpamCheck } from '@/lib/email-anti-spam';
import { rateLimit, validateContentType, validateOrigin } from '@/lib/rate-limit';
import { type EmailFormData, sanitizeEmailForm, validateEmailForm } from '@/lib/email-validation';
import { getClientIP } from '@/lib/request-utils';

const isProduction = process.env.NODE_ENV === 'production';

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null;
}

function getStringField(obj: UnknownRecord, key: string): string | undefined {
    const value = obj[key];
    return typeof value === 'string' ? value : undefined;
}

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return false;

    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });

    const data: unknown = await response.json().catch(() => null);
    return isRecord(data) && data.success === true;
}

function buildSecurityHeaders(rateRemaining?: number): HeadersInit {
    return {
        'X-RateLimit-Remaining': rateRemaining?.toString() ?? '0',
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'DENY',
        'Cache-Control': 'no-store'
    };
}

export async function POST(request: NextRequest) {
    if (!validateContentType(request, 'application/json')) {
        return NextResponse.json(
            { error: 'Content-Type invalide' },
            { status: 400, headers: buildSecurityHeaders() }
        );
    }

    const rateLimitResult = await rateLimit(request);
    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requetes. Veuillez reessayer plus tard.' },
            {
                status: 429,
                headers: {
                    ...buildSecurityHeaders(0),
                    'Retry-After': '60'
                }
            }
        );
    }

    if (!validateOrigin(request)) {
        return NextResponse.json(
            { error: 'Origine non autorisee' },
            { status: 403, headers: buildSecurityHeaders(rateLimitResult.remaining) }
        );
    }

    try {
        const rawBody: unknown = await request.json().catch(() => {
            throw new Error('Invalid JSON');
        });

        if (!isRecord(rawBody)) {
            return NextResponse.json(
                { error: 'Données invalides' },
                { status: 400, headers: buildSecurityHeaders(rateLimitResult.remaining) }
            );
        }

        const turnstileToken = rawBody.turnstileToken;
        if (!turnstileToken || typeof turnstileToken !== 'string') {
            return NextResponse.json(
                { error: 'Captcha requis' },
                { status: 400, headers: buildSecurityHeaders(rateLimitResult.remaining) }
            );
        }

        const ip = getClientIP(request);
        const turnstileOk = await verifyTurnstile(turnstileToken, ip);
        if (!turnstileOk) {
            return NextResponse.json(
                { error: 'Captcha invalide' },
                { status: 403, headers: buildSecurityHeaders(rateLimitResult.remaining) }
            );
        }

        const payload: Partial<EmailFormData> = {
            from_name: getStringField(rawBody, 'from_name'),
            from_email: getStringField(rawBody, 'from_email'),
            subject: getStringField(rawBody, 'subject'),
            message: getStringField(rawBody, 'message')
        };

        const validation = validateEmailForm(payload);
        if (!validation.valid) {
            return NextResponse.json(
                { error: isProduction ? 'Donnees invalides' : Object.values(validation.errors)[0] },
                { status: 400, headers: buildSecurityHeaders(rateLimitResult.remaining) }
            );
        }

        const sanitizedData = sanitizeEmailForm(payload as EmailFormData);
        const antiSpamResult = await runEmailAntiSpamCheck({
            ip,
            data: sanitizedData,
            honeypot: getStringField(rawBody, 'website')
        });

        if (!antiSpamResult.allowed) {
            return NextResponse.json(
                { error: antiSpamResult.error || 'Message bloqué par la protection anti-spam' },
                {
                    status: 429,
                    headers: {
                        ...buildSecurityHeaders(rateLimitResult.remaining),
                        ...(
                            antiSpamResult.retryAfterSeconds
                                ? { 'Retry-After': antiSpamResult.retryAfterSeconds.toString() }
                                : {}
                        )
                    }
                }
            );
        }

        const current = await getEmailCounter();
        if (current.count >= 200) {
            return NextResponse.json(
                { error: 'Limite mensuelle de 200 emails atteinte' },
                { status: 429, headers: buildSecurityHeaders(rateLimitResult.remaining) }
            );
        }

        const enqueueResult = await enqueueEmailJob(sanitizedData, {
            ip,
            userAgent: request.headers.get('user-agent') || undefined
        });

        if (!enqueueResult.accepted) {
            return NextResponse.json(
                { error: enqueueResult.error || 'Service temporairement indisponible' },
                { status: 503, headers: buildSecurityHeaders(rateLimitResult.remaining) }
            );
        }

        kickEmailQueueWorker();

        return NextResponse.json(
            {
                success: true,
                queued: true,
                queueId: enqueueResult.queueId,
                queuePosition: enqueueResult.position,
                count: current.count
            },
            {
                status: 202,
                headers: buildSecurityHeaders(rateLimitResult.remaining)
            }
        );
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        const errorStack = error instanceof Error ? error.stack : undefined;

        if (!isProduction) {
            console.error('[Email Send API]', {
                message: errorMessage.slice(0, 200),
                stack: errorStack ? errorStack.slice(0, 500) : undefined
            });
        } else {
            console.error('[Email Send API]', 'Internal server error');
        }

        return NextResponse.json(
            { error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : errorMessage },
            { status: 500, headers: buildSecurityHeaders() }
        );
    }
}
