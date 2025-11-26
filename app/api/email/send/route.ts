import {
    NextRequest,
    NextResponse
} from 'next/server';

import { rateLimit } from '@/lib/rate-limit';
import {
    getSecurityHeaders,
    validateOrigin,
    validateUserAgent,
    validateContentType,
    validatePayloadSize,
    getCorsHeaders,
    createSecurityResponse
} from '@/lib/api-security';

import {
    type EmailFormData,
    sanitizeEmailForm,
    validateEmailForm
} from '@/lib/email-validation';

import { incrementEmailCounter } from '@/lib/db';

const isProduction = process.env.NODE_ENV === 'production';
const EMAILJS_TIMEOUT = 10000;

function createTimeoutPromise(ms: number): Promise<never> {
    return new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Timeout')), ms);
    });
}

async function sendEmailViaEmailJS(data: EmailFormData): Promise<{ success: boolean; error?: string }> {
    const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
    const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || process.env.EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !privateKey) {
        const missing = [];
        if (!serviceId) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
        if (!templateId) missing.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missing.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY or EMAILJS_PUBLIC_KEY');
        if (!privateKey) missing.push('EMAILJS_PRIVATE_KEY');

        if (!isProduction) {
            console.warn('EmailJS non configuré en développement. Les emails ne seront pas envoyés.');
            console.warn('Variables manquantes:', missing.join(', '));
            console.warn('Données du formulaire:', {
                from_name: data.from_name,
                from_email: data.from_email,
                subject: data.subject,
                message: data.message.substring(0, 100) + '...'
            });
        }

        return {
            success: false,
            error: isProduction
                ? 'Configuration EmailJS manquante. Veuillez utiliser votre client de messagerie.'
                : `Configuration EmailJS manquante en développement: ${missing.join(', ')}. Utilisez votre client de messagerie.`
        };
    }

    try {
        const payload = {
            service_id: serviceId,
            template_id: templateId,
            user_id: publicKey,
            accessToken: privateKey,
            template_params: {
                to_email: 'contact@paulviandier.com',
                from_name: data.from_name,
                from_email: data.from_email,
                subject: data.subject,
                message: data.message
            }
        };

        if (!isProduction) {
            console.log('EmailJS Request (server):', {
                service_id: serviceId,
                template_id: templateId,
                accessToken: privateKey ? `${privateKey.substring(0, 4)}...` : 'missing'
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), EMAILJS_TIMEOUT);

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorText = await response.text().catch(() => 'Erreur EmailJS');

            if (!isProduction) {
                console.error('EmailJS Error:', {
                    status: response.status,
                    statusText: response.statusText,
                    error: errorText,
                    serviceId: serviceId ? '***' : 'missing',
                    templateId: templateId ? '***' : 'missing'
                });
            }

            return {
                success: false,
                error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : errorText
            };
        }

        return { success: true };
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return {
                    success: false,
                    error: 'Le délai d\'attente a été dépassé'
                };
            }
            if (error.message.includes('Network') || error.message.includes('network')
                || error.message.includes('fetch') || error.message.includes('Failed to fetch')) {
                return {
                    success: false,
                    error: 'Erreur de connexion réseau'
                };
            }
            return {
                success: false,
                error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : error.message
            };
        }

        return {
            success: false,
            error: 'Erreur inconnue lors de l\'envoi de l\'email'
        };
    }
}

export async function OPTIONS(request: NextRequest) {
    const origin = request.headers.get('origin');
    return new NextResponse(null, {
        status: 204,
        headers: getCorsHeaders(origin)
    });
}

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return createSecurityResponse('Méthode non autorisée', 405, { 'Allow': 'POST' });
    }

    if (!validateContentType(request, 'application/json')) {
        return createSecurityResponse('Content-Type invalide', 400);
    }

    if (!validateUserAgent(request)) {
        return createSecurityResponse('Requête non autorisée', 403);
    }

    if (!validatePayloadSize(request)) {
        return createSecurityResponse('Requête trop volumineuse', 413);
    }

    if (!validateOrigin(request)) {
        return createSecurityResponse('Origine non autorisée', 403);
    }

    const privateKey = process.env.EMAILJS_PRIVATE_KEY;
    if (!privateKey && !isProduction) {
        console.error('EMAILJS_PRIVATE_KEY is not set. Check your .env.local file.');
    }

    const rateLimitResult = rateLimit(request);

    if (!rateLimitResult.allowed) {
        return NextResponse.json(
            { error: 'Trop de requêtes. Veuillez réessayer plus tard.' },
            {
                status: 429,
                headers: {
                    ...getSecurityHeaders(),
                    'Retry-After': '60',
                    'X-RateLimit-Remaining': '0'
                }
            }
        );
    }

    try {
        const body = await request.json().catch(() => {
            throw new Error('Invalid JSON');
        });

        const validation = validateEmailForm(body as EmailFormData);
        if (!validation.valid) {
            return NextResponse.json(
                { error: isProduction ? 'Données invalides' : Object.values(validation.errors)[0] },
                {
                    status: 400,
                    headers: getSecurityHeaders()
                }
            );
        }

        const sanitizedData = sanitizeEmailForm(body as EmailFormData);

        const emailResult = await sendEmailViaEmailJS(sanitizedData);

        if (!emailResult.success) {
            return NextResponse.json(
                { error: emailResult.error || 'Erreur lors de l\'envoi de l\'email' },
                {
                    status: 500,
                    headers: getSecurityHeaders()
                }
            );
        }

        let newCount = null;
        try {
            newCount = await incrementEmailCounter();
        } catch (error) {
            console.error('Erreur incrémentation compteur:', error);
        }

        const origin = request.headers.get('origin');
        return NextResponse.json(
            {
                success: true,
                count: newCount
            },
            {
                headers: {
                    ...getCorsHeaders(origin),
                    'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
                    'Cache-Control': 'no-store'
                }
            }
        );
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        const errorStack = error instanceof Error ? error.stack : undefined;

        console.error('Erreur API send:', {
            message: errorMessage,
            stack: errorStack,
            isProduction
        });

        return NextResponse.json(
            {
                error: isProduction ? 'Erreur lors de l\'envoi de l\'email' : errorMessage
            },
            {
                status: 500,
                headers: getSecurityHeaders()
            }
        );
    }
}