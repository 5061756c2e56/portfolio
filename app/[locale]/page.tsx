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

import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Skills from '@/components/home/Skills';
import Timeline from '@/components/home/Timeline';
import Projects from '@/components/home/Projects';
import Contact from '@/components/home/Contact';
import Navigation from '@/components/navbars/Navigation';
import FinalCTA from '@/components/home/FinalCTA';

import type { Metadata } from 'next';

export const metadata: Metadata = {
    robots: { index: true, follow: true }
};

export default function Home() {
    return (
        <>
            <Navigation />
            <div className="min-h-screen text-foreground transition-colors duration-300">
                <Hero />
                <About />
                <Skills />
                <Timeline />
                <Projects />
                <Contact />
                <FinalCTA />
            </div>
        </>
    );
}
