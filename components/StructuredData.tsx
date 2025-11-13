export default function StructuredData() {
    const structuredData = {
        '@context': 'https://schema.org',
        '@type': 'Person',
        'name': 'Paul Viandier',
        'jobTitle': 'Développeur Web',
        'url': 'https://paulviandier.com',
        'sameAs': [
            '#',
            '#'
        ],
        'email': 'contact@paulviandier.com',
        'description': 'Développeur web en formation, passionné de cybersécurité et de développement fullstack'
    };

    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
    );
}