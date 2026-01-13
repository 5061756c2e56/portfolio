'use client';

import {
    ArrowLeft,
    ArrowRight
} from 'lucide-react';

import useEmblaCarousel, { type UseEmblaCarouselType } from 'embla-carousel-react';

import * as React from 'react';
import { cn } from '@/lib/utils';

type CarouselApi = UseEmblaCarouselType[1];
type UseCarouselParameters = Parameters<typeof useEmblaCarousel>;
type CarouselOptions = UseCarouselParameters[0];
type CarouselPlugin = UseCarouselParameters[1];

type CarouselProps = {
    opts?: CarouselOptions;
    plugins?: CarouselPlugin;
    orientation?: 'horizontal' | 'vertical';
    setApi?: (api: CarouselApi) => void;
};

type CarouselContextProps = {
    carouselRef: ReturnType<typeof useEmblaCarousel>[0];
    api: ReturnType<typeof useEmblaCarousel>[1];
    scrollPrev: () => void;
    scrollNext: () => void;
    canScrollPrev: boolean;
    canScrollNext: boolean;
} & CarouselProps;

const CarouselContext = React.createContext<CarouselContextProps | null>(null);

function useCarousel() {
    const context = React.useContext(CarouselContext);

    if (!context) {
        throw new Error('useCarousel must be used within a <Carousel />');
    }

    return context;
}

const Carousel = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement> & CarouselProps
>(
    (
        {
            orientation = 'horizontal',
            opts,
            setApi,
            plugins,
            className,
            children,
            ...props
        },
        ref
    ) => {
        const [carouselRef, api] = useEmblaCarousel(
            {
                ...opts,
                axis: orientation === 'horizontal' ? 'x' : 'y'
            },
            plugins
        );
        const [canScrollPrev, setCanScrollPrev] = React.useState(false);
        const [canScrollNext, setCanScrollNext] = React.useState(false);

        const onSelect = React.useCallback((api: CarouselApi) => {
            if (!api) {
                return;
            }

            setCanScrollPrev(api.canScrollPrev());
            setCanScrollNext(api.canScrollNext());
        }, []);

        const scrollPrev = React.useCallback(() => {
            api?.scrollPrev();
        }, [api]);

        const scrollNext = React.useCallback(() => {
            api?.scrollNext();
        }, [api]);

        const handleKeyDown = React.useCallback(
            (event: React.KeyboardEvent<HTMLDivElement>) => {
                if (event.key === 'ArrowLeft') {
                    event.preventDefault();
                    scrollPrev();
                } else if (event.key === 'ArrowRight') {
                    event.preventDefault();
                    scrollNext();
                }
            },
            [scrollPrev, scrollNext]
        );

        React.useEffect(() => {
            if (!api || !setApi) {
                return;
            }

            setApi(api);
        }, [api, setApi]);

        React.useEffect(() => {
            if (!api) {
                return;
            }

            onSelect(api);
            api.on('reInit', onSelect);
            api.on('select', onSelect);

            return () => {
                api?.off('select', onSelect);
            };
        }, [api, onSelect]);

        return (
            <CarouselContext.Provider
                value={{
                    carouselRef,
                    api: api,
                    opts,
                    orientation,
                    scrollPrev,
                    scrollNext,
                    canScrollPrev,
                    canScrollNext
                }}
            >
                <div
                    ref={ref}
                    onKeyDown={handleKeyDown}
                    className={cn('relative', className)}
                    role="region"
                    aria-roledescription="carousel"
                    {...props}
                >
                    {children}
                </div>
            </CarouselContext.Provider>
        );
    }
);
Carousel.displayName = 'Carousel';

const CarouselContent = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
}, ref) => {
    const {
        carouselRef,
        orientation
    } = useCarousel();

    return (
        <div ref={carouselRef} className="overflow-hidden">
            <div
                ref={ref}
                className={cn(
                    'flex',
                    orientation === 'horizontal' ? '-ml-4' : '-mt-4 flex-col',
                    className
                )}
                {...props}
            />
        </div>
    );
});
CarouselContent.displayName = 'CarouselContent';

