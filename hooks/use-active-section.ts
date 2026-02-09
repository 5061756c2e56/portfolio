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

import { useEffect, useState } from 'react';

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState<string>('home');

    useEffect(() => {
        const sections = ['about', 'skills', 'quiz', 'projects', 'contact', 'github-activities', 'extras'];
        const offset = 180;

        const handleScroll = () => {
            const doc = document.documentElement;
            const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 10;

            if (atBottom) {
                const extras = document.getElementById('extras');
                if (extras) {
                    setActiveSection('extras');
                    return;
                }
            }

            const y = window.scrollY + offset;

            const about = document.getElementById('about');
            if (about && y < about.offsetTop - 40) {
                setActiveSection('home');
                return;
            }

            for (let i = sections.length - 1; i >= 0; i--) {
                const el = document.getElementById(sections[i]);
                if (!el) continue;
                if (y >= el.offsetTop) {
                    setActiveSection(sections[i]);
                    return;
                }
            }

            setActiveSection('home');
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        window.addEventListener('resize', handleScroll);
        window.addEventListener('load', handleScroll);

        const t = window.setTimeout(handleScroll, 250);

        return () => {
            window.removeEventListener('scroll', handleScroll);
            window.removeEventListener('resize', handleScroll);
            window.removeEventListener('load', handleScroll);
            window.clearTimeout(t);
        };
    }, []);

    return activeSection;
}