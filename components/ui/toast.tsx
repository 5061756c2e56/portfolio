'use client';

import {
    useEffect,
    useState
} from 'react';
import { cn } from '@/lib/utils';

interface ToastProps {
    message: string;
    type?: 'success' | 'error' | 'info';
    duration?: number;
    onClose?: () => void;
}

export function Toast({
    message,
    type = 'success',
    duration = 4000,
    onClose
}: ToastProps) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const styles = {
        success: 'bg-green-500/10 border-green-500/20 text-green-600',
        error: 'bg-red-500/10 border-red-500/20 text-red-600',
        info: 'bg-blue-500/10 border-blue-500/20 text-blue-600'
    };

    return (
        <div className={cn(
            'fixed top-4 right-4 z-[100] px-4 py-3 rounded-lg border shadow-md backdrop-blur-sm animate-slide-in-from-right-2',
            styles[type]
        )}>
            <div className="flex items-center gap-3">
                {type === 'success' && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7"/>
                    </svg>
                )}
                {type === 'error' && (
                    <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                         strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
                    </svg>
                )}
                <p className="text-sm font-medium">{message}</p>
            </div>
        </div>
    );
}