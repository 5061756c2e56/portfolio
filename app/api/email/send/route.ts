import {
    NextRequest,
    NextResponse
} from 'next/server';
import { incrementEmailCounter } from '@/lib/db';
import {
    rateLimit,
    validateContentType,
    validateOrigin,
    validateUserAgent
} from '@/lib/rate-limit';
import {
    type EmailFormData,
    sanitizeEmailForm,
    validateEmailForm
} from '@/lib/email-validation';

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
    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    const privateKey = process.env.EMAILJS_PRIVATE_KEY;

    if (!serviceId || !templateId || !publicKey) {
        const missing = [];
        if (!serviceId) missing.push('NEXT_PUBLIC_EMAILJS_SERVICE_ID');
        if (!templateId) missing.push('NEXT_PUBLIC_EMAILJS_TEMPLATE_ID');
        if (!publicKey) missing.push('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY');

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
        const templateParams = {
            to_email: 'contact@paulviandier.com',
            from_name: data.from_name,
            from_email: data.from_email,
            subject: data.subject,
            message: data.message
        };

        const formData = new URLSearchParams();
        formData.append('service_id', serviceId);
        formData.append('template_id', templateId);
        formData.append('public_key', publicKey);
        
        if (privateKey) {
            formData.append('private_key', privateKey);
        }
        
        Object.entries(templateParams).forEach(([key, value]) => {
            formData.append(key, String(value));
        });

        const headers: HeadersInit = {
            'Content-Type': 'application/x-www-form-urlencoded'
        };

        const formDataBody = formData.toString();
        
        if (!isProduction) {
            const publicKeyInBody = formDataBody.match(/public_key=([^&]+)/)?.[1];
            const decodedPublicKey = publicKeyInBody ? decodeURIComponent(publicKeyInBody) : null;
            console.log('EmailJS Request params:', {
                service_id: serviceId,
                template_id: templateId,
                publicKey: publicKey ? `${publicKey.substring(0, 4)}...` : 'missing',
                publicKeyFull: publicKey,
                publicKeyInBody: publicKeyInBody,
                decodedPublicKey: decodedPublicKey,
                matches: decodedPublicKey === publicKey,
                hasPublicKey: !!publicKey,
                hasPrivateKey: !!privateKey,
                usePrivateKey: !!privateKey,
                formDataKeys: Array.from(formData.keys()),
                formDataString: formDataBody.replace(/private_key=[^&]+|public_key=[^&]+/g, (match) => match.substring(0, 15) + '...')
            });
        }

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), EMAILJS_TIMEOUT);

        const response = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
            method: 'POST',
            headers,
            body: formDataBody,
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
                    templateId: templateId ? '***' : 'missing',
                    publicKey: publicKey ? `${publicKey.substring(0, 4)}...` : 'missing',
                    hasPrivateKey: !!privateKey
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

export async function POST(request: NextRequest) {
    if (request.method !== 'POST') {
        return NextResponse.json(
            { error: 'Méthode non autorisée' },
            {
                status: 405,
                headers: {
                    'Allow': 'POST',
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

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

    if (!validateUserAgent(request)) {
        return NextResponse.json(
            { error: 'Requête non autorisée' },
            {
                status: 403,
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }

    const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;
    if (!publicKey && !isProduction) {
        console.error('NEXT_PUBLIC_EMAILJS_PUBLIC_KEY is not set. Check your .env.local file.');
    }

    const rateLimitResult = rateLimit(request);

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

        const validation = validateEmailForm(body as EmailFormData);
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

        const sanitizedData = sanitizeEmailForm(body as EmailFormData);

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

        let newCount = null;
        try {
            newCount = await incrementEmailCounter();
        } catch (error) {
            console.error('Erreur incrémentation compteur:', error);
        }

        return NextResponse.json(
            {
                success: true,
                count: newCount
            },
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
                headers: {
                    'X-Content-Type-Options': 'nosniff',
                    'X-Frame-Options': 'DENY'
                }
            }
        );
    }
}