import { z } from 'zod';

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 254;
const MAX_SUBJECT_LENGTH = 200;
const MAX_MESSAGE_LENGTH = 5000;

function sanitizeString(input: unknown): string {
    if (typeof input !== 'string') {
        return '';
    }
    
    return input
        .trim()
        .replace(/[\x00-\x1F\x7F]/g, '')
        .replace(/[<>]/g, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/data:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/expression\s*\(/gi, '')
        .slice(0, 10000);
}

function sanitizeEmail(input: string): string {
    return input
        .trim()
        .toLowerCase()
        .replace(/[\x00-\x1F\x7F]/g, '')
        .slice(0, MAX_EMAIL_LENGTH);
}

const emailFormSchema = z.object({
    from_name: z.string()
        .min(3, { message: 'nameMin' })
        .max(MAX_NAME_LENGTH, { message: 'nameMax' })
        .transform((val) => sanitizeString(val).slice(0, MAX_NAME_LENGTH)),
    from_email: z.string()
        .max(MAX_EMAIL_LENGTH, { message: 'emailMax' })
        .refine((val) => {
            const trimmed = val.trim();
            if (trimmed === '') return true;
            return trimmed.includes('@');
        }, { message: 'emailMissingAt' })
        .refine((val) => {
            const trimmed = val.trim();
            if (trimmed === '') return true;
            if (!trimmed.includes('@')) return true;
            return z.string().email().safeParse(trimmed).success;
        }, { message: 'emailInvalid' })
        .transform((val) => sanitizeEmail(val)),
    subject: z.string()
        .min(10, { message: 'subjectMin' })
        .max(MAX_SUBJECT_LENGTH, { message: 'subjectMax' })
        .transform((val) => sanitizeString(val).slice(0, MAX_SUBJECT_LENGTH)),
    message: z.string()
        .min(20, { message: 'messageMin' })
        .max(MAX_MESSAGE_LENGTH, { message: 'messageMax' })
        .transform((val) => sanitizeString(val).slice(0, MAX_MESSAGE_LENGTH))
}).strict();

export type EmailFormData = z.infer<typeof emailFormSchema>;

export interface ValidationResult {
    valid: boolean;
    errors: Partial<Record<keyof EmailFormData, string>>;
}

type TranslationFunction = (key: string) => string;

const defaultTranslations: Record<string, string> = {
    nameMin: 'Le nom doit contenir au moins 3 caractères',
    nameMax: 'Le nom ne doit pas dépasser 100 caractères',
    emailMax: 'L\'email ne doit pas dépasser 254 caractères',
    emailMissingAt: 'Le symbole @ est requis dans l\'email',
    emailInvalid: 'Veuillez entrer un email valide',
    subjectMin: 'Le sujet doit contenir au moins 10 caractères',
    subjectMax: 'Le sujet ne doit pas dépasser 200 caractères',
    messageMin: 'Le message doit contenir au moins 20 caractères',
    messageMax: 'Le message ne doit pas dépasser 5000 caractères'
};

export function validateEmailForm(data: unknown, t?: TranslationFunction): ValidationResult {
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

    try {
        emailFormSchema.parse(data);
        return {
            valid: true,
            errors: {}
        };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors: Partial<Record<keyof EmailFormData, string>> = {};
            
            error.issues.forEach((err) => {
                let path: keyof EmailFormData | null = null;
                
                if (err.path && err.path.length > 0) {
                    path = err.path[0] as keyof EmailFormData;
                }
                
                if (path) {
                    let messageKey: string | null = null;
                    
                    if (err.code === 'too_small') {
                        if (path === 'from_name') messageKey = 'nameMin';
                        else if (path === 'subject') messageKey = 'subjectMin';
                        else if (path === 'message') messageKey = 'messageMin';
                    } else if (err.code === 'too_big') {
                        if (path === 'from_name') messageKey = 'nameMax';
                        else if (path === 'from_email') messageKey = 'emailMax';
                        else if (path === 'subject') messageKey = 'subjectMax';
                        else if (path === 'message') messageKey = 'messageMax';
                    } else if (err.code === 'invalid_format') {
                        if ('validation' in err && err.validation === 'email') {
                            messageKey = 'emailInvalid';
                        } else if (err.message) {
                            messageKey = err.message;
                        }
                    } else if (err.code === 'custom' && err.message) {
                        messageKey = err.message;
                    } else if (err.message) {
                        messageKey = err.message;
                    }
                    
                    if (messageKey) {
                        if (!errors[path]) {
                            errors[path] = getTranslation(messageKey);
                        }
                    }
                }
            });
            
            return {
                valid: false,
                errors
            };
        }
        
        return {
            valid: false,
            errors: {
                from_name: getTranslation('nameMin'),
                subject: getTranslation('subjectMin'),
                message: getTranslation('messageMin')
            }
        };
    }
}

export function sanitizeEmailForm(data: unknown): EmailFormData {
    try {
        return emailFormSchema.parse(data);
    } catch {
        const safeData = {
            from_name: typeof data === 'object' && data !== null && 'from_name' in data 
                ? sanitizeString(String(data.from_name)).slice(0, MAX_NAME_LENGTH) 
                : '',
            from_email: typeof data === 'object' && data !== null && 'from_email' in data 
                ? sanitizeEmail(String(data.from_email))
                : '',
            subject: typeof data === 'object' && data !== null && 'subject' in data 
                ? sanitizeString(String(data.subject)).slice(0, MAX_SUBJECT_LENGTH) 
                : '',
            message: typeof data === 'object' && data !== null && 'message' in data 
                ? sanitizeString(String(data.message)).slice(0, MAX_MESSAGE_LENGTH) 
                : ''
        };
        return emailFormSchema.parse(safeData);
    }
}

export const EMAIL_LIMITS = {
    MAX_NAME_LENGTH,
    MAX_EMAIL_LENGTH,
    MAX_SUBJECT_LENGTH,
    MAX_MESSAGE_LENGTH
} as const;
