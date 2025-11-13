'use client';

import {
    useEffect,
    useRef,
    useState
} from 'react';

import {
    Carousel,
    type CarouselApi,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious
} from '@/components/ui/carousel';

import { AreaChartGradient } from '@/components/ui/area-chart';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';
import SkillIcon from './SkillIcon';
import Autoplay from 'embla-carousel-autoplay';
import { useTranslations } from 'next-intl';

type SkillData = {
    name: string;
    data: Array<{ year: string; value: number }>;
};

const skills: SkillData[] = [
    {
        name: 'HTML',
        data: [
            {
                year: '2020',
                value: 40
            },
            {
                year: '2021',
                value: 55
            },
            {
                year: '2022',
                value: 70
            },
            {
                year: '2023',
                value: 80
            },
            {
                year: '2024',
                value: 85
            }
        ]
    },
    {
        name: 'JavaScript',
        data: [
            {
                year: '2020',
                value: 30
            },
            {
                year: '2021',
                value: 50
            },
            {
                year: '2022',
                value: 65
            },
            {
                year: '2023',
                value: 72
            },
            {
                year: '2024',
                value: 75
            }
        ]
    },
    {
        name: 'TypeScript',
        data: [
            {
                year: '2021',
                value: 20
            },
            {
                year: '2022',
                value: 45
            },
            {
                year: '2023',
                value: 65
            },
            {
                year: '2024',
                value: 70
            }
        ]
    },
    {
        name: 'CSS',
        data: [
            {
                year: '2021',
                value: 35
            },
            {
                year: '2022',
                value: 60
            },
            {
                year: '2023',
                value: 70
            },
            {
                year: '2024',
                value: 75
            }
        ]
    },
    {
        name: 'Next.js',
        data: [
            {
                year: '2022',
                value: 30
            },
            {
                year: '2023',
                value: 60
            },
            {
                year: '2024',
                value: 70
            }
        ]
    },
    {
        name: 'Node.js',
        data: [
            {
                year: '2021',
                value: 25
            },
            {
                year: '2022',
                value: 45
            },
            {
                year: '2023',
                value: 60
            },
            {
                year: '2024',
                value: 65
            }
        ]
    },
    {
        name: 'Git',
        data: [
            {
                year: '2020',
                value: 50
            },
            {
                year: '2021',
                value: 65
            },
            {
                year: '2022',
                value: 75
            },
            {
                year: '2023',
                value: 80
            },
            {
                year: '2024',
                value: 80
            }
        ]
    },
    {
        name: 'Cybersécurité',
        data: [
            {
                year: '2022',
                value: 30
            },
            {
                year: '2023',
                value: 50
            },
            {
                year: '2024',
                value: 60
            }
        ]
    }
];

