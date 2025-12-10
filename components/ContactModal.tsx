'use client';

import { FormEvent, useCallback, useEffect, useState } from 'react';

import {
    Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from '@/components/ui/dialog';

import {
    AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
    AlertDialogHeader, AlertDialogTitle
} from '@/components/ui/alert-dialog';

import { type EmailFormData, sendEmail } from '@/lib/emailjs';

import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import { toast } from 'sonner';
import { validateEmailForm } from '@/lib/email-validation';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mailtoMode?: boolean;
}

export default function ContactModal({
    isOpen,
    onClose,
    onSuccess,
    mailtoMode = false
}: ContactModalProps) {
    const t = useTranslations('contact.modal');
    const tMailto = useTranslations('contact.mailtoDialog');
    const tError = useTranslations('contact.modal.errorDialog');
    const [formData, setFormData] = useState<EmailFormData>({
        from_name: '',
        from_email: '',
        subject: '',
        message: ''
    });
    const [errors, setErrors] = useState<Partial<Record<keyof EmailFormData, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string>('');
    const [mailtoError, setMailtoError] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
            setFormData({
                from_name: '',
                from_email: '',
                subject: '',
                message: ''
            });
            setErrors({});
            setShowErrorDialog(false);
            setMailtoError(false);
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const tValidation = useTranslations('contact.modal.validation');

    const handleInputChange = (field: keyof EmailFormData, value: string) => {
        const newFormData = {
            ...formData,
            [field]: value
        };
        setFormData(newFormData);

        if (field === 'from_email') {
            const trimmed = value.trim();
            if (trimmed !== '' && !trimmed.includes('@')) {
                setErrors(prev => ({
                    ...prev,
                    from_email: tValidation('emailMissingAt')
                }));
                return;
            }
        }

        const validation = validateEmailForm(newFormData, (key: string) => {
            try {
                return tValidation(key as any);
            } catch {
                return key;
            }
        });

        setErrors(prev => {
            const newErrors = { ...prev };
            if (validation.errors[field]) {
                newErrors[field] = validation.errors[field];
            } else {
                delete newErrors[field];
            }
            return newErrors;
        });
    };

    const handleSubmit = useCallback(async (e: FormEvent) => {
        e.preventDefault();

        const validation = validateEmailForm(formData, (key: string) => {
            try {
                return tValidation(key as any);
            } catch {
                return key;
            }
        });
        if (!validation.valid) {
            setErrors(validation.errors);
            return;
        }

        setIsSubmitting(true);
        setErrors({});

        try {
            const result = await sendEmail(formData);

            if (result.success) {
                toast.success(t('toastSuccess'), {
                    className: 'text-green-600 [&>svg]:text-green-600'
                });
                setTimeout(() => {
                    onClose();
                }, 300);
                onSuccess?.();
            } else {
                setErrorMessage(result.error || t('error'));
                setShowErrorDialog(true);
            }
        } catch (error) {
            setErrorMessage(t('error'));
            setShowErrorDialog(true);
        } finally {
            setIsSubmitting(false);
        }
    }, [formData, onClose, onSuccess, t]);

    const handleMailtoConfirm = useCallback(() => {
        try {
            window.location.href = 'mailto:contact@paulviandier.com';
            setTimeout(() => {
                onClose();
                onSuccess?.();
            }, 100);
        } catch (error) {
            setMailtoError(true);
        }
    }, [onClose, onSuccess]);

    const handleErrorDialogConfirm = useCallback(() => {
        setShowErrorDialog(false);
        handleMailtoConfirm();
    }, [handleMailtoConfirm]);

    const handleErrorDialogCancel = useCallback(() => {
        setShowErrorDialog(false);
    }, []);

    const isFormValid = () => {
        const validation = validateEmailForm(formData, (key: string) => {
            try {
                return tValidation(key as any);
            } catch {
                return key;
            }
        });
        return validation.valid;
    };

    if (mailtoMode) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{tMailto('title')}</DialogTitle>
                        <DialogDescription>
                            {mailtoError ? tMailto('error') : tMailto('description')}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            {tMailto('cancel')}
                        </Button>
                        {!mailtoError && (
                            <Button onClick={handleMailtoConfirm}>
                                {tMailto('confirm')}
                            </Button>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{t('title')}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium">
                                {t('name')}
                            </label>
                            <Input
                                id="name"
                                type="text"
                                value={formData.from_name}
                                onChange={(e) => handleInputChange('from_name', e.target.value)}
                                placeholder={t('namePlaceholder')}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.from_name}
                            />
                            {errors.from_name && (
                                <p className="text-sm text-destructive">{errors.from_name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium">
                                {t('email')}
                            </label>
                            <Input
                                id="email"
                                type="email"
                                value={formData.from_email}
                                onChange={(e) => handleInputChange('from_email', e.target.value)}
                                placeholder={t('emailPlaceholder')}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.from_email}
                            />
                            {errors.from_email && (
                                <p className="text-sm text-destructive">{errors.from_email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="subject" className="text-sm font-medium">
                                {t('subject')}
                            </label>
                            <Input
                                id="subject"
                                type="text"
                                value={formData.subject}
                                onChange={(e) => handleInputChange('subject', e.target.value)}
                                placeholder={t('subjectPlaceholder')}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.subject}
                            />
                            {errors.subject && (
                                <p className="text-sm text-destructive">{errors.subject}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                {t('message')}
                            </label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={(e) => handleInputChange('message', e.target.value)}
                                placeholder={t('messagePlaceholder')}
                                disabled={isSubmitting}
                                rows={6}
                                aria-invalid={!!errors.message}
                            />
                            {errors.message && (
                                <p className="text-sm text-destructive">{errors.message}</p>
                            )}
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
                                {t('close')}
                            </Button>
                            <Button type="submit" disabled={isSubmitting || !isFormValid()}>
                                {isSubmitting ? t('sending') : t('send')}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
            <AlertDialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
                <AlertDialogContent className="max-w-[calc(100vw-2rem)] sm:max-w-md">
                    <AlertDialogHeader>
                        <AlertDialogTitle>{tError('title')}</AlertDialogTitle>
                        <AlertDialogDescription>
                            {errorMessage || tError('description')}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleErrorDialogCancel}>
                            {tError('cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleErrorDialogConfirm}>
                            {tError('confirm')}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}