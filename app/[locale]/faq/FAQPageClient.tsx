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

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import FAQNavigation from '@/components/navbars/FAQ/FAQNavigation';
import { useTranslations } from 'next-intl';

export default function FAQPageClient() {
    const t = useTranslations('faq');

    const faqs = [
        {
            question: t('faqs.question1.question'),
            answer: t('faqs.question1.answer')
        },
        {
            question: t('faqs.question2.question'),
            answer: t('faqs.question2.answer')
        },
        {
            question: t('faqs.question3.question'),
            answer: t('faqs.question3.answer')
        },
        {
            question: t('faqs.question4.question'),
            answer: t('faqs.question4.answer')
        },
        {
            question: t('faqs.question5.question'),
            answer: t('faqs.question5.answer')
        },
        {
            question: t('faqs.question6.question'),
            answer: t('faqs.question6.answer')
        },
        {
            question: t('faqs.question7.question'),
            answer: t('faqs.question7.answer')
        },
        {
            question: t('faqs.question8.question'),
            answer: t('faqs.question8.answer')
        },
        {
            question: t('faqs.question9.question'),
            answer: t('faqs.question9.answer')
        },
        {
            question: t('faqs.question10.question'),
            answer: t('faqs.question10.answer')
        },
        {
            question: t('faqs.question11.question'),
            answer: t('faqs.question11.answer')
        },
        {
            question: t('faqs.question12.question'),
            answer: t('faqs.question12.answer')
        },
        {
            question: t('faqs.question13.question'),
            answer: t('faqs.question13.answer')
        },
        {
            question: t('faqs.question14.question'),
            answer: t('faqs.question14.answer')
        },
        {
            question: t('faqs.question15.question'),
            answer: t('faqs.question15.answer')
        }
    ];

    return (
        <>
            <FAQNavigation/>

            <div className="max-w-5xl mx-auto px-6 sm:px-8 lg:px-12 mt-24 mb-12">
                <h1 className="text-4xl font-bold mb-6 text-center">{t('title')}</h1>
                <p className="text-lg text-muted-foreground mb-12 text-center">
                    {t('description')}
                </p>

                <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <AccordionItem
                            key={index}
                            value={`item-${index}`}
                            className="border-b border-border rounded-lg mb-4 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                        >
                            <AccordionTrigger
                                className="text-lg font-medium py-5 px-6 bg-background hover:bg-accent/5 transition-colors">
                                {faq.question}
                            </AccordionTrigger>
                            <AccordionContent className="px-6 pb-6 pt-2 text-muted-foreground text-base">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </>
    );
}