const CarouselItem = React.forwardRef<
    HTMLDivElement,
    React.HTMLAttributes<HTMLDivElement>
>(({
    className,
    ...props
}, ref) => {
    const { orientation } = useCarousel();

    return (
        <div
            ref={ref}
            role="group"
            aria-roledescription="slide"
            className={cn(
                'min-w-0 shrink-0 grow-0 basis-full',
                orientation === 'horizontal' ? 'pl-4' : 'pt-4',
                className
            )}
            {...props}
        />
    );
});
CarouselItem.displayName = 'CarouselItem';

const CarouselPrevious = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> & { mobilePosition?: 'bottom' | 'side' }
>(({
    className,
    onClick,
    mobilePosition = 'side',
    ...props
}, ref) => {
    const {
        orientation,
        scrollPrev,
        canScrollPrev
    } = useCarousel();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        scrollPrev();
        onClick?.(e);
    };

    return (
        <button
            ref={ref}
            onClick={handleClick}
            disabled={!canScrollPrev}
            aria-label="Previous slide"
            className={cn(
                'absolute z-10 h-10 w-10 rounded-full border border-border/50 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm text-foreground transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 hover:border-primary/50 hover:scale-110 active:scale-95 cursor-pointer disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 active:border-primary/50',
                orientation === 'horizontal'
                    ? mobilePosition === 'bottom'
                        ? 'md:left-2 md:-left-12 md:top-1/2 md:-translate-y-1/2 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 md:translate-y-0 md:translate-x-0'
                        : 'left-2 md:-left-12 top-1/2 -translate-y-1/2'
                    : '-top-12 left-1/2 -translate-x-1/2 rotate-90',
                className
            )}
            {...props}
        >
            <ArrowLeft className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"/>
            <span className="sr-only">Previous slide</span>
        </button>
    );
});
CarouselPrevious.displayName = 'CarouselPrevious';

const CarouselNext = React.forwardRef<
    HTMLButtonElement,
    React.HTMLAttributes<HTMLButtonElement> & { mobilePosition?: 'bottom' | 'side' }
>(({
    className,
    onClick,
    mobilePosition = 'side',
    ...props
}, ref) => {
    const {
        orientation,
        scrollNext,
        canScrollNext
    } = useCarousel();

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        scrollNext();
        onClick?.(e);
    };

    return (
        <button
            ref={ref}
            onClick={handleClick}
            disabled={!canScrollNext}
            aria-label="Next slide"
            className={cn(
                'absolute z-10 h-10 w-10 rounded-full border border-border/50 bg-gradient-to-br from-background/95 to-background/90 backdrop-blur-sm text-foreground transition-all duration-300 hover:bg-gradient-to-br hover:from-blue-500/10 hover:to-purple-500/10 hover:border-primary/50 hover:scale-110 active:scale-95 cursor-pointer disabled:pointer-events-none disabled:opacity-50 flex items-center justify-center group outline-none focus:outline-none focus-visible:outline-none focus:ring-0 focus:ring-offset-0 active:border-primary/50',
                orientation === 'horizontal'
                    ? mobilePosition === 'bottom'
                        ? 'md:right-2 md:-right-12 md:top-1/2 md:-translate-y-1/2 bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 md:translate-y-0 md:translate-x-0'
                        : 'right-2 md:-right-12 top-1/2 -translate-y-1/2'
                    : '-bottom-12 left-1/2 -translate-x-1/2 rotate-90',
                className
            )}
            {...props}
        >
            <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:scale-110"/>
            <span className="sr-only">Next slide</span>
        </button>
    );
});
CarouselNext.displayName = 'CarouselNext';

export {
    type CarouselApi,
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselPrevious,
    CarouselNext
};