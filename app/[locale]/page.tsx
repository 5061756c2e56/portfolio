import { lazy, Suspense } from 'react';
import {
    SidebarInset,
    SidebarProvider,
    SidebarTrigger
} from '@/components/ui/sidebar';

import Hero from '@/components/Hero';
import About from '@/components/About';
import { AppSidebar } from '@/components/AppSidebar';

const Skills = lazy(() => import('@/components/Skills'));
const Projects = lazy(() => import('@/components/Projects'));
const Contact = lazy(() => import('@/components/Contact'));
const Footer = lazy(() => import('@/components/Footer'));

export default function Home() {
    return (
        <SidebarProvider>
            <AppSidebar/>
            <SidebarInset>
                <div
                    className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-2 border-b border-border bg-background px-4 lg:hidden">
                    <SidebarTrigger/>
                </div>
                <main className="min-h-screen bg-background text-foreground transition-colors duration-300">
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
            </SidebarInset>
        </SidebarProvider>
    );
}