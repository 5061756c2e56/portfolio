'use client';

import { useTranslations } from 'next-intl';

export default function SkipLink() {
    const t = useTranslations('accessibility');

    return (
        <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-500 focus:text-white focus:rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50"
        >
            {t('skipToContent')}
        </a>
    );
}