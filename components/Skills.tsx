'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import SkillIcon from './SkillIcon';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
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
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 tracking-tight gradient-text">
                    {t('title')}
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

                <TooltipProvider delayDuration={300}>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                        {displayedSkills.map((skill, index) => {
                            let description: string | undefined;
                            try {
                                description = tDescriptions(skill.name as any);
                                if (!description || description === skill.name || description.startsWith('skills.descriptions.')) {
                                    description = undefined;
                                }
                            } catch {
                                description = undefined;
                            }
                            return (
                                <Tooltip key={index}>
                                    <TooltipTrigger asChild>
                                        <div className="group relative rounded-xl border border-border/60 bg-gradient-to-br from-card via-card/95 to-primary/5 p-3 sm:p-4 hover:border-primary/50 hover:-translate-y-1 transition-all duration-500 flex flex-col items-center justify-center gap-2 cursor-pointer">
                                            <div className="p-1.5 sm:p-2 rounded-xl bg-gradient-to-br from-primary/15 to-accent/15 border border-border/40 group-hover:from-primary/30 group-hover:to-accent/30 group-hover:border-primary/50 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500">
                                                <SkillIcon name={skill.name} className="w-6 h-6 sm:w-7 sm:h-7 text-foreground transition-colors duration-300"/>
                                            </div>
                                            <h3 className="text-xs sm:text-sm font-semibold text-foreground text-center group-hover:text-primary transition-colors duration-300">
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
