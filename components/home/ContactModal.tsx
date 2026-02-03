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

'use client';

import { FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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
import { Spinner } from '@/components/ui/spinner';

type TurnstileTheme = 'light' | 'dark' | 'auto';

interface TurnstileRenderOptions {
    sitekey: string;
    theme?: TurnstileTheme;
    callback?: (token: string) => void;
    'expired-callback'?: () => void;
    'error-callback'?: () => void;

    [key: string]: unknown;
}

declare global {
    interface Window {
        turnstile?: {
            render: (el: HTMLElement, options: TurnstileRenderOptions) => string;
            remove: (widgetId: string) => void;
            reset: (widgetId: string) => void;
        };
    }
}

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
    mailtoMode?: boolean;
}

function loadTurnstileScript(): Promise<void> {
    return new Promise((resolve, reject) => {
        const existing = document.querySelector('script[data-turnstile="true"]') as HTMLScriptElement | null;
        if (existing) {
            resolve();
            return;
        }

        const s = document.createElement('script');
        s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
        s.async = true;
        s.defer = true;
        s.setAttribute('data-turnstile', 'true');
        s.onload = () => resolve();
        s.onerror = () => reject(new Error('Turnstile script load failed'));
        document.body.appendChild(s);
    });
}

async function waitForTurnstileReady(timeoutMs = 5000): Promise<void> {
    const start = Date.now();
    while (!window.turnstile) {
        if (Date.now() - start > timeoutMs) throw new Error('Turnstile not ready');
        await new Promise(r => setTimeout(r, 50));
    }
}

