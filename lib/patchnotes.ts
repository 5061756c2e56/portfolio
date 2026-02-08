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

import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

export type SortOrder = 'newest' | 'oldest';

export type PatchnoteMeta = {
    id: string;
    lang: string;
    slug: string;
    fileDate: string;
    title: string;
    description: string;
    displayDate: string;
};

export type Patchnote = PatchnoteMeta & { content: string };

const ROOT = path.join(process.cwd(), 'patchnote');

let _cachedLangs: string[] | null = null;

async function getAvailableLangs(): Promise<string[]> {
    if (_cachedLangs) return _cachedLangs;
    const entries = await fs.readdir(ROOT, { withFileTypes: true });
    _cachedLangs = entries.filter(e => e.isDirectory()).map(e => e.name);
    return _cachedLangs;
}

export async function isValidPatchnoteId(id: string): Promise<boolean> {
    if (typeof id !== 'string' || id.length > 200 || id.includes('..')) return false;
    const langs = await getAvailableLangs();
    const [lang] = id.split('/');
    if (!langs.includes(lang)) return false;
    return /^[a-zA-Z0-9_-]+\/[a-zA-Z0-9_.-]+$/.test(id);
}

export async function isValidPatchnoteLang(lang: string): Promise<boolean> {
    const langs = await getAvailableLangs();
    return langs.includes(lang);
}

export function isValidSortOrder(sort: string): sort is SortOrder {
    return sort === 'newest' || sort === 'oldest';
}

function extractTitle(markdown: string) {
    const m = markdown.match(/^#\s+(.+)$/m);
    return m?.[1]?.trim() ?? 'Patchnote';
}

function extractDescription(markdown: string) {
    const lines = markdown.split('\n');
    let i = 0;
    while (i < lines.length && lines[i].trim() === '') i++;
    if (i < lines.length && /^#\s+/.test(lines[i])) i++;
    while (i < lines.length && lines[i].trim() === '') i++;
    return (
        lines[i] ?? ''
    ).trim();
}

function extractDisplayDate(markdown: string) {
    const m = markdown.match(/^\s*Date\s*:\s*(.+)\s*$/mi);
    return m?.[1]?.trim() ?? '';
}

function parseFileDateFromSlug(slug: string) {
    const m = slug.match(/^(\d{4}-\d{2}-\d{2})(?:-|$)/);
    return m?.[1] ?? '1970-01-01';
}

export async function listPatchnotes(lang: string, sort: SortOrder): Promise<PatchnoteMeta[]> {
    const valid = await isValidPatchnoteLang(lang);
    if (!valid) {
        throw new Error('Invalid patchnote lang');
    }
    const dir = path.join(ROOT, lang);
    const files = (
        await fs.readdir(dir)
    ).filter(f => f.endsWith('.md'));

    const metas = await Promise.all(files.map(async (file) => {
        const slug = file.replace(/\.md$/, '');
        const md = await fs.readFile(path.join(dir, file), 'utf8');

        return {
            id: `${lang}/${slug}`,
            lang,
            slug,
            fileDate: parseFileDateFromSlug(slug),
            title: extractTitle(md),
            description: extractDescription(md),
            displayDate: extractDisplayDate(md)
        } satisfies PatchnoteMeta;
    }));

    metas.sort((a, b) => {
        const ta = new Date(a.fileDate).getTime();
        const tb = new Date(b.fileDate).getTime();
        return sort === 'newest' ? tb - ta : ta - tb;
    });

    return metas;
}

export async function getPatchnoteById(id: string): Promise<Patchnote> {
    if (!isValidPatchnoteId(id)) {
        throw new Error('Invalid patchnote id');
    }
    const [lang, slug] = id.split('/');
    const file = path.join(ROOT, lang, `${slug}.md`);
    const resolved = path.resolve(file);
    if (!resolved.startsWith(path.resolve(ROOT))) {
        throw new Error('Invalid patchnote path');
    }
    const md = await fs.readFile(file, 'utf8');

    return {
        id,
        lang,
        slug,
        fileDate: parseFileDateFromSlug(slug),
        title: extractTitle(md),
        description: extractDescription(md),
        displayDate: extractDisplayDate(md),
        content: md
    };
}