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

import { defaultSchema } from 'rehype-sanitize';

export const sanitizeSchema = {
    ...defaultSchema,
    attributes: {
        ...defaultSchema.attributes,
        a: [
            ...(
                defaultSchema.attributes?.a ?? []
            ), 'target', 'rel'
        ],
        img: [
            ...(
                defaultSchema.attributes?.img ?? []
            ), 'src', 'alt', 'title'
        ]
    }
};