export default function ContactModal({ isOpen, onClose, onSuccess, mailtoMode = false }: ContactModalProps) {
    const t = useTranslations('contact.modal');
    const tMailto = useTranslations('contact.mailtoDialog');
    const tError = useTranslations('contact.modal.errorDialog');
    const tValidation = useTranslations('contact.modal.validation');

    const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

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

    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [turnstileError, setTurnstileError] = useState<string | null>(null);

    const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
    const turnstileWidgetIdRef = useRef<string | null>(null);

    const [turnstileLoading, setTurnstileLoading] = useState(false);

    const translateValidation = useCallback(
        (key: string) => {
            try {
                return tValidation(key as unknown as Parameters<typeof tValidation>[0]);
            } catch {
                return key;
            }
        },
        [tValidation]
    );

    const resetForm = useCallback(() => {
        setFormData({ from_name: '', from_email: '', subject: '', message: '' });
        setErrors({});
        setShowErrorDialog(false);
        setErrorMessage('');
        setMailtoError(false);
        setTurnstileToken(null);
        setTurnstileError(null);
    }, []);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }

        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    useEffect(() => {
        if (!isOpen) return;

        setTurnstileLoading(true);
        setTurnstileToken(null);
        setTurnstileError(null);

        if (!siteKey) {
            setTurnstileLoading(false);
            setTurnstileError('Captcha non configuré (NEXT_PUBLIC_TURNSTILE_SITE_KEY manquante).');
            return;
        }

        let cancelled = false;

        (
            async () => {
                try {
                    await loadTurnstileScript();
                    await waitForTurnstileReady();

                    if (cancelled) return;
                    const container = turnstileContainerRef.current;
                    if (!container) return;

                    if (turnstileWidgetIdRef.current && window.turnstile) {
                        try {
                            window.turnstile.remove(turnstileWidgetIdRef.current);
                        } catch {
                        }
                        turnstileWidgetIdRef.current = null;
                    }

                    container.innerHTML = '';

                    const widgetId = window.turnstile!.render(container, {
                        sitekey: siteKey,
                        theme: 'auto',
                        callback: (token: string) => {
                            setTurnstileToken(token);
                            setTurnstileError(null);
                        },
                        'expired-callback': () => {
                            setTurnstileToken(null);
                            setTurnstileError('Captcha expiré, recommence.');
                        },
                        'error-callback': () => {
                            setTurnstileToken(null);
                            setTurnstileError('Erreur captcha, réessaie.');
                        }
                    });

                    turnstileWidgetIdRef.current = widgetId;
                    setTurnstileLoading(false);
                } catch {
                    setTurnstileToken(null);
                    setTurnstileError('Impossible de charger le captcha.');
                    setTurnstileLoading(false);
                }
            }
        )();

        return () => {
            cancelled = true;
            setTurnstileLoading(false);

            if (turnstileWidgetIdRef.current && window.turnstile) {
                try {
                    window.turnstile.remove(turnstileWidgetIdRef.current);
                } catch {
                }
            }
            turnstileWidgetIdRef.current = null;
            resetForm();
        };
    }, [isOpen, siteKey, resetForm]);

    const handleInputChange = (field: keyof EmailFormData, value: string) => {
        const newFormData = { ...formData, [field]: value };
        setFormData(newFormData);

        if (field === 'from_email') {
            const trimmed = value.trim();
            if (trimmed !== '' && !trimmed.includes('@')) {
                setErrors(prev => (
                    { ...prev, from_email: translateValidation('emailMissingAt') }
                ));
                return;
            }
        }

        const validation = validateEmailForm(newFormData, translateValidation);

        setErrors(prev => {
            const next = { ...prev };
            if (validation.errors[field]) {
                next[field] = validation.errors[field];
            } else {
                delete next[field];
            }
            return next;
        });
    };

    const isFormValid = useMemo(() => validateEmailForm(formData, translateValidation).valid, [
        formData, translateValidation
    ]);

    const handleSubmit = useCallback(
        async (e: FormEvent) => {
            e.preventDefault();

            const validation = validateEmailForm(formData, translateValidation);
            if (!validation.valid) {
                setErrors(validation.errors);
                return;
            }

            if (!siteKey) {
                setTurnstileError('Captcha non configuré.');
                return;
            }

            if (!turnstileToken) {
                setTurnstileError('Merci de cocher le captcha.');
                return;
            }

            setIsSubmitting(true);
            setErrors({});
            setTurnstileError(null);

            try {
                const result = await sendEmail(formData, turnstileToken);

                if (result.success) {
                    toast.success(t('toastSuccess'), { className: 'text-green-600 [&>svg]:text-green-600' });
                    setTimeout(() => onClose(), 300);
                    onSuccess?.();
                } else {
                    setErrorMessage(result.error || t('error'));
                    setShowErrorDialog(true);
                }
            } catch {
                setErrorMessage(t('error'));
                setShowErrorDialog(true);
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, onClose, onSuccess, t, translateValidation, turnstileToken, siteKey]
    );

    const handleMailtoConfirm = useCallback(() => {
        try {
            window.location.href = 'mailto:contact@paulviandier.com';
            setTimeout(() => {
                onClose();
                onSuccess?.();
            }, 100);
        } catch {
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

    if (mailtoMode) {
        return (
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{tMailto('title')}</DialogTitle>
                        <DialogDescription>{mailtoError ? tMailto('error') : tMailto('description')}</DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={onClose}>
                            {tMailto('cancel')}
                        </Button>
                        {!mailtoError && <Button onClick={handleMailtoConfirm}>{tMailto('confirm')}</Button>}
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    const canSubmit = isFormValid && !!turnstileToken && !!siteKey && !isSubmitting;

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
                                onChange={e => handleInputChange('from_name', e.target.value)}
                                placeholder={t('namePlaceholder')}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.from_name}
                                aria-describedby={errors.from_name ? 'name-error' : undefined}
                                className="truncate"
                            />
                            {errors.from_name && (
                                <p id="name-error" role="alert" className="text-sm text-destructive">
                                    {errors.from_name}
                                </p>
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
                                onChange={e => handleInputChange('from_email', e.target.value)}
                                placeholder={t('emailPlaceholder')}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.from_email}
                                aria-describedby={errors.from_email ? 'email-error' : undefined}
                                className="truncate"
                            />
                            {errors.from_email && (
                                <p id="email-error" role="alert" className="text-sm text-destructive">
                                    {errors.from_email}
                                </p>
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
                                onChange={e => handleInputChange('subject', e.target.value)}
                                placeholder={t('subjectPlaceholder')}
                                disabled={isSubmitting}
                                aria-invalid={!!errors.subject}
                                aria-describedby={errors.subject ? 'subject-error' : undefined}
                                className="truncate"
                            />
                            {errors.subject && (
                                <p id="subject-error" role="alert" className="text-sm text-destructive">
                                    {errors.subject}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label htmlFor="message" className="text-sm font-medium">
                                {t('message')}
                            </label>
                            <Textarea
                                id="message"
                                value={formData.message}
                                onChange={e => handleInputChange('message', e.target.value)}
                                placeholder={t('messagePlaceholder')}
                                disabled={isSubmitting}
                                rows={6}
                                aria-invalid={!!errors.message}
                                aria-describedby={errors.message ? 'message-error' : undefined}
                            />
                            {errors.message && (
                                <p id="message-error" role="alert" className="text-sm text-destructive">
                                    {errors.message}
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-center">
                                <div className="relative min-h-[70px]">
                                    <div
                                        ref={turnstileContainerRef}
                                        className={turnstileLoading ? 'opacity-0 pointer-events-none' : ''}
                                    />

                                    {turnstileLoading && (
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <div
                                                className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm text-muted-foreground">
                                                <Spinner className="w-4 h-4 border-2 text-blue-500"/>
                                                <span>{t('loading')}</span>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {turnstileError && (
                                <p role="alert" className="text-sm text-destructive text-center">
                                    {turnstileError}
                                </p>
                            )}
                        </div>

                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={onClose}>
                                {t('close')}
                            </Button>
                            <Button type="submit" disabled={!canSubmit}>
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
                        <AlertDialogDescription>{errorMessage || tError('description')}</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel onClick={handleErrorDialogCancel}>{tError('cancel')}</AlertDialogCancel>
                        <AlertDialogAction onClick={handleErrorDialogConfirm}>{tError('confirm')}</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}