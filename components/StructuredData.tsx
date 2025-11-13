export default function StructuredData() {
    const baseUrl = 'https://paulviandier.com';

    const personSchema = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: 'Paul Viandier',
        jobTitle: 'Développeur Web',
        url: baseUrl,
        sameAs: [
            'https://github.com/5061756c2e56/',
            'https://www.linkedin.com/in/paul-viandier-648837397/'
        ],
        email: 'contact@paulviandier.com',
        description: 'Développeur web en formation, passionné de cybersécurité et de développement fullstack',
        image: `${baseUrl}/pfp.png`
    };

    const websiteSchema = {
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'Portfolio de Paul Viandier',
        url: baseUrl,
        description: 'Portfolio de Paul Viandier, développeur web en formation, passionné de cybersécurité et de développement fullstack',
        author: {
            '@type': 'Person',
            name: 'Paul Viandier'
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
        </>
    );
}