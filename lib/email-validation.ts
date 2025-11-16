const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

export interface EmailFormData {
    from_name: string;
    from_email: string;
    subject: string;
    message: string;
}

export interface ValidationResult {
    valid: boolean;
    errors: Partial<Record<keyof EmailFormData, string>>;
}

function sanitizeString(input: string): string {
    return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

export function validateEmailForm(data: EmailFormData): ValidationResult {
    const errors: Partial<Record<keyof EmailFormData, string>> = {};

    const sanitizedName = sanitizeString(data.from_name);
    if (!sanitizedName || sanitizedName.length < 3) {
        errors.from_name = 'Le nom doit contenir au moins 3 caractères';
    } else if (sanitizedName.length > MAX_NAME_LENGTH) {
        errors.from_name = `Le nom ne doit pas dépasser ${MAX_NAME_LENGTH} caractères`;
    }

    const sanitizedEmail = sanitizeString(data.from_email);
    if (!sanitizedEmail) {
        errors.from_email = 'L\'email est requis';
    } else if (!validateEmail(sanitizedEmail)) {
        errors.from_email = 'Veuillez entrer un email valide';
    }

    const sanitizedSubject = sanitizeString(data.subject);
    if (!sanitizedSubject || sanitizedSubject.length < 10) {
        errors.subject = 'Le sujet doit contenir au moins 10 caractères';
    } else if (sanitizedSubject.length > MAX_SUBJECT_LENGTH) {
        errors.subject = `Le sujet ne doit pas dépasser ${MAX_SUBJECT_LENGTH} caractères`;
    }

    const sanitizedMessage = sanitizeString(data.message);
    if (!sanitizedMessage || sanitizedMessage.length < 20) {
        errors.message = 'Le message doit contenir au moins 20 caractères';
    } else if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
        errors.message = `Le message ne doit pas dépasser ${MAX_MESSAGE_LENGTH} caractères`;
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

export function sanitizeEmailForm(data: EmailFormData): EmailFormData {
    return {
        from_name: sanitizeString(data.from_name).slice(0, MAX_NAME_LENGTH),
        from_email: sanitizeString(data.from_email).slice(0, MAX_EMAIL_LENGTH).toLowerCase(),
        subject: sanitizeString(data.subject).slice(0, MAX_SUBJECT_LENGTH),
        message: sanitizeString(data.message).slice(0, MAX_MESSAGE_LENGTH)
    };
}

export const EMAIL_LIMITS = {
    MAX_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_SUBJECT_LENGTH,
    MAX_MESSAGE_LENGTH
} as const;