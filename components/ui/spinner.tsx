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

import { Loader2Icon } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { cn } from '@/lib/utils';

function Spinner({ className, ...props }: React.ComponentProps<'svg'>) {
    const t = useTranslations('accessibility');
    return (
        <Loader2Icon
            role="status"
            aria-label={t('loading')}
            className={cn('size-4 animate-spin', className)}
            {...props}
        />
    );
}

export { Spinner };
