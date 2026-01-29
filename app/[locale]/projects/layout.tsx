import ProjectsNavigation from '@/components/navbars/Projects/ProjectsNavigation';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProjectsNavigation/>
            {children}
        </>
    );
}