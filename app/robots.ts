import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/api/', '/admin/']
            },
            {
                userAgent: 'Googlebot',
                allow: '/',
                disallow: ['/api/', '/admin/']
            },
            {
                userAgent: 'Googlebot-Image',
                allow: '/'
            }
        ],
        sitemap: ['https://paulviandier.com/sitemap.xml', 'https://www.paulviandier.com/sitemap.xml'],
        host: 'https://paulviandier.com'
    };
}