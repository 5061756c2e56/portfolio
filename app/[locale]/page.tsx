import { lazy, Suspense } from 'react';

import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Navigation from '@/components/Navigation';

const Skills = lazy(() => import('@/components/home/Skills'));
const Projects = lazy(() => import('@/components/home/Projects'));
const Contact = lazy(() => import('@/components/home/Contact'));
const Footer = lazy(() => import('@/components/home/Footer'));

export default function Home() {
    return (
        <>
            <Navigation/>
            <main className="min-h-screen text-foreground transition-colors duration-300">
                <Hero/>
                <About/>
                <Suspense fallback={null}>
                    <Skills/>
                </Suspense>
                <Suspense fallback={null}>
                    <Projects/>
                </Suspense>
                <Suspense fallback={null}>
                    <Contact/>
                </Suspense>
                <Suspense fallback={null}>
                    <Footer/>
                </Suspense>
            </main>
        </>
    );
}