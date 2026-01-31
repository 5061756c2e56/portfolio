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
import { getEmailCounter, getKVInstance, incrementEmailCounter } from '@/lib/db';
import { rateLimit, validateContentType, validateOrigin } from '@/lib/rate-limit';
import { type EmailFormData, sanitizeEmailForm, validateEmailForm } from '@/lib/email-validation';

const isProduction = process.env.NODE_ENV === 'production';
const EMAILJS_TIMEOUT = 10000;
const EMAILJS_RATE_LIMIT_MS = 1100;
const EMAILJS_LAST_SENT_KEY = 'emailjs_last_sent';
const EMAILJS_LOCK_KEY = 'emailjs_lock';
const EMAILJS_LOCK_TTL = 2;

async function verifyTurnstile(token: string, ip?: string): Promise<boolean> {
    const secret = process.env.TURNSTILE_SECRET_KEY;
    if (!secret) return false;

    const formData = new URLSearchParams();
    formData.append('secret', secret);
    formData.append('response', token);
    if (ip) formData.append('remoteip', ip);

    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: formData.toString()
    });

    const data = await res.json().catch(() => null);
    return !!data?.success;
}

async function sendEmailViaEmailJS(data: EmailFormData): Promise<{ success: boolean; error?: string }> {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey) {
        const missing = [];
        if (!serviceId) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
        if (!templateId) missing.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missing.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');

        if (!isProduction) {
            console.warn('[EmailJS] Configuration manquante:', missing.join(', '));
        }

        return {
            success: false,
            error: isProduction
                ? 'Configuration EmailJS manquante. Veuillez utiliser votre client de messagerie.'
                : `Configuration EmailJS manquante en développement: ${missing.join(', ')}. Utilisez votre client de messagerie.`
        };
    }

    let lockAcquired = false;
    const { redis, hasRedis } = await getKVInstance();

    try {
        const maxWaitTime = 3000;
        const startTime = Date.now();

        if (hasRedis && redis) {
            while (!lockAcquired && (
                Date.now() - startTime
            ) < maxWaitTime) {
                const lastSent = await redis.get(EMAILJS_LAST_SENT_KEY);
                const now = Date.now();

                if (lastSent) {
                    const timeSinceLastSent = now - parseInt(lastSent, 10);
                    if (timeSinceLastSent < EMAILJS_RATE_LIMIT_MS) {
                        const waitTime = EMAILJS_RATE_LIMIT_MS - timeSinceLastSent;
                        await new Promise(resolve => setTimeout(resolve, waitTime));
                    }
                }

                const lockResult = await redis.set(EMAILJS_LOCK_KEY, '1', 'EX', EMAILJS_LOCK_TTL, 'NX');
                if (lockResult === 'OK') {
                    lockAcquired = true;
                } else {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }
            }

            if (!lockAcquired) {
                return {
                    success: false,
                    error: 'Service temporairement occupé. Veuillez réessayer dans quelques instants.'
                };
            }
        }

        const templateParams = {
            to_email: 'contact@paulviandier.com',
            from_name: data.from_name,
            from_email: data.from_email,
            subject: data.subject,
            message: data.message
        };

        const requestBody: any = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            template_params: templateParams
        };

        if (privateKey) {
            requestBody.accessToken = privateKey;
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), EMAILJS_TIMEOUT);

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (hasRedis && redis && response.ok) {
            await redis.set(EMAILJS_LAST_SENT_KEY, Date.now().toString());
        }

        if (!response.ok) {
            let errorText = 'Erreur EmailJS';
            let errorDetails: any = null;

            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    errorDetails = await response.json();
                    errorText =
                        errorDetails.text ||
                        errorDetails.error ||
                        errorDetails.message ||
                        JSON.stringify(errorDetails);
                } else {
                    errorText = await response.text();
                }
            } catch {
                try {
                    errorText = await response.text();
                } catch {
                    errorText = `Erreur ${response.status}: ${response.statusText}`;
                }
            }

            if (!isProduction) {
                console.error('[EmailJS Error]', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText.substring(0, 200)
                });
            }

            if (hasRedis && redis && lockAcquired) {
                await redis.del(EMAILJS_LOCK_KEY);
            }

            return {
                success: false,
                error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : errorText
            };
        }

        if (hasRedis && redis && lockAcquired) {
            await redis.del(EMAILJS_LOCK_KEY);
        }

        return { success: true };
    } catch (error) {
        if (hasRedis && redis && lockAcquired) {
            try {
                await redis.del(EMAILJS_LOCK_KEY);
            } catch {
            }
        }

        if (!isProduction && error instanceof Error) {
            console.error('[EmailJS Exception]', error.message.substring(0, 200));
        }

        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Le délai d\'attente a été dépassé' };
            }
            if (
                error.message.includes('Network') ||
                error.message.includes('network') ||
                error.message.includes('fetch') ||
                error.message.includes('Failed to fetch')
            ) {
                return { success: false, error: 'Erreur de connexion réseau' };
            }
            return { success: false, error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : error.message };
        }

        return { success: false, error: 'Erreur inconnue lors de l\'envoi de l\'email' };
    }
}

export async function POST(request: NextRequest) {
    if (!validateContentType(request, 'application/json')) {
        return NextResponse.json(
            { error: 'Content-Type invalide' },
            {
                status: 400,
                headers: {
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
        const body = await request.json().catch(() => {
            throw new Error('Invalid JSON');
        });

        const token = body?.turnstileToken;
        if (!token || typeof token !== 'string') {
            return NextResponse.json({ error: 'Captcha requis' }, { status: 400 });
        }

        const ip =
            request.headers.get('cf-connecting-ip') ||
            request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
            undefined;

        const ok = await verifyTurnstile(token, ip);
        if (!ok) {
            return NextResponse.json({ error: 'Captcha invalide' }, { status: 403 });
        }

        const payload = {
            from_name: body?.from_name,
            from_email: body?.from_email,
            subject: body?.subject,
            message: body?.message
        };

        const validation = validateEmailForm(payload);
        if (!validation.valid) {
            return NextResponse.json(
                { error: isProduction ? 'Données invalides' : Object.values(validation.errors)[0] },
                {
                    status: 400,
                    headers: {
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY'
                    }
                }
            );
        }

        const sanitizedData = sanitizeEmailForm(payload as EmailFormData);

        const current = await getEmailCounter();
        if (current.count >= 200) {
            return NextResponse.json({ error: 'Limite mensuelle de 200 emails atteinte' }, { status: 429 });
        }

        const emailResult = await sendEmailViaEmailJS(sanitizedData);

        if (!emailResult.success) {
            return NextResponse.json(
                { error: emailResult.error || 'Erreur lors de l\'envoi de l\'email' },
                {
                    status: 500,
                    headers: {
                        'X-Content-Type-Options': 'nosniff',
                        'X-Frame-Options': 'DENY'
                    }
                }
            );
        }

        const counterResult = await incrementEmailCounter();
        const nextCount = counterResult.count || (
            current.count + 1
        );

        return NextResponse.json(
            { success: true, count: nextCount },
            {
                headers: {
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY',
                    'Cache-Control': 'no-store'
                }
            }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        const errorStack = error instanceof Error ? error.stack : undefined;

        if (!isProduction) {
            console.error('[API Error]', {
                message: errorMessage.substring(0, 200),
                stack: errorStack ? errorStack.substring(0, 500) : undefined
            });
        } else {
            console.error('[API Error]', 'Internal server error');
        }

        return NextResponse.json(
            { error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : errorMessage },
            {
                status: 500,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }
}