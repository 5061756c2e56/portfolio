import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const baseUrl = 'https://paulviandier.com';
    const now = new Date();

    return [
        {
            url: baseUrl,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
            alternates: {
                languages: {
                    fr: `${baseUrl}/fr`,
                    en: `${baseUrl}/en`,
                    'x-default': `${baseUrl}/fr`
                }
            }
        },
        {
            url: `${baseUrl}/fr`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
            alternates: {
                languages: {
                    fr: `${baseUrl}/fr`,
                    en: `${baseUrl}/en`,
                    'x-default': `${baseUrl}/fr`
                }
            }
        },
        {
            url: `${baseUrl}/en`,
            lastModified: now,
            changeFrequency: 'weekly',
            priority: 1.0,
            alternates: {
                languages: {
                    fr: `${baseUrl}/fr`,
                    en: `${baseUrl}/en`,
                    'x-default': `${baseUrl}/fr`
                }
            }
        },
        {
            url: `${baseUrl}/curriculum-vitae`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
            alternates: {
                languages: {
                    fr: `${baseUrl}/curriculum-vitae`,
                    en: `${baseUrl}/en/curriculum-vitae`,
                    'x-default': `${baseUrl}/curriculum-vitae`
                }
            }
        },
        {
            url: `${baseUrl}/en/curriculum-vitae`,
            lastModified: now,
            changeFrequency: 'monthly',
            priority: 0.9,
            alternates: {
                languages: {
                    fr: `${baseUrl}/curriculum-vitae`,
                    en: `${baseUrl}/en/curriculum-vitae`,
                    'x-default': `${baseUrl}/curriculum-vitae`
                }
            }
        }
    ];
}