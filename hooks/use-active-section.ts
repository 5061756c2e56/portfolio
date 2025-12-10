'use client';

import { useEffect, useState } from 'react';

export function useActiveSection() {
    const [activeSection, setActiveSection] = useState<string>('home');

    useEffect(() => {
        const sections = ['about', 'skills', 'quiz', 'projects', 'github-stats', 'contact'];

        const handleScroll = () => {
            const scrollPosition = window.scrollY + 150;
            const windowHeight = window.innerHeight;
            const documentHeight = document.documentElement.scrollHeight;
            const homeSection = document.getElementById('home');
            const aboutSection = document.getElementById('about');
            const contactSection = document.getElementById('contact');

            if (homeSection && aboutSection) {
                const aboutTop = aboutSection.offsetTop;
                
                if (scrollPosition < aboutTop) {
                    setActiveSection('home');
                    return;
                }
            }

            if (contactSection) {
                const contactTop = contactSection.offsetTop;
                const contactBottom = contactTop + contactSection.offsetHeight;
                
                if (scrollPosition + windowHeight >= documentHeight - 50 || scrollPosition >= contactTop - 100) {
                    setActiveSection('contact');
                    return;
                }
            }

            for (let i = sections.length - 2; i >= 0; i--) {
                const section = document.getElementById(sections[i]);
                if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionBottom = sectionTop + section.offsetHeight;
                    if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionBottom) {
                        setActiveSection(sections[i]);
                        return;
                    }
                }
            }
            
            setActiveSection('home');
        };

        handleScroll();
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return activeSection;
}

