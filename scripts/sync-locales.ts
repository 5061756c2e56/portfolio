import { readdirSync, readFileSync, writeFileSync } from 'fs';
import { basename, join } from 'path';

const LOCALES_DIR = join(process.cwd(), 'i18n', 'locales');
const OUTPUT_FILE = join(process.cwd(), 'i18n', 'generated-locales.ts');
const DEFAULT_LOCALE = 'fr';

interface LocaleMeta {
    flag: string;
}

function main() {
    const files = readdirSync(LOCALES_DIR).filter((f) => f.endsWith('.json'));
    const locales: string[] = [];
    const meta: Record<string, LocaleMeta> = {};

    for (const file of files) {
        const locale = basename(file, '.json');
        const content = JSON.parse(readFileSync(join(LOCALES_DIR, file), 'utf-8'));

        if (!content._meta?.flag) {
            console.warn(`⚠ ${file}: missing _meta.flag — skipping`);
            continue;
        }

        locales.push(locale);
        meta[locale] = { flag: content._meta.flag };
    }

    locales.sort((a, b) => (
        a === DEFAULT_LOCALE ? -1 : b === DEFAULT_LOCALE ? 1 : a.localeCompare(b)
    ));

    const flagsCode = locales.map((l) => `    '${l}': '${meta[l].flag}'`).join(',\n');

    const output = `export const locales = [${locales.map((l) => `'${l}'`).join(', ')}] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = '${DEFAULT_LOCALE}';

export const localeFlags: Record<Locale, string> = {
${flagsCode}
};

export function isLocale(value: string): value is Locale {
    return (locales as readonly string[]).includes(value);
}
`;

    writeFileSync(OUTPUT_FILE, output, 'utf-8');
    console.log(`✓ Generated ${OUTPUT_FILE} with ${locales.length} locale(s): ${locales.join(', ')}`);
}

main();