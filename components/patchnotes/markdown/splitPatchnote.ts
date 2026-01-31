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

export function splitPatchnote(md: string) {
    const lines = md.split('\n');
    let i = 0;

    while (i < lines.length && lines[i].trim() === '') i++;

    let title = '';
    if (i < lines.length && /^#\s+/.test(lines[i])) {
        title = lines[i].replace(/^#\s+/, '').trim();
        i++;
    }

    while (i < lines.length && lines[i].trim() === '') i++;

    const descParts: string[] = [];
    while (i < lines.length) {
        const raw = lines[i];
        const t = raw.trim();

        if (t === '') break;
        if (/^\s*Date\s*:\s*/i.test(raw)) break;

        descParts.push(t);
        i++;
    }
    const description = descParts.join(' ');

    while (i < lines.length && lines[i].trim() === '') i++;

    let displayDate = '';
    if (i < lines.length && /^\s*Date\s*:\s*/i.test(lines[i])) {
        displayDate = lines[i].replace(/^\s*Date\s*:\s*/i, '').trim();
        i++;
    }

    while (i < lines.length && lines[i].trim() === '') i++;

    const body = lines.slice(i).join('\n').trimStart();

    return { title, description, displayDate, body };
}