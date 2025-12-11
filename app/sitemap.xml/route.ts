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

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
    const now = new Date();
    const lastmod = formatDate(now);
    const changefreq = 'weekly';
    const priority = '1.0';

    const urlEntries: string[] = [];

    const urls = [
        { path: '', locale: 'fr', priority: '1.0' },
        { path: '/en', locale: 'en', priority: '0.9' }
    ];

    urls.forEach(({ path, locale, priority: urlPriority }) => {
        const url = `${baseUrl}${path}`;

        let xml = `    <url>
        <loc>${escapeXml(url)}</loc>
        <lastmod>${lastmod}</lastmod>
        <changefreq>${changefreq}</changefreq>
        <priority>${urlPriority}</priority>`;

        routing.locales.forEach((loc) => {
            const alternatePath = loc === 'fr' ? '' : '/en';
            const alternateUrl = `${baseUrl}${alternatePath}`;
            xml += `\n        <xhtml:link rel="alternate" hreflang="${loc}" href="${escapeXml(alternateUrl)}"/>`;
        });

        xml += `\n        <xhtml:link rel="alternate" hreflang="x-default" href="${escapeXml(baseUrl)}"/>`;

        xml += `\n    </url>`;
        urlEntries.push(xml);
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9 http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${urlEntries.join('\n')}
</urlset>`;

    return new NextResponse(xml, {
        status: 200,
        headers: {
            'Content-Type': 'application/xml; charset=utf-8',
            'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
            'X-Content-Type-Options': 'nosniff'
        }
    });
}