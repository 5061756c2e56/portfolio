'use client';

import {
    useEffect,
    useState
} from 'react';
import dynamic from 'next/dynamic';

const Analytics = dynamic(() => import('@vercel/analytics/react').then(mod => ({ default: mod.Analytics })), {
    ssr: false
});

const SpeedInsights = dynamic(() => import('@vercel/speed-insights/next').then(mod => ({ default: mod.SpeedInsights })), {
    ssr: false
});

export function AnalyticsWrapper() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted || process.env.NODE_ENV !== 'production') {
        return null;
    }

    return (
        <>
            <Analytics mode="production"/>
            <SpeedInsights/>
        </>
    );
}