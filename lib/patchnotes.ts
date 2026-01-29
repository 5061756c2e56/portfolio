import 'server-only';
import fs from 'node:fs/promises';
import path from 'node:path';

export type PatchnoteLang = 'FR' | 'EN';
export type SortOrder = 'newest' | 'oldest';

export type PatchnoteMeta = {
    id: string;
    lang: PatchnoteLang;
    slug: string;
    fileDate: string;
    title: string;
    description: string;
    displayDate: string;
};

export type Patchnote = PatchnoteMeta & { content: string };

const ROOT = path.join(process.cwd(), 'patchnote');

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
    const m = slug.match(/^(\d{4}-\d{2}-\d{2})-/);
    return m?.[1] ?? '1970-01-01';
}

export async function listPatchnotes(lang: PatchnoteLang, sort: SortOrder): Promise<PatchnoteMeta[]> {
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
        const da = a.fileDate.localeCompare(b.fileDate);
        return sort === 'newest' ? -da : da;
    });

    return metas;
}

export async function getPatchnoteById(id: string): Promise<Patchnote> {
    const [lang, slug] = id.split('/');
    const file = path.join(ROOT, lang, `${slug}.md`);
    const md = await fs.readFile(file, 'utf8');

    return {
        id,
        lang: lang as PatchnoteLang,
        slug,
        fileDate: parseFileDateFromSlug(slug),
        title: extractTitle(md),
        description: extractDescription(md),
        displayDate: extractDisplayDate(md),
        content: md
    };
}