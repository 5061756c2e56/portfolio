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

import { LS_READ_KEY } from './constants';

export function loadReadSet(): Set<string> {
    try {
        const raw = localStorage.getItem(LS_READ_KEY);
        const arr = raw ? (
            JSON.parse(raw) as string[]
        ) : [];
        return new Set(arr);
    } catch {
        return new Set();
    }
}

export function saveReadSet(set: Set<string>) {
    localStorage.setItem(LS_READ_KEY, JSON.stringify(Array.from(set)));
}