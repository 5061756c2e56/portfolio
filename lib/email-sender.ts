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

import { type EmailFormData } from '@/lib/email-validation';

const EMAILJS_TIMEOUT = 10000;
const isProduction = process.env.NODE_ENV === 'production';

type UnknownRecord = Record<string, unknown>;

interface EmailJSTemplateParams {
    to_email: string;
    from_name: string;
    from_email: string;
    subject: string;
    message: string;
}

interface EmailJSRequestBody {
    service_id: string;
    template_id: string;
    user_id: string;
    template_params: EmailJSTemplateParams;
    accessToken?: string;
}

export interface SendEmailResult {
    success: boolean;
    error?: string;
    retryable: boolean;
}

function isRecord(value: unknown): value is UnknownRecord {
    return typeof value === 'object' && value !== null;
}

function stringifyEmailJSError(details: unknown): string | null {
    if (!isRecord(details)) return null;

    const text = (
        typeof details.text === 'string'
            ? details.text
            : typeof details.error === 'string'
                ? details.error
                : typeof details.message === 'string'
                    ? details.message
                    : null
    );

    if (text) return text;

    try {
        return JSON.stringify(details);
    } catch {
        return null;
    }
}

function isRetryableStatus(status: number): boolean {
    return status === 408 || status === 425 || status === 429 || status >= 500;
}

function toSafeErrorMessage(error: unknown): string {
    if (error instanceof Error) {
        return error.message.slice(0, 300);
    }
    return 'Erreur inconnue lors de l\'envoi de l\'email';
}

export async function sendEmailViaEmailJS(data: EmailFormData): Promise<SendEmailResult> {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey) {
        const missing: string[] = [];
        if (!serviceId) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
        if (!templateId) missing.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missing.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');

        return {
            success: false,
            retryable: false,
            error: isProduction
                ? 'Configuration EmailJS manquante. Veuillez utiliser votre client de messagerie.'
                : `Configuration EmailJS manquante: ${missing.join(', ')}`
        };
    }

    const templateParams: EmailJSTemplateParams = {
        to_email: 'contact@paulviandier.com',
        from_name: data.from_name,
        from_email: data.from_email,
        subject: data.subject,
        message: data.message
    };

    const requestBody: EmailJSRequestBody = {
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

    try {
        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody),
            signal: controller.signal
        });

        if (!response.ok) {
            let errorText = 'Erreur EmailJS';

            try {
                const contentType = response.headers.get('content-type');
                if (contentType && contentType.includes('application/json')) {
                    const errorDetails: unknown = await response.json();
                    errorText = stringifyEmailJSError(errorDetails) ?? errorText;
                } else {
                    errorText = await response.text();
                }
            } catch {
                errorText = `Erreur ${response.status}: ${response.statusText}`;
            }

            if (!isProduction) {
                console.error('[EmailJS Error]', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText.slice(0, 200)
                });
            }

            return {
                success: false,
                retryable: isRetryableStatus(response.status),
                error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : errorText
            };
        }

        return { success: true, retryable: false };
    } catch (err: unknown) {
        const message = toSafeErrorMessage(err);
        const isAbort = err instanceof Error && err.name === 'AbortError';
        const isNetwork = err instanceof Error && (
            err.message.includes('Network') ||
            err.message.includes('network') ||
            err.message.includes('fetch') ||
            err.message.includes('Failed to fetch')
        );

        if (!isProduction) {
            console.error('[EmailJS Exception]', message);
        }

        if (isAbort) {
            return {
                success: false,
                retryable: true,
                error: 'Le delai d\'attente a ete depasse'
            };
        }

        if (isNetwork) {
            return {
                success: false,
                retryable: true,
                error: 'Erreur de connexion reseau'
            };
        }

        return {
            success: false,
            retryable: false,
            error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : message
        };
    } finally {
        clearTimeout(timeoutId);
    }
}
