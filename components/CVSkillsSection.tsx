'use client';

import {
    useMemo,
    useState
} from 'react';
import {
    useMessages,
    useTranslations
} from 'next-intl';
import SkillIcon from './SkillIcon';
import { cn } from '@/lib/utils';

type Category = 'all' | 'frontend' | 'backend' | 'tools' | 'other';

export default function SkillsSection() {
    const t = useTranslations('cv.skills');
    const messages = useMessages();
    const [selectedCategory, setSelectedCategory] = useState<Category>('all');

    const skills = useMemo(() => {
        const items = (messages.cv?.skills?.items as Record<string, { category: string; name: string }>) || {};
        return Object.entries(items).map(([key, data]) => ({
            key,
            name: data.name || key,
            category: data.category as Category
        }));
    }, [messages]);

    const filteredSkills = useMemo(() => {
        if (selectedCategory === 'all') return skills;
        return skills.filter(skill => skill.category === selectedCategory);
    }, [skills, selectedCategory]);

    const categories: Category[] = ['all', 'frontend', 'backend', 'tools', 'other'];

    return (
        <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setSelectedCategory(category)}
                        className={cn(
                            'px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
                            selectedCategory === category
                                ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                                : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                        )}
                    >
                        {category === 'all' ? t('all') : t(`categories.${category}`)}
                    </button>
                ))}
            </div>
            <div className="flex flex-wrap gap-3">
                {filteredSkills.map((skill) => (
                    <div
                        key={skill.key}
                        className="group relative flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-muted/80 to-muted/50 border border-border/50 hover:border-primary/30 hover:shadow-md hover:shadow-primary/10 transition-all duration-300 hover:scale-105"
                    >
                        <div className="flex-shrink-0">
                            <SkillIcon name={skill.name} className="w-5 h-5"/>
                        </div>
                        <span className="text-sm font-medium text-foreground">{skill.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
}