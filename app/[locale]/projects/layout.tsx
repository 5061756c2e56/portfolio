import ProjectsNavigation from '@/components/navbars/projects/ProjectsNavigation';

export default function ProjectsLayout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <ProjectsNavigation/>
            {children}
        </>
    );
}