export default function StructuredData() {
    const baseUrl = 'https://paulviandier.com';

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        '@id': `${baseUrl}/#person`,
        name: 'Paul Viandier',
        givenName: 'Paul',
        familyName: 'Viandier',
        alternateName: ['Viandier', 'Paul', 'Paul Viandier développeur', 'Viandier développeur'],
        jobTitle: ['Développeur Web', 'Développeur', 'Web Developer', 'Fullstack Developer'],
        url: baseUrl,
        sameAs: [
            'https://github.com/5061756c2e56/',
            'https://www.linkedin.com/in/paul-viandier-648837397/'
        ],
        email: 'contact@paulviandier.com',
        description: 'Paul Viandier, développeur web passionné de cybersécurité. Portfolio professionnel de Paul Viandier, développeur web fullstack en formation. Découvrez les projets et compétences de ce développeur web spécialisé en TypeScript, React, Next.js et cybersécurité.',
        image: `${baseUrl}/pfp.png`,
        knowsAbout: [
            'Développement Web', 'Web Development', 'Cybersecurity', 'Cybersécurité', 'Fullstack Development',
            'Développement Fullstack', 'TypeScript', 'React', 'Next.js', 'Node.js', 'PostgreSQL', 'Redis', 'Portfolio',
            'Développeur', 'Développeur Web'
        ],
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
        },
        keywords: 'Paul Viandier, Viandier, Paul, développeur, développeur web, portfolio, Portfolio, développement web, cybersécurité, TypeScript, React, Next.js'
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${baseUrl}/#website`,
        name: 'Portfolio de Paul Viandier - Développeur Web',
        alternateName: ['Portfolio Paul Viandier', 'Paul Viandier Portfolio', 'Portfolio Développeur Web'],
        url: baseUrl,
        description: 'Portfolio professionnel de Paul Viandier, développeur web passionné de cybersécurité. Découvrez les projets et compétences de ce développeur web fullstack spécialisé en TypeScript, React, Next.js. Portfolio de développeur web en formation.',
        author: {
            '@id': `${baseUrl}/#person`
        },
        inLanguage: ['fr', 'en'],
        keywords: 'Paul Viandier, Viandier, Paul, développeur, développeur web, portfolio, Portfolio, développement web, cybersécurité',
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
        name: 'Portfolio de Paul Viandier',
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
        name: 'Portfolio de Paul Viandier - Développeur Web',
        alternateName: ['Portfolio Paul Viandier', 'Paul Viandier Portfolio', 'Portfolio Développeur'],
        url: baseUrl,
        description: 'Portfolio professionnel de Paul Viandier, développeur web passionné de cybersécurité. Ce portfolio présente les projets et compétences de Paul Viandier, développeur web fullstack en formation. Découvrez le portfolio de ce développeur web spécialisé en TypeScript, React, Next.js et cybersécurité.',
        author: {
            '@id': `${baseUrl}/#person`
        },
        creator: {
            '@id': `${baseUrl}/#person`
        },
        inLanguage: ['fr', 'en'],
        genre: 'Portfolio',
        keywords: 'Paul Viandier, Viandier, Paul, développeur, développeur web, portfolio, Portfolio, développement web, cybersécurité, fullstack, TypeScript, React, Next.js',
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
                    url: 'https://security.paulviandier.com',
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