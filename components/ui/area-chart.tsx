'use client';

import {
    Area,
    AreaChart,
    CartesianGrid,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts';

import * as React from 'react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface AreaChartProps {
    data: Array<{ year: string; value: number }>;
    className?: string;
    id?: string;
    levelLabel?: string;
}

export function AreaChartGradient({
    data,
    className,
    id = 'default',
    levelLabel = 'Niveau'
}: AreaChartProps) {
    const gradientId = `gradient-${id}`;
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return (
            <div 
                className={cn('w-full h-[300px] outline-none focus:outline-none select-none cursor-help', className)} 
                style={{ 
                    userSelect: 'none', 
                    WebkitUserSelect: 'none', 
                    minWidth: '0px', 
                    minHeight: '300px',
                    width: '100%',
                    height: '300px'
                }}
            />
        );
    }

    return (
        <div 
            className={cn('w-full h-[300px] outline-none focus:outline-none select-none cursor-help', className)} 
            tabIndex={-1}
            style={{ 
                userSelect: 'none', 
                WebkitUserSelect: 'none', 
                minWidth: '0px', 
                minHeight: '300px',
                width: '100%',
                height: '300px',
                position: 'relative'
            }}
        >
            <ResponsiveContainer 
                width="100%" 
                height="100%" 
                minWidth={300} 
                minHeight={300}
                style={{ cursor: 'help' }}
            >
                <AreaChart
                    data={data}
                    margin={{
                        top: 10,
                        right: 10,
                        left: 0,
                        bottom: 20
                    }}
                >
                    <defs>
                        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="50%" stopColor="#3b82f6" stopOpacity={0.4}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.5}/>
                    <XAxis
                        dataKey="year"
                        tick={{
                            fill: 'var(--muted-foreground)',
                            fontSize: 12
                        }}
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                    />
                    <YAxis
                        domain={[0, 100]}
                        tick={{
                            fill: 'var(--muted-foreground)',
                            fontSize: 12
                        }}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(value) => `${value}%`}
                    />
                    <Tooltip
                        content={({
                            active,
                            payload,
                            label
                        }) => {
                            if (active && payload && payload.length) {
                                return (
                                    <div
                                        className="rounded-lg border border-blue-500/30 bg-card/95 backdrop-blur-sm p-3 shadow-md ring-1 ring-blue-500/10">
                                        <div className="grid gap-2">
                                            <div className="text-xs text-muted-foreground mb-1">{label}</div>
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-sm text-muted-foreground">{levelLabel}</span>
                                                <span
                                                    className="font-bold text-blue-500 text-base">{payload[0].value}%</span>
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        }}
                        cursor={{
                            stroke: '#3b82f6',
                            strokeWidth: 2,
                            strokeDasharray: '5 5',
                            opacity: 0.5
                        }}
                        animationDuration={200}
                    />
                    <Area
                        type="monotone"
                        dataKey="value"
                        stroke="#3b82f6"
                        fill={`url(#${gradientId})`}
                        strokeWidth={2}
                        dot={{
                            fill: '#3b82f6',
                            r: 4
                        }}
                        activeDot={{
                            r: 6,
                            fill: '#3b82f6',
                            stroke: '#fff',
                            strokeWidth: 2
                        }}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}