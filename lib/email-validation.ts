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

type TranslationFunction = (key: string) => string;

const defaultTranslations: Record<string, string> = {
    nameMin: 'Le nom doit contenir au moins 3 caractères',
    nameMax: 'Le nom ne doit pas dépasser 100 caractères',
    emailRequired: 'L\'email est requis',
    emailInvalid: 'Veuillez entrer un email valide',
    subjectMin: 'Le sujet doit contenir au moins 10 caractères',
    subjectMax: 'Le sujet ne doit pas dépasser 200 caractères',
    messageMin: 'Le message doit contenir au moins 20 caractères',
    messageMax: 'Le message ne doit pas dépasser 5000 caractères'
};

function sanitizeString(input: string): string {
    return input.trim().replace(/[\x00-\x1F\x7F]/g, '');
}

function validateEmail(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
    return emailRegex.test(email) && email.length <= MAX_EMAIL_LENGTH;
}

export function validateEmailForm(data: EmailFormData, t?: TranslationFunction): ValidationResult {
    const errors: Partial<Record<keyof EmailFormData, string>> = {};
    const getTranslation = (key: string): string => {
        if (t) {
            try {
                return t(key);
            } catch {
                return defaultTranslations[key] || key;
            }
        }
        return defaultTranslations[key] || key;
    };

    const sanitizedName = sanitizeString(data.from_name);
    if (!sanitizedName || sanitizedName.length < 3) {
        errors.from_name = getTranslation('nameMin');
    } else if (sanitizedName.length > MAX_NAME_LENGTH) {
        errors.from_name = getTranslation('nameMax');
    }

    const sanitizedEmail = sanitizeString(data.from_email);
    if (!sanitizedEmail) {
        errors.from_email = getTranslation('emailRequired');
    } else if (!validateEmail(sanitizedEmail)) {
        errors.from_email = getTranslation('emailInvalid');
    }

    const sanitizedSubject = sanitizeString(data.subject);
    if (!sanitizedSubject || sanitizedSubject.length < 10) {
        errors.subject = getTranslation('subjectMin');
    } else if (sanitizedSubject.length > MAX_SUBJECT_LENGTH) {
        errors.subject = getTranslation('subjectMax');
    }

    const sanitizedMessage = sanitizeString(data.message);
    if (!sanitizedMessage || sanitizedMessage.length < 20) {
        errors.message = getTranslation('messageMin');
    } else if (sanitizedMessage.length > MAX_MESSAGE_LENGTH) {
        errors.message = getTranslation('messageMax');
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