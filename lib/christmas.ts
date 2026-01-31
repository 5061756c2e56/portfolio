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

export function isChristmasMode(): boolean {
    const now = new Date().toLocaleString('fr-FR', { timeZone: 'Europe/Paris' });
    const [day, month] = now.split('/').map(Number); // format JJ/MM/YYYY
    return month === 12 || (
        month === 1 && day === 1
    );
}