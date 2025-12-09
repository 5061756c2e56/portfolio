import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://paulviandier.com';
    const now = new Date();

    return [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
            alternates: {
                languages: {
                    fr: baseUrl,
                    'fr-FR': baseUrl,
                    en: `${baseUrl}/en`,
                    'en-US': `${baseUrl}/en`,
                    'x-default': baseUrl
                }
            }
        },
        {
            url: `${baseUrl}/en`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
            alternates: {
                languages: {
                    fr: baseUrl,
                    'fr-FR': baseUrl,
                    en: `${baseUrl}/en`,
                    'en-US': `${baseUrl}/en`,
                    'x-default': baseUrl
                }
            }
        }
    ];
}

export const dynamic = 'force-dynamic';