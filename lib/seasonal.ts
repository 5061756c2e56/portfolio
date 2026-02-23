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

export function isEnvEnabled(keys: readonly string[]): boolean {
    return keys.some((key) => process.env[key]?.trim().toLowerCase() === 'true');
}

export function getParisDayMonth(date: Date = new Date()): { day: number; month: number } {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        day: 'numeric',
        month: 'numeric',
        timeZone: 'Europe/Paris'
    });

    const parts = formatter.formatToParts(date);
    const dayPart = parts.find((part) => part.type === 'day')?.value;
    const monthPart = parts.find((part) => part.type === 'month')?.value;

    return {
        day: Number(dayPart),
        month: Number(monthPart)
    };
}
