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

import Image from 'next/image';

interface FlagProps {
    code: string;
    className?: string;
}

export function Flag({ code, className }: FlagProps) {
    return (
        <Image
            src={`/flags/${code}.svg`}
            alt=""
            width={20}
            height={15}
            className={className}
            aria-hidden="true"
        />
    );
}
