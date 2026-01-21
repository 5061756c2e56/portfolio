'use client';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils';

interface LoadingOverlayProps {
    isLoading: boolean;
}

export function LoadingOverlay({ isLoading }: LoadingOverlayProps) {
    return (
        <div
            className={cn(
                'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-md transition-opacity duration-300',
                isLoading ? 'opacity-100' : 'opacity-0 pointer-events-none'
            )}
        >
            <Spinner className="h-12 w-12"/>
        </div>
    );
}