/*
 * Copyright (c) 2025–2026 Paul Viandier
 * All rights reserved.
 *
 * This source code is proprietary.
 * Commercial use, redistribution, or modification is strictly prohibited
 * without prior written permission.
 *
 * See the LICENSE file in the project root for full license terms.
 */

'use client';

import { useChristmasMode } from '@/hooks/use-christmas';
import { useTheme } from 'next-themes';
import { useEffect, useMemo, useReducer, useSyncExternalStore } from 'react';

interface Snowflake {
    id: number;
    left: number;
    duration: number;
    size: number;
    opacity: number;
    color: string;
    initialTop?: number;
}

function hexToRgb(hex: string): [number, number, number] {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}

function mixColors(color1: string, color2: string, ratio: number): string {
    const rgb1 = hexToRgb(color1);
    const rgb2 = hexToRgb(color2);

    const r = Math.round(rgb1[0] * (
        1 - ratio
    ) + rgb2[0] * ratio);
    const g = Math.round(rgb1[1] * (
        1 - ratio
    ) + rgb2[1] * ratio);
    const b = Math.round(rgb1[2] * (
        1 - ratio
    ) + rgb2[2] * ratio);

    return `rgb(${r}, ${g}, ${b})`;
}

function clamp(n: number, min: number, max: number): number {
    return Math.max(min, Math.min(max, n));
}

function createSnowflakes(minOpacity: number, maxOpacity: number): Snowflake[] {
    const count = 20;
    const columns = 5;
    const columnWidth = 100 / columns;

    const color1 = '#7da8f0';
    const color2 = '#f0877d';

    const out: Snowflake[] = [];

    for (let i = 0; i < count; i++) {
        const column = i % columns;
        const baseLeft = column * columnWidth;
        const offset = (
                           Math.random() - 0.5
                       ) * columnWidth * 0.6;
        const left = clamp(baseLeft + columnWidth / 2 + offset, 0, 100);

        const mixedColor = mixColors(color1, color2, Math.random());
        const duration = 10 + Math.random() * 20;
        const initialProgress = Math.random();

        out.push({
            id: i,
            left,
            duration,
            size: 16 + Math.random() * 20,
            opacity: minOpacity + Math.random() * (
                maxOpacity - minOpacity
            ),
            color: mixedColor,
            initialTop: -20 - initialProgress * 100
        });
    }

    return out;
}

function updateOpacities(
    snowflakes: Snowflake[],
    minOpacity: number,
    maxOpacity: number
): Snowflake[] {
    return snowflakes.map((s) => (
        {
            ...s,
            opacity: minOpacity + Math.random() * (
                maxOpacity - minOpacity
            )
        }
    ));
}

const subscribeNoop = () => () => {};
const getTrue = () => true;
const getFalse = () => false;



export function Snowflakes() {
    const isChristmasMode = useChristmasMode();
    const { resolvedTheme } = useTheme();

    const isClient = useSyncExternalStore(subscribeNoop, getTrue, getFalse);

    const isDark = isClient && resolvedTheme === 'dark';

    const minOpacity = isDark ? 0.1 : 0.2;
    const maxOpacity = isDark ? 0.25 : 0.45;
    const opacityKey = `${isDark}:${minOpacity}:${maxOpacity}`;

    type SnowflakeAction =
        | { type: 'create'; minOpacity: number; maxOpacity: number }
        | { type: 'update'; minOpacity: number; maxOpacity: number }
        | { type: 'clear' };

    const [snowflakes, dispatch] = useReducer(
        (state: Snowflake[], action: SnowflakeAction): Snowflake[] => {
            switch (action.type) {
                case 'clear':
                    return [];
                case 'create':
                    return createSnowflakes(action.minOpacity, action.maxOpacity);
                case 'update':
                    return state.length === 0
                        ? createSnowflakes(action.minOpacity, action.maxOpacity)
                        : updateOpacities(state, action.minOpacity, action.maxOpacity);
            }
        },
        []
    );

    useEffect(() => {
        if (!isClient) return;

        if (!isChristmasMode) {
            dispatch({ type: 'clear' });
            return;
        }

        dispatch({ type: 'update', minOpacity, maxOpacity });
    }, [isClient, isChristmasMode, opacityKey, minOpacity, maxOpacity]);

    if (!isClient || !isChristmasMode || snowflakes.length === 0) return null;

    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
            {snowflakes.map((snowflake) => (
                <div
                    key={snowflake.id}
                    className="snowflake"
                    style={{
                        position: 'absolute',
                        left: `${snowflake.left}%`,
                        top: '-20px',
                        fontSize: `${snowflake.size}px`,
                        lineHeight: '1',
                        opacity: snowflake.opacity,
                        color: snowflake.color,
                        animation: `snowfall ${snowflake.duration}s linear infinite`,
                        animationDelay:
                            snowflake.initialTop !== undefined
                                ? `${(
                                         (
                                             snowflake.initialTop + 20
                                         ) / 100
                                     ) * snowflake.duration}s`
                                : '0s',
                        willChange: 'transform',
                        userSelect: 'none',
                        fontFamily: 'system-ui, -apple-system, sans-serif'
                    }}
                >
                    ❄
                </div>
            ))}
        </div>
    );
}