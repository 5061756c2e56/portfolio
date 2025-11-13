'use client';

import {
    EmailFormData,
    sendEmail
} from '@/lib/emailjs';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Textarea } from '@/components/ui/textarea';

interface ContactModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function ContactModal({
    isOpen,
    onClose,
    onSuccess
}: ContactModalProps) {
    const t = useTranslations('contact.modal');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm<EmailFormData>({
        mode: 'onChange'
    });

    const onSubmit = async (data: EmailFormData) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');

        const result = await sendEmail(data);

        if (result.success) {
            reset();
            onClose();
            setSubmitStatus('idle');
            onSuccess?.();
            
            if (result.count !== null && result.count !== undefined && result.count >= 200) {
                window.location.href = 'mailto:contact@paulviandier.com';
            }
        } else {
            setSubmitStatus('error');
        }

        setIsSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-background/80 backdrop-blur-sm">
            <div
                className="bg-card rounded-lg border border-border shadow-lg p-6 sm:p-8 w-full max-w-lg animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl sm:text-2xl font-semibold text-foreground">{t('title')}</h3>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-colors p-2 hover:bg-muted rounded-md"
                    >
                        <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 sm:space-y-5">
                    <div>
                        <label className="block text-sm sm:text-base font-medium text-foreground mb-2">
                            {t('name')}
                        </label>
                        <input
                            {...register('from_name', {
                                required: true,
                                minLength: {
                                    value: 3,
                                    message: t('validation.nameMin')
                                }
                            })}
                            type="text"
                            className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-background border border-border rounded-md text-foreground text-base focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
                        />
                        {errors.from_name && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {errors.from_name.type
                                 === 'required' ? 'Ce champ est requis' : errors.from_name.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-medium text-foreground mb-2">
                            {t('email')}
                        </label>
                        <input
                            {...register('from_email', {
                                required: t('validation.emailRequired'),
                                validate: (value) => {
                                    if (!value || value.trim() === '') {
                                        return t('validation.emailRequired');
                                    }
                                    if (!value.includes('@')) {
                                        return t('validation.emailMissingAt');
                                    }
                                    const parts = value.split('@');
                                    if (parts.length === 2 && parts[1].trim() === '') {
                                        return t('validation.emailMissingDomain');
                                    }
                                    if (parts.length === 2 && !parts[1].includes('.')) {
                                        return t('validation.emailMissingTld');
                                    }
                                    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
                                    if (!emailRegex.test(value)) {
                                        return t('validation.emailInvalid');
                                    }
                                    return true;
                                }
                            })}
                            type="email"
                            className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-background border border-border rounded-md text-foreground text-base focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
                        />
                        {errors.from_email && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {errors.from_email.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-medium text-foreground mb-2">
                            {t('subject')}
                        </label>
                        <input
                            {...register('subject', {
                                required: true,
                                minLength: {
                                    value: 10,
                                    message: t('validation.subjectMin')
                                }
                            })}
                            type="text"
                            className="w-full px-4 py-3 sm:px-5 sm:py-3.5 bg-background border border-border rounded-md text-foreground text-base focus:outline-none focus:ring-2 focus:ring-foreground focus:border-transparent transition-all"
                        />
                        {errors.subject && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {errors.subject.type === 'required' ? 'Ce champ est requis' : errors.subject.message}
                            </p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm sm:text-base font-medium text-foreground mb-2">
                            {t('message')}
                        </label>
                        <Textarea
                            {...register('message', {
                                required: true,
                                minLength: {
                                    value: 20,
                                    message: t('validation.messageMin')
                                }
                            })}
                            rows={6}
                            placeholder={t('messagePlaceholder')}
                        />
                        {errors.message && (
                            <p className="text-red-500 text-sm mt-1.5">
                                {errors.message.type === 'required' ? 'Ce champ est requis' : errors.message.message}
                            </p>
                        )}
                    </div>

                    {submitStatus === 'error' && (
                        <div
                            className="p-4 bg-red-500/10 border border-red-500/20 rounded-md text-red-600 dark:text-red-400 text-sm sm:text-base">
                            {t('error')}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 px-5 py-3 sm:px-6 sm:py-3.5 bg-foreground hover:opacity-90 text-background rounded-md text-base font-medium transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? t('sending') : t('send')}
                        </button>
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-3 sm:px-6 sm:py-3.5 bg-muted hover:bg-muted/80 text-foreground rounded-md text-base font-medium transition-colors"
                        >
                            {t('close')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}