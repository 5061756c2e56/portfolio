import { type EmailFormData, validateEmailForm } from './email-validation';

const API_TIMEOUT = 15000;

export async function sendEmail(
    data: EmailFormData,
    turnstileToken: string
): Promise<{ success: boolean; error?: string; count?: number | null }> {
    const validation = validateEmailForm(data);
    if (!validation.valid) {
        const firstError = Object.values(validation.errors)[0];
        return { success: false, error: firstError || 'Données invalides' };
    }

    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

        const response = await fetch('/api/email/send', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'same-origin',
            signal: controller.signal,
            body: JSON.stringify({ ...data, turnstileToken })
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => (
                {}
            ));
            return {
                success: false,
                error: errorData.error || 'Erreur lors de l\'envoi de l\'email'
            };
        }

        const result = await response.json();
        return { success: true, count: result.count ?? null };
    } catch (error) {
        if (error instanceof Error) {
            if (error.name === 'AbortError') {
                return { success: false, error: 'Le délai d\'attente a été dépassé. Veuillez réessayer.' };
            }
            if (
                error.message.includes('Network') ||
                error.message.includes('network') ||
                error.message.includes('fetch') ||
                error.message.includes('Failed to fetch')
            ) {
                return { success: false, error: 'Erreur de connexion réseau' };
            }
        }
        return { success: false, error: 'Erreur inconnue lors de l\'envoi de l\'email' };
    }
}

export type { EmailFormData };