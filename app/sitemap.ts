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
                    fr: `${baseUrl}/fr`,
                    en: `${baseUrl}/en`
                }
            }
        },
        {
            url: `${baseUrl}/fr`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1,
            alternates: {
                languages: {
                    fr: `${baseUrl}/fr`,
                    en: `${baseUrl}/en`
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
                    fr: `${baseUrl}/fr`,
                    en: `${baseUrl}/en`
                }
            }
        }
    ];
}