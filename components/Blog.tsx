'use client';

import {
    useLocale,
    useTranslations
} from 'next-intl';

import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface BlogPost {
    id: string;
    title: string;
    description: string;
    date: string;
    category: string;
    readTime: string;
    link?: string;
}

const blogPosts: BlogPost[] = [
    {
        id: '1',
        title: 'Découverte de Next.js 16',
        description: 'Exploration des nouvelles fonctionnalités de Next.js 16 et de leurs impacts sur le développement web moderne.',
        date: '2025-01-15',
        category: 'Technologie',
        readTime: '5 min',
        link: '#'
    },
    {
        id: '2',
        title: 'Sécurité Web : Bonnes Pratiques',
        description: 'Guide des meilleures pratiques en matière de sécurité web pour protéger vos applications.',
        date: '2025-01-10',
        category: 'Cybersécurité',
        readTime: '8 min',
        link: '#'
    },
    {
        id: '3',
        title: 'Optimisation des Performances React',
        description: 'Techniques avancées pour améliorer les performances de vos applications React.',
        date: '2025-01-05',
        category: 'Développement',
        readTime: '6 min',
        link: '#'
    }
];

export default function Blog() {
    const t = useTranslations('blog');
    const locale = useLocale();
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.1 });

    return (
        <section ref={ref as React.RefObject<HTMLElement>} id="blog"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/10 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.06),transparent_50%)] pointer-events-none"/>
            <div className="max-w-6xl mx-auto relative z-10">
                <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    <span
                        className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                        {t('title')}
                    </span>
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
                    {blogPosts.map((post, index) => (
                        <article
                            key={post.id}
                            className={cn(
                                'group relative overflow-hidden rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/20 p-5 sm:p-6 hover:border-foreground/30 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 cursor-pointer transition-all duration-500',
                                isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                            )}
                            style={{ animationDelay: `${index * 100}ms` }}
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"/>
                            <div className="relative z-10">
                                <div className="flex items-center gap-2 mb-3">
                                    <span
                                        className="text-xs font-medium px-2.5 py-1 rounded-md border border-border/50 bg-gradient-to-br from-muted/80 to-muted/50 text-muted-foreground">
                                        {post.category}
                                    </span>
                                    <span className="text-xs text-muted-foreground">{post.readTime}</span>
                                </div>
                                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold mb-2 sm:mb-3 text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                                    {post.title}
                                </h3>
                                <p className="text-sm sm:text-base md:text-lg text-muted-foreground mb-4 sm:mb-6 leading-relaxed group-hover:text-muted-foreground/90 transition-colors duration-300">
                                    {post.description}
                                </p>
                                <div className="flex items-center justify-between">
                                    <time className="text-xs sm:text-sm text-muted-foreground">
                                        {new Date(post.date).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'en-US', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </time>
                                    <div
                                        className="flex items-center gap-2 text-sm sm:text-base font-medium text-foreground opacity-70 group-hover:opacity-100 transition-all duration-300 group-hover:translate-x-1">
                                        {t('readMore')}
                                        <svg
                                            className="w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300"
                                            fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round"
                                                  d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                                        </svg>
                                    </div>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}