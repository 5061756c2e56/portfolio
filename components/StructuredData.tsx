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
        </>
    );
}