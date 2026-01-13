import { useCallback } from 'react';

export function useSmoothScroll() {
    const scrollTo = useCallback((targetId: string, offset: number = 0) => {
        const element = document.querySelector(targetId);
        if (!element) return;

        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }, []);

    return { scrollTo };
}