export default function Skills() {
    const t = useTranslations('skills');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.2 });
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);
    const autoplayPlugin = useRef(
        Autoplay({
            delay: 4000,
            stopOnInteraction: true,
            stopOnMouseEnter: true
        })
    );

    useEffect(() => {
        if (!api) {
            return;
        }

        setCurrent(api.selectedScrollSnap());
        setCanScrollPrev(api.canScrollPrev());
        setCanScrollNext(api.canScrollNext());

        api.on('select', () => {
            setCurrent(api.selectedScrollSnap());
            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        });
    }, [api]);

    const interactionTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const isInteractingRef = useRef(false);

    const handleInteraction = () => {
        isInteractingRef.current = true;
        if (autoplayPlugin.current) {
            autoplayPlugin.current.stop();
        }
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
    };

    const handleInteractionEnd = () => {
        isInteractingRef.current = false;
        if (interactionTimeoutRef.current) {
            clearTimeout(interactionTimeoutRef.current);
        }
        interactionTimeoutRef.current = setTimeout(() => {
            if (!isInteractingRef.current && autoplayPlugin.current) {
                if ('play' in autoplayPlugin.current && typeof autoplayPlugin.current.play === 'function') {
                    autoplayPlugin.current.play();
                } else if ('reset' in autoplayPlugin.current && typeof autoplayPlugin.current.reset === 'function') {
                    autoplayPlugin.current.reset();
                }
            }
        }, 2000);
    };

    useEffect(() => {
        return () => {
            if (interactionTimeoutRef.current) {
                clearTimeout(interactionTimeoutRef.current);
            }
        };
    }, []);

    return (
        <section ref={ref as React.RefObject<HTMLElement>} id="skills"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-muted/30 via-muted/20 to-background relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none"/>
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    <span
                        className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                        {t('title')}
                    </span>
                </h2>
                <div className="relative px-0 md:px-12">
                    <Carousel
                        setApi={setApi}
                        plugins={[autoplayPlugin.current]}
                        opts={{
                            align: 'start',
                            loop: true,
                            dragFree: false,
                            duration: 30
                        }}
                        className="w-full"
                        onMouseEnter={handleInteraction}
                        onMouseLeave={handleInteractionEnd}
                        onTouchStart={handleInteraction}
                        onTouchEnd={handleInteractionEnd}
                    >
                        <CarouselContent>
                            {skills.map((skill, index) => (
                                <CarouselItem key={index}>
                                    <div
                                        className="group relative rounded-xl border border-border/50 bg-gradient-to-br from-card via-card to-muted/30 p-4 sm:p-6 md:p-8 hover:border-foreground/30 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 outline-none focus:outline-none overflow-hidden"
                                        onMouseEnter={handleInteraction}
                                        onMouseLeave={handleInteractionEnd}
                                        onClick={handleInteraction}
                                        tabIndex={-1}
                                        style={{ animationDelay: `${index * 50}ms` }}
                                    >
                                        <div
                                            className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-blue-500/5 group-hover:via-purple-500/5 group-hover:to-pink-500/5 transition-all duration-500 pointer-events-none"/>
                                        <div className="relative z-10">
                                            <div className="mb-4 sm:mb-6">
                                                <div className="flex items-center gap-2 sm:gap-3 mb-2">
                                                    <div
                                                        className="p-2 rounded-lg bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                                                        <SkillIcon name={skill.name}
                                                                   className="w-5 h-5 sm:w-6 sm:h-6 text-foreground flex-shrink-0"/>
                                                    </div>
                                                    <h3 className="text-xl sm:text-2xl md:text-3xl font-semibold text-foreground group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 transition-all duration-300">
                                                        {skill.name}
                                                    </h3>
                                                </div>
                                                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">
                                                    {t('currentLevel')}: <span
                                                    className="font-semibold text-foreground">{skill.data[skill.data.length
                                                                                                          - 1].value}%</span>
                                                </p>
                                            </div>
                                            <AreaChartGradient 
                                                data={skill.data}
                                                id={skill.name.toLowerCase().replace(/\s+/g, '-')}
                                                levelLabel={t('level')}
                                            />
                                        </div>
                                    </div>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious
                            onClick={handleInteraction}
                            onMouseEnter={handleInteraction}
                            onMouseLeave={handleInteractionEnd}
                            className="hidden md:flex"
                        />
                        <CarouselNext
                            onClick={handleInteraction}
                            onMouseEnter={handleInteraction}
                            onMouseLeave={handleInteractionEnd}
                            className="hidden md:flex"
                        />
                    </Carousel>
                    <div className="mt-4 sm:mt-6 text-center">
                        <div className="flex items-center justify-center gap-3 sm:gap-4">
                            <button
                                onClick={() => {
                                    handleInteraction();
                                    api?.scrollPrev();
                                    setTimeout(() => handleInteractionEnd(), 100);
                                }}
                                onMouseEnter={handleInteraction}
                                onMouseLeave={handleInteractionEnd}
                                disabled={!api || !canScrollPrev}
                                className="md:hidden h-10 w-10 rounded-full border border-border/50 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/40 hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 active:border-border"
                                aria-label="Slide précédent"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
                                </svg>
                            </button>
                            <div className="flex justify-center gap-1.5 sm:gap-2">
                                {skills.map((_, index) => (
                                    <button
                                        key={index}
                                        onClick={() => {
                                            handleInteraction();
                                            api?.scrollTo(index);
                                            setTimeout(() => handleInteractionEnd(), 100);
                                        }}
                                        onMouseEnter={handleInteraction}
                                        onMouseLeave={handleInteractionEnd}
                                        className={cn(
                                            'h-2 sm:h-2.5 rounded-full transition-all duration-200 cursor-pointer touch-manipulation outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 active:border-border',
                                            current === index
                                                ? 'bg-foreground w-6 sm:w-8 border border-foreground'
                                                : 'bg-muted-foreground/40 w-2 sm:w-2.5 border border-border hover:bg-foreground/50 active:bg-foreground/70'
                                        )}
                                        aria-label={`Aller à la compétence ${index + 1}`}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={() => {
                                    handleInteraction();
                                    api?.scrollNext();
                                    setTimeout(() => handleInteractionEnd(), 100);
                                }}
                                onMouseEnter={handleInteraction}
                                onMouseLeave={handleInteractionEnd}
                                disabled={!api || !canScrollNext}
                                className="md:hidden h-10 w-10 rounded-full border border-border/50 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm text-foreground shadow-lg hover:shadow-xl hover:shadow-blue-500/20 transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 hover:border-blue-500/40 hover:scale-110 active:scale-95 flex items-center justify-center disabled:opacity-50 disabled:pointer-events-none outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 active:border-border"
                                aria-label="Slide suivant"
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                                     strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}