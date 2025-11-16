'use client';

import {
    useRef,
    useState
} from 'react';
import { cn } from '@/lib/utils';

interface LiquidButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'secondary' | 'ghost';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    fillHeight?: string;
    hoverScale?: number;
    tapScale?: number;
}

export function LiquidButton({
    children,
    className,
    variant = 'default',
    size = 'default',
    fillHeight = '3px',
    hoverScale = 1.05,
    tapScale = 0.95,
    ...props
}: LiquidButtonProps) {
    const [isHovered, setIsHovered] = useState(false);
    const [isPressed, setIsPressed] = useState(false);
    const [isFilling, setIsFilling] = useState(false);
    const buttonRef = useRef<HTMLButtonElement>(null);
    const fillTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const sizes = {
        default: 'px-6 py-3 text-base',
        sm: 'px-4 py-2 text-sm',
        lg: 'px-8 py-4 text-lg',
        icon: 'p-3'
    };

    return (
        <button
            ref={buttonRef}
            className={cn(
                'relative overflow-hidden rounded-md font-medium transition-all duration-300 cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                'bg-transparent border border-border/70 dark:border-border/50',
                'text-foreground dark:text-white',
                'hover:border-transparent',
                'shadow-[0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[0_2px_8px_rgba(255,255,255,0.05)]',
                'hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] dark:hover:shadow-[0_4px_12px_rgba(255,255,255,0.08)]',
                'disabled:cursor-not-allowed',
                sizes[size],
                className
            )}
            style={{
                transform: isPressed ? `scale(${tapScale})` : isHovered ? `scale(${hoverScale})` : 'scale(1)',
                transition: 'transform 0.2s ease-out, color 0.3s ease-out, border-color 0.3s ease-out'
            }}
            onMouseEnter={() => {
                setIsHovered(true);
                fillTimeoutRef.current = setTimeout(() => {
                    setIsFilling(true);
                }, 500);
            }}
            onMouseLeave={() => {
                setIsHovered(false);
                setIsFilling(false);
                if (fillTimeoutRef.current) {
                    clearTimeout(fillTimeoutRef.current);
                }
            }}
            onMouseDown={() => setIsPressed(true)}
            onMouseUp={() => setIsPressed(false)}
            {...props}
        >
            <span
                className={cn(
                    'relative z-10 transition-colors duration-300',
                    isFilling ? 'text-white dark:text-black' : ''
                )}
                style={{
                    transitionDelay: isFilling ? '0s' : '0.5s'
                }}
            >
                {children}
            </span>
            <span
                className={cn(
                    'absolute bottom-0 left-0 bg-foreground dark:bg-white',
                    isHovered ? 'h-full' : 'h-[3px]'
                )}
                style={{
                    width: isHovered ? '100%' : '0%',
                    transition: isHovered
                        ? 'width 0.5s cubic-bezier(0.4, 0, 0.2, 1), height 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.5s'
                        : 'height 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
                }}
            />
        </button>
    );
}