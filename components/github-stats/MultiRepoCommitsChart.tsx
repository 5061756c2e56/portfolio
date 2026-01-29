'use client';

import { useTranslations } from 'next-intl';
import { TrendingUp } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { cn } from '@/lib/utils';
import { MultiRepoTimelinePoint, RepoTimeline } from '@/lib/github/types';

interface MultiRepoCommitsChartProps {
    combinedTimeline: MultiRepoTimelinePoint[];
    timelines: RepoTimeline[];
}

export function MultiRepoCommitsChart({ combinedTimeline, timelines }: MultiRepoCommitsChartProps) {
    const t = useTranslations('githubStats.charts.commits');

    const totalCommits = timelines.reduce((sum, tl) => sum + tl.totalCommits, 0);

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-500"/>
                    <p className="text-sm text-muted-foreground">{t('total', { count: totalCommits })}</p>
                </div>

                {timelines.length > 1 && (
                    <div className="flex flex-wrap gap-3">
                        {timelines.map((tl) => (
                            <div key={tl.repoName} className="flex items-center gap-1.5">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: tl.color }}/>
                                <span className="text-xs text-muted-foreground">
                  {tl.repoDisplayName}: {tl.totalCommits}
                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="w-full h-[260px] sm:h-[300px] md:h-[340px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={combinedTimeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                            {timelines.map((tl) => (
                                <linearGradient
                                    key={`gradient-${tl.repoName}`}
                                    id={`gradient-${tl.repoName}`}
                                    x1="0"
                                    y1="0"
                                    x2="0"
                                    y2="1"
                                >
                                    <stop offset="0%" stopColor={tl.color} stopOpacity={0.4}/>
                                    <stop offset="50%" stopColor={tl.color} stopOpacity={0.15}/>
                                    <stop offset="100%" stopColor={tl.color} stopOpacity={0}/>
                                </linearGradient>
                            ))}
                        </defs>

                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" opacity={0.3} vertical={false}/>

                        <XAxis
                            dataKey="label"
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            tickMargin={12}
                            interval="preserveStartEnd"
                            minTickGap={50}
                            padding={{ left: 15, right: 15 }}
                        />

                        <YAxis
                            tick={{ fill: 'var(--muted-foreground)', fontSize: 11 }}
                            tickLine={false}
                            axisLine={false}
                            allowDecimals={false}
                            tickMargin={8}
                            width={35}
                        />

                        <Tooltip
                            content={({ active, payload, label }) => {
                                if (active && payload && payload.length > 0) {
                                    const totalDayCommits = payload.reduce((sum, entry) =>
                                        sum + (typeof entry.value === 'number' ? entry.value : 0), 0);

                                    return (
                                        <div
                                            className={cn(
                                                'rounded-xl border border-blue-500/30 bg-card/95 backdrop-blur-md',
                                                'px-4 py-3 shadow-xl shadow-blue-500/10'
                                            )}
                                        >
                                            <div className="flex items-center justify-between gap-4 mb-2">
                                                <span className="text-xs text-muted-foreground">{label}</span>
                                                <span className="text-xs font-medium text-blue-500">
                                                    {totalDayCommits} commit{totalDayCommits !== 1 ? 's' : ''}
                                                </span>
                                            </div>
                                            <div className="space-y-1.5">
                                                {payload.map((entry) => {
                                                    const timeline = timelines.find((tl) => tl.repoName === entry.dataKey);
                                                    const value = typeof entry.value === 'number' ? entry.value : 0;

                                                    return (
                                                        <div
                                                            key={String(entry.dataKey)}
                                                            className="flex items-center justify-between gap-4"
                                                        >
                                                            <div className="flex items-center gap-2">
                                                                <div
                                                                    className="w-2 h-2 rounded-full"
                                                                    style={{ backgroundColor: entry.color }}
                                                                />
                                                                <span className="text-xs text-muted-foreground">
                                                                    {timeline?.repoDisplayName || String(entry.dataKey)}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className="font-bold text-sm tabular-nums"
                                                                style={{ color: entry.color }}
                                                            >
                                                                {value}
                                                            </span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            }}
                            cursor={{
                                stroke: '#3b82f6',
                                strokeWidth: 1,
                                strokeDasharray: '4 4',
                                strokeOpacity: 0.5
                            }}
                        />

                        {timelines.length > 1 && <Legend verticalAlign="top" height={36} content={() => null}/>}

                        {timelines.map((tl) => (
                            <Area
                                key={tl.repoName}
                                type="monotone"
                                dataKey={tl.repoName}
                                name={tl.repoDisplayName}
                                stroke={tl.color}
                                fill={`url(#gradient-${tl.repoName})`}
                                strokeWidth={2.5}
                                dot={{
                                    r: 2,
                                    fill: tl.color,
                                    strokeWidth: 0
                                }}
                                activeDot={{
                                    r: 6,
                                    fill: tl.color,
                                    stroke: '#fff',
                                    strokeWidth: 2
                                }}
                                connectNulls={false}
                                isAnimationActive={false}
                            />
                        ))}
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
}