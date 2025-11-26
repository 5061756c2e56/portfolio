'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SkillIcon from './SkillIcon';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

type Category = 'all' | 'frontend' | 'backend' | 'tools' | 'other';

interface Skill {
    name: string;
    category: Category;
}

const skills: Skill[] = [
    { name: 'HTML5', category: 'frontend' },
    { name: 'JavaScript', category: 'frontend' },
    { name: 'TypeScript', category: 'frontend' },
    { name: 'CSS', category: 'frontend' },
    { name: 'React', category: 'frontend' },
    { name: 'Tailwind CSS', category: 'frontend' },
    { name: 'Next.js', category: 'frontend' },
    { name: 'Responsive Design', category: 'frontend' },
    { name: 'Node.js', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'API REST', category: 'backend' },
    { name: 'Git', category: 'tools' },
    { name: 'GitHub', category: 'tools' },
    { name: 'Vercel', category: 'tools' },
    { name: 'EmailJS', category: 'tools' },
    { name: 'Cybersecurity', category: 'other' },
    { name: 'SEO', category: 'other' }
];

const MOBILE_MAX_CARDS = 4;
const DESKTOP_MAX_CARDS = 8;

export default function Skills() {
    const t = useTranslations('skills');
    const isMobile = useIsMobile();
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');
    const [showAll, setShowAll] = useState(false);

    const filteredSkills = selectedCategory === 'all'
        ? skills
        : skills.filter(skill => skill.category === selectedCategory);

    const maxCards = isMobile ? MOBILE_MAX_CARDS : DESKTOP_MAX_CARDS;
    const displayedSkills = showAll ? filteredSkills : filteredSkills.slice(0, maxCards);
    const hasMore = filteredSkills.length > maxCards;

    const categories: { key: Category; label: string }[] = [
        { key: 'all', label: t('categories.all') },
        { key: 'frontend', label: t('categories.frontend') },
        { key: 'backend', label: t('categories.backend') },
        { key: 'tools', label: t('categories.tools') },
        { key: 'other', label: t('categories.other') }
    ];

    const handleCategoryChange = (category: Category) => {
        setSelectedCategory(category);
        setShowAll(false);
    };

    return (
        <section id="skills"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 via-muted/20 to-background relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none"/>
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight">
                    <span className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                        {t('title')}
                    </span>
                </h2>

                <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 sm:mb-8">
                    {categories.map((category) => (
                        <Button
                            key={category.key}
                            variant={selectedCategory === category.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleCategoryChange(category.key)}
                            className={cn(
                                'text-xs sm:text-sm',
                                selectedCategory === category.key && 'bg-foreground text-background hover:bg-foreground/90'
                            )}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                    {displayedSkills.map((skill, index) => (
                        <div
                            key={index}
                            className="group relative rounded-lg border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 p-3 sm:p-4 hover:border-foreground/30 hover:shadow-md transition-all duration-300 flex flex-col items-center justify-center gap-2"
                        >
                            <div className="p-1.5 sm:p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 group-hover:scale-110 transition-all duration-300">
                                <SkillIcon name={skill.name} className="w-6 h-6 sm:w-7 sm:h-7 text-foreground"/>
                            </div>
                            <h3 className="text-xs sm:text-sm font-semibold text-foreground text-center">
                                {skill.name}
                            </h3>
                        </div>
                    ))}
                </div>

                {hasMore && (
                    <div className="mt-6 sm:mt-8 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setShowAll(!showAll)}
                            className="text-sm sm:text-base"
                        >
                            {showAll ? t('showLess') : t('showMore')}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
