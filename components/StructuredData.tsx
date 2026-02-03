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

export default function StructuredData() {
    const baseUrl = 'https://paulviandier.com';

    const graph = {
        '@context': 'https://schema.org',
        '@graph': [
            {
                '@type': 'Person',
                '@id': `${baseUrl}/#person`,
                name: 'Paul Viandier',
                givenName: 'Paul',
                familyName: 'Viandier',
                alternateName: ['Viandier Paul', 'P. Viandier', 'Paul V'],
                jobTitle: ['Développeur Web', 'Web Developer', 'Fullstack Developer'],
                url: baseUrl,
                sameAs: [
                    'https://github.com/5061756c2e56/',
                    'https://www.linkedin.com/in/paul-viandier-648837397/'
                ],
                email: 'contact@paulviandier.com',
                description: 'Développeur web fullstack en formation, passionné de cybersécurité. Spécialisé en TypeScript, React, Next.js.',
                image: `${baseUrl}/pfp.png`,
                knowsAbout: [
                    'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL',
                    'Cybersécurité', 'Développement Web'
                ],
                address: {
                    '@type': 'PostalAddress',
                    addressCountry: 'FR'
                }
            },
            {
                '@type': 'WebSite',
                '@id': `${baseUrl}/#website`,
                name: 'Portfolio de Paul Viandier',
                url: baseUrl,
                description: 'Portfolio professionnel de Paul Viandier, développeur web fullstack spécialisé en TypeScript, React, Next.js et cybersécurité.',
                author: { '@id': `${baseUrl}/#person` },
                inLanguage: ['fr', 'en']
            },
            {
                '@type': 'WebPage',
                '@id': `${baseUrl}/#webpage`,
                url: baseUrl,
                name: 'Portfolio de Paul Viandier - Développeur Web',
                description: 'Développeur web fullstack en formation, passionné de cybersécurité. Découvrez mes projets et compétences.',
                isPartOf: { '@id': `${baseUrl}/#website` },
                about: { '@id': `${baseUrl}/#person` }
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
                name: 'Lettre de motivation',
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
                name: 'Statistiques GitHub',
                url: `${baseUrl}/stats`
            },
            {
                '@type': 'ItemList',
                '@id': `${baseUrl}/#projects`,
                name: 'Projets',
                itemListElement: [
                    {
                        '@type': 'ListItem',
                        position: 1,
                        item: {
                            '@type': 'SoftwareApplication',
                            name: 'Portfolio',
                            description: 'Site portfolio personnel développé avec Next.js et TypeScript.',
                            url: 'https://github.com/5061756c2e56/site',
                            applicationCategory: 'WebApplication',
                            author: { '@id': `${baseUrl}/#person` }
                        }
                    },
                    {
                        '@type': 'ListItem',
                        position: 2,
                        item: {
                            '@type': 'SoftwareApplication',
                            name: 'Web Security',
                            description: 'Suite de sécurité web pour la protection et la gestion des systèmes informatiques.',
                            url: 'https://security.paulviandier.com',
                            applicationCategory: 'SecurityApplication',
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