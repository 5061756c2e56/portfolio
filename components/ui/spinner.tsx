import { cn } from '@/lib/utils';

export function Spinner({ className }: { className?: string }) {
    return (
        <div
            role="status"
            aria-label="Loading"
            className={cn(
                'h-10 w-10 rounded-full border-4 border-primary/25 border-t-primary animate-spin',
                className
            )}
        />
    );
}