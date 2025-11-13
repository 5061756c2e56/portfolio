import emailjs from '@emailjs/browser';

export interface EmailFormData {
    from_name: string;
    from_email: string;
    subject: string;
    message: string;
}

export async function sendEmail(data: EmailFormData): Promise<{ success: boolean; error?: string }> {
    try {
        const serviceId = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
        const templateId = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
        const publicKey = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

        if (!serviceId || !templateId || !publicKey) {
            return {
                success: false,
                error: 'Configuration EmailJS manquante'
            };
        }

        emailjs.init(publicKey);

        const templateParams = {
            to_email: 'contact@paulviandier.com',
            from_name: data.from_name,
            from_email: data.from_email,
            subject: data.subject,
            message: data.message
        };

        await emailjs.send(serviceId, templateId, templateParams);

        try {
            await fetch('/api/email/increment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'same-origin'
            });
        } catch (error) {
            console.error('Erreur incrémentation compteur:', error);
        }

        return { success: true };
    } catch (error) {
        console.error('Erreur EmailJS:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Erreur inconnue'
        };
    }
}