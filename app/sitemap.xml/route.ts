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

import { NextResponse } from 'next/server';
import { routing } from '@/i18n/routing';

const baseUrl = 'https://paulviandier.com';

function escapeXml(unsafe: string): string {
    return unsafe
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

/**
 * FR: "" -> "/"
 * EN: "" -> "/en"
 * FR: "/faq" -> "/faq"
 * EN: "/faq" -> "/en/faq"
 */
function buildPath(locale: string, path: string): string {
    if (locale === 'fr') return path === '' ? '/' : path;
    return path === '' ? '/en' : `/en${path}`;
}

function buildUrl(locale: string, path: string): string {
    const p = buildPath(locale, path);
    return `${baseUrl}${p === '/' ? '' : p}`;
}

export const dynamic = 'force-static';
export const revalidate = 86400; // 24h

type Entry = {
    path: string;
    priority: string;
    changefreq: 'weekly' | 'monthly' | 'yearly';
};

const ENTRIES: Entry[] = [
    { path: '', priority: '1.0', changefreq: 'weekly' },
    { path: '/faq', priority: '0.7', changefreq: 'monthly' },
    { path: '/games', priority: '0.7', changefreq: 'monthly' },

    { path: '/projects/portfolio', priority: '0.8', changefreq: 'monthly' }

];

export async function GET() {
    const lastmod = formatDate(new Date());
    const urlEntries: string[] = [];

    for (const entry of ENTRIES) {
        for (const locale of routing.locales) {
            const locUrl = buildUrl(locale, entry.path);

            const priority =
                entry.path === '' && locale !== 'fr' ? '0.9' : entry.priority;

            let xml = `  <url>
    <loc>${escapeXml(locUrl)}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${entry.changefreq}</changefreq>
    <priority>${priority}</priority>`;

            for (const altLocale of routing.locales) {
                const altUrl = buildUrl(altLocale, entry.path);
                xml += `\n    <xhtml:link rel="alternate" hreflang="${altLocale}" href="${escapeXml(altUrl)}"/>`;
            }

            const xDefaultUrl = buildUrl('fr', entry.path);
            xml += `\n    <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(xDefaultUrl)}"/>`;

            xml += `\n  </url>`;
            urlEntries.push(xml);
        }
    }

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlEntries.join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=604800',
            'X-Content-Type-Options': 'nosniff'
        }
    });
}