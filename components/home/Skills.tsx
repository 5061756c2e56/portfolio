'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SkillIcon from './SkillIcon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
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
    { name: 'NextJS', category: 'frontend' },
    { name: 'Responsive Design', category: 'frontend' },
    { name: 'NodeJS', category: 'backend' },
    { name: 'PostgreSQL', category: 'backend' },
    { name: 'API REST', category: 'backend' },
    { name: 'Git', category: 'tools' },
    { name: 'GitHub', category: 'tools' },
    { name: 'EmailJS', category: 'tools' },
    { name: 'Cybersecurity', category: 'other' },
    { name: 'SEO', category: 'other' }
];

const MOBILE_MAX_CARDS = 4;
const DESKTOP_MAX_CARDS = 8;

export default function Skills() {
    const t = useTranslations('skills');
    const tDescriptions = useTranslations('skills.descriptions');
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
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative">
            <div className="max-w-4xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 sm:mb-10 tracking-tight gradient-text">
                    {t('title')}
                </h2>

                <div className="flex flex-wrap gap-2 mb-6 sm:mb-8">
                    {categories.map((category) => (
                        <Button
                            key={category.key}
                            variant={selectedCategory === category.key ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => handleCategoryChange(category.key)}
                        >
                            {category.label}
                        </Button>
                    ))}
                </div>

                <TooltipProvider delayDuration={300}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {displayedSkills.map((skill, index) => {
                            let description: string | undefined;
                            try {
                                description = tDescriptions(skill.name as any);
                                if (!description || description === skill.name
                                    || description.startsWith('skills.descriptions.')) {
                                    description = undefined;
                                }
                            } catch {
                                description = undefined;
                            }
                            return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <div
                                            className="group rounded-lg border border-border bg-card p-4 hover:border-foreground/20 hover:-translate-y-0.5 transition-all duration-300 flex flex-col items-center justify-center gap-3 cursor-pointer">
                                            <div
                                                className="p-2 rounded-lg bg-muted group-hover:bg-foreground/10 transition-all duration-300">
                                                <SkillIcon name={skill.name}
                                                           className="w-6 h-6 text-foreground/80 group-hover:text-foreground transition-colors duration-300"/>
                                            </div>
                                            <h3 className="text-sm font-medium text-foreground/80 text-center group-hover:text-foreground transition-colors duration-300">
                                                {skill.name}
                                            </h3>
                                        </div>
                                    </TooltipTrigger>
                                    {description && (
                                        <TooltipContent
                                            side="bottom"
                                            sideOffset={8}
                                        >
                                            <p className="leading-relaxed">{description}</p>
                                        </TooltipContent>
                                    )}
                                </Tooltip>
                            );
                        })}
                    </div>
                </TooltipProvider>

                {hasMore && (
                    <div className="mt-6 flex justify-center">
                        <Button
                            variant="outline"
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? t('showLess') : t('showMore')}
                        </Button>
                    </div>
                )}
            </div>
        </section>
    );
}
