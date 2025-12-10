export default function StructuredData() {
    const baseUrl = 'https://paulviandier.com';

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: 'Paul Viandier',
        givenName: 'Paul',
        familyName: 'Viandier',
        jobTitle: 'Développeur Web',
        url: baseUrl,
        sameAs: [
            'https://github.com/5061756c2e56/',
            'https://www.linkedin.com/in/paul-viandier-648837397/'
        ],
        email: 'contact@paulviandier.com',
        description: 'Développeur web en formation, passionné de cybersécurité et de développement fullstack',
        image: `${baseUrl}/pfp.png`,
        knowsAbout: ['Web Development', 'Cybersecurity', 'Fullstack Development', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis'],
        alumniOf: {
            '@type': 'EducationalOrganization',
            name: 'Formation en alternance'
        },
        address: {
            '@type': 'PostalAddress',
            addressCountry: 'FR'
        },
        nationality: {
            '@type': 'Country',
            name: 'France'
        }
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Portfolio de Paul Viandier',
        url: baseUrl,
        description: 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack',
        author: {
            '@id': `${baseUrl}/#person`
        },
        inLanguage: ['fr', 'en'],
        potentialAction: {
            '@type': 'SearchAction',
            target: {
                '@type': 'EntryPoint',
                urlTemplate: `${baseUrl}/?q={search_term_string}`
            },
            'query-input': 'required name=search_term_string'
        }
    };

    const breadcrumbSchema = {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                name: 'Accueil',
                item: baseUrl
            }
        ]
    };

    const organizationSchema = {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${baseUrl}/#organization`,
        name: 'Paul Viandier - Portfolio',
        url: baseUrl,
        logo: `${baseUrl}/pfp.png`,
        founder: {
            '@id': `${baseUrl}/#person`
        },
        sameAs: [
            'https://github.com/5061756c2e56/',
            'https://www.linkedin.com/in/paul-viandier-648837397/'
        ]
    };

    const portfolioSchema = {
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${baseUrl}/#portfolio`,
        name: 'Portfolio de Paul Viandier',
        url: baseUrl,
        description: 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack',
        author: {
            '@id': `${baseUrl}/#person`
        },
        creator: {
            '@id': `${baseUrl}/#person`
        },
        inLanguage: ['fr', 'en'],
        genre: 'Portfolio',
        keywords: 'développeur web, cybersécurité, fullstack, TypeScript, React, Next.js, portfolio',
        about: {
            '@type': 'Thing',
            name: 'Web Development'
        }
    };

    const projectsItemListSchema = {
        '@context': 'https://schema.org',
        '@type': 'ItemList',
        '@id': `${baseUrl}/#projects`,
        name: 'Projets & Réalisations',
        description: 'Liste des projets développés par Paul Viandier',
        itemListElement: [
            {
                '@type': 'ListItem',
                position: 1,
                item: {
                    '@type': 'SoftwareApplication',
                    name: 'Portfolio',
                    description: 'Site portfolio personnel développé avec Next.js et TypeScript, mettant en avant mes compétences et projets.',
                    url: 'https://github.com/5061756c2e56/site',
                    applicationCategory: 'WebApplication',
                    operatingSystem: 'Web',
                    programmingLanguage: ['TypeScript', 'JavaScript'],
                    softwareVersion: '1.0',
                    author: {
                        '@id': `${baseUrl}/#person`
                    },
                    creator: {
                        '@id': `${baseUrl}/#person`
                    },
                    keywords: 'portfolio, Next.js, TypeScript, React, Tailwind CSS, Redis'
                }
            },
            {
                '@type': 'ListItem',
                position: 2,
                item: {
                    '@type': 'SoftwareApplication',
                    name: 'Web Security',
                    description: 'Suite de sécurité web pour la protection et la gestion des systèmes informatiques.',
                    applicationCategory: 'SecurityApplication',
                    operatingSystem: 'Web',
                    programmingLanguage: ['TypeScript', 'JavaScript'],
                    author: {
                        '@id': `${baseUrl}/#person`
                    },
                    creator: {
                        '@id': `${baseUrl}/#person`
                    },
                    keywords: 'sécurité web, cybersécurité, TypeScript, Next.js, PostgreSQL'
                }
            }
        ]
    };

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(portfolioSchema) }}
            />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(projectsItemListSchema) }}
            />
        </>
    );
}