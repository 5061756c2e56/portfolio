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

import { SITE_URL } from '@/lib/site';
import { locales } from '@/i18n/routing';
import { getLocalizedUrl, getSeoKeywords } from '@/lib/seo';

type StructuredDataProps = {
    locale: string;
};

export default function StructuredData({ locale }: StructuredDataProps) {
    const baseUrl = SITE_URL;
    const homeUrl = getLocalizedUrl(locale);
    const keywords = getSeoKeywords(locale, 'home');

    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${baseUrl}/#person`,
                name: 'Paul Viandier',
                givenName: 'Paul',
                familyName: 'Viandier',
                alternateName: ['Viandier Paul', 'P. Viandier', 'Paul V', 'Paul V Dev', 'Paul Dev Web'],
                jobTitle: ['Web Integrator', 'Web Developer', 'Full Stack Developer'],
                url: homeUrl,
                sameAs: [
                    'https://github.com/5061756c2e56/',
                    'https://www.linkedin.com/in/paul-viandier-648837397/'
                ],
                email: 'contact@paulviandier.com',
                description:
                    'Web developer and web integrator in training, focused on full-stack development with TypeScript, React, and Next.js.',
                image: `${baseUrl}/favicon.ico`,
                knowsLanguage: ['fr', 'en', 'es', 'pt-BR', 'ru', 'zh-CN'],
                keywords,
                knowsAbout: [
                    'TypeScript',
                    'React',
                    'Next.js',
                    'Node.js',
                    'PostgreSQL',
                    'Cybersecurity',
                    'Web Development'
                ],
                address: {
                    '@type': 'PostalAddress',
                    addressCountry: 'FR'
                }
            },
            {
                '@type': 'WebSite',
                '@id': `${baseUrl}/#website`,
                name: 'Paul Viandier\'s portfolio',
                url: homeUrl,
                description:
                    'Professional portfolio of Paul Viandier, full-stack web developer specializing in TypeScript, React, Next.js, and cybersecurity.',
                author: { '@id': `${baseUrl}/#person` },
                keywords,
                inLanguage: locales
            },
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}/#webpage`,
                url: homeUrl,
                name: 'Portfolio of Paul Viandier - Web Developer',
                description:
                    'Full-stack web developer in training, passionate about cybersecurity. Discover my projects and skills.',
                isPartOf: { '@id': `${baseUrl}/#website` },
                about: { '@id': `${baseUrl}/#person` },
                keywords
            },
            {
                '@type': 'SiteNavigationElement',
                '@id': `${baseUrl}/#cv-nav`,
                name: 'Curriculum Vitae',
                url: `${baseUrl}/curriculum-vitae`
            },
            {
                '@type': 'SiteNavigationElement',
                '@id': `${baseUrl}/#motivation-nav`,
                name: 'Cover letter',
                url: `${baseUrl}/motivation-letter`
            },
            {
                '@type': 'SiteNavigationElement',
                '@id': `${baseUrl}/#faq-nav`,
                name: 'FAQ',
                url: `${baseUrl}/faq`
            },
            {
                '@type': 'SiteNavigationElement',
                '@id': `${baseUrl}/#stats-nav`,
                name: 'GitHub Statistics',
                url: `${baseUrl}/stats`
            },
            {
                '@type': 'SiteNavigationElement',
                '@id': `${baseUrl}/#games-nav`,
                name: 'Games & Challenges',
                url: `${baseUrl}/games`
            },
            {
                '@type': 'ItemList',
                '@id': `${baseUrl}/#projects`,
                name: 'Projects',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        item: {
                            '@type': 'SoftwareApplication',
                            name: 'Portfolio',
                            description:
                                'Personal portfolio website developed with Next.js and TypeScript.',
                            url: 'https://github.com/5061756c2e56/portfolio',
                            applicationCategory: 'WebApplication',
                            author: { '@id': `${baseUrl}/#person` }
                        }
                    }
                ]
            }
        ]
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(graph) }}
        />
    );
}
