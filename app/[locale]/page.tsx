import Hero from '@/components/home/Hero';
import About from '@/components/home/About';
import Skills from '@/components/home/Skills';
import Projects from '@/components/home/Projects';
import Contact from '@/components/home/Contact';
import Footer from '@/components/home/Footer';
import Navigation from '@/components/navbars/Navigation';
import FinalCTA from '@/components/home/FinalCTA';

export default function Home() {
    return (
        <>
            <Navigation/>
            <main className="min-h-screen text-foreground transition-colors duration-300">
                <Hero/>
                <About/>
                <Skills/>
                <Projects/>
                <Contact/>
                <FinalCTA/>
                <Footer/>
            </main>
        </>
    );
}