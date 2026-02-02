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

import type { ReactNode } from 'react';
import type { Metadata } from 'next';
import { getFormatter, getTranslations } from 'next-intl/server';
import { Briefcase, Calendar, Code2, Database, GraduationCap, Home, Layers, Shield, User, Wrench } from 'lucide-react';
import Image from 'next/image';
import { Link } from '@/i18n/routing';
import LegalNavigation from '@/components/navbars/Legal/LegalNavigation';
import ProfileBlock, { CvDownloadButton } from '@/components/cv/ProfileBlock';

type CvSection = {
    id: string;
    title: string;
    icon: ReactNode;
    content: ReactNode;
};

const LAST_UPDATED_ISO = '2026-01-31';

export const metadata: Metadata = {
    title: 'Curriculum Vitae',
    description: 'CV Viandier Paul',
    robots: { index: false, follow: false }
};

const CV_BASE = {
    name: 'Paul Viandier',
    email: 'contact@paulviandier.com',
    website: 'paulviandier.com',

    githubLabel: '5061756c2e56',
    githubUrl: 'https://github.com/5061756c2e56',

    linkedinLabel: 'Paul Viandier',
    linkedinUrl: 'https://www.linkedin.com/in/paul-viandier-648837397/',

    skills: {
        frontend: ['HTML', 'CSS', 'JavaScript', 'React', 'Next.js', 'Tailwind CSS', 'TypeScript'],
        stateApi: ['Redux', 'API REST'],
        backendData: ['Node.js', 'PostgreSQL', 'Prisma ORM'],
        tooling: ['Git', 'Figma', 'Responsive Design'],
        security: ['Cybersécurité']
    }
} satisfies {
    name: string;
    email: string;
    website: string;
    githubLabel: string;
    githubUrl: string;
    linkedinLabel: string;
    linkedinUrl: string;
    skills: {
        frontend: string[];
        stateApi: string[];
        backendData: string[];
        tooling: string[];
        security: string[];
    };
};

const PILL_COLORS = [
    'bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/25',
    'bg-muted text-muted-foreground border-border',
    'bg-muted text-muted-foreground border-border',
    'bg-muted text-muted-foreground border-border',
    'bg-muted text-muted-foreground border-border'
] as const;

function Pill({ children, index = 0 }: { children: ReactNode; index?: number }) {
    const colorClass = PILL_COLORS[index % PILL_COLORS.length];
    return (
        <span className={`rounded-full border px-3 py-1 text-xs font-medium shadow-sm ${colorClass}`}>
            {children}
        </span>
    );
}

function ShieldsBadge({
    label,
    logo,
    color = '111827'
}: {
    label: string;
    logo?: string;
    color?: string;
}) {
    const url =
        `https://img.shields.io/badge/${encodeURIComponent(label)}-${encodeURIComponent(color)}` +
        `?style=flat&logo=${encodeURIComponent(logo ?? '')}` +
        `&logoColor=white`;

    return (
        <Image
            src={url}
            alt={label}
            width={140}
            height={24}
            className="h-6 w-auto"
            unoptimized
        />
    );
}

function SkillCard({
    icon,
    title,
    items
}: {
    icon: ReactNode;
    title: string;
    items: string[];
}) {
    const toBadge = (s: string) => {
        const key = s.toLowerCase();

        if (key === 'html') return { label: 'HTML', logo: 'html5', color: 'E34F26' };
        if (key === 'css') return { label: 'CSS', logo: 'css3', color: '1572B6' };
        if (key === 'javascript') return { label: 'JavaScript', logo: 'javascript', color: 'F7DF1E' };
        if (key === 'react') return { label: 'React', logo: 'react', color: '61DAFB' };
        if (key === 'next.js' || key === 'nextjs') return { label: 'Next.js', logo: 'nextdotjs', color: '000000' };
        if (key === 'tailwind css' || key === 'tailwindcss') {
            return {
                label: 'Tailwind CSS', logo: 'tailwindcss', color: '06B6D4'
            };
        }
        if (key === 'prisma' || key === 'prisma orm') return { label: 'Prisma ORM', logo: 'prisma', color: '2D3748' };
        if (key === 'typescript') return { label: 'TypeScript', logo: 'typescript', color: '3178C6' };

        if (key === 'redux') return { label: 'Redux', logo: 'redux', color: '764ABC' };
        if (key === 'api rest' || key === 'rest api' || key === 'api') {
            return {
                label: 'REST API', logo: 'openapiinitiative', color: '6BA539'
            };
        }

        if (key === 'node.js' || key === 'nodejs') return { label: 'Node.js', logo: 'nodedotjs', color: '339933' };
        if (key === 'postgresql') return { label: 'PostgreSQL', logo: 'postgresql', color: '4169E1' };

        if (key === 'git') return { label: 'Git', logo: 'git', color: 'F05032' };
        if (key === 'figma') return { label: 'Figma', logo: 'figma', color: 'F24E1E' };
        if (key === 'responsive design' || key === 'responsive') {
            return {
                label: 'Responsive', logo: 'css3', color: '0EA5E9'
            };
        }

        if (key === 'cybersécurité' || key === 'cybersecurite' || key === 'cybersecurity') {
            return { label: 'Cybersecurity', logo: 'securityscorecard', color: '111827' };
        }

        return { label: s, logo: undefined, color: '111827' };
    };

    return (
        <div
            className="group glass-card rounded-2xl border border-blue-500/20 p-5 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-all duration-300">
            <div className="flex items-center gap-3">
                <div
                    className="rounded-xl border border-border bg-muted/60 p-2.5 text-muted-foreground group-hover:text-foreground/80 transition-colors">
                    {icon}
                </div>
                <h3 className="text-sm font-semibold text-foreground">{title}</h3>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
                {items.map((s) => {
                    const b = toBadge(s);
                    return <ShieldsBadge key={s} label={b.label} logo={b.logo} color={b.color}/>;
                })}
            </div>
        </div>
    );
}

function FileBadge() {
    return (
        <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="h-4 w-4 text-foreground/70"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
        >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
            <path d="M14 2v6h6"/>
            <path d="M8 13h8"/>
            <path d="M8 17h8"/>
            <path d="M8 9h2"/>
        </svg>
    );
}

export default async function CurriculumVitaePage() {
    const t = await getTranslations('cv');
    const format = await getFormatter();

    const lastUpdated = format.dateTime(new Date(LAST_UPDATED_ISO), { dateStyle: 'long' });

    const CV = {
        ...CV_BASE,
        role: t('role'),
        education: [
            {
                key: 'openclassrooms',
                title: t('education.openclassroom.title'),
                org: 'OpenClassrooms',
                level: t('education.openclassroom.level'),
                note: t('education.openclassroom.note'),
                date: t('education.openclassroom.date'),
                bullets: [
                    t('education.openclassroom.bullets.1'),
                    t('education.openclassroom.bullets.2'),
                    t('education.openclassroom.bullets.3'),
                    t('education.openclassroom.bullets.4'),
                    t('education.openclassroom.bullets.5')
                ]
            },
            {
                key: 'rascol',
                title: t('education.rascol.title'),
                org: t('education.rascol.org'),
                level: t('education.rascol.level'),
                note: '',
                date: '2023-2024',
                bullets: [
                    t('education.rascol.bullets.1'),
                    t('education.rascol.bullets.2'),
                    t('education.rascol.bullets.3')
                ]
            }
        ],
        experience: [
            {
                key: 'pinkail',
                items: [
                    {
                        key: 'pinkail',
                        title: t('experience.pinkail.title'),
                        date: t('experience.pinkail.date'),
                        bullets: [
                            t('experience.pinkail.bullets.1'),
                            t('experience.pinkail.bullets.2')
                        ]
                    }
                ]
            },
            {
                key: 'volunteering',
                groupTitle: t('experience.volunteering.groupTitle'),
                items: [
                    {
                        key: 'it',
                        title: t('experience.volunteering.it.title'),
                        date: t('experience.volunteering.it.date'),
                        bullets: [
                            t('experience.volunteering.it.bullets.1'),
                            t('experience.volunteering.it.bullets.2')
                        ]
                    }
                ]
            }
        ]
    };

    const sections: CvSection[] = [
        {
            id: 'profil',
            title: t('sections.profile.title'),
            icon: <User className="h-4 w-4"/>,
            content: (
                <div className="space-y-6">
                    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
                        <div className="flex h-full flex-col">
                            <div className="space-y-4">
                                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                                    {t('sections.profile.p1')}
                                </p>

                                <div className="flex flex-wrap gap-2">
                                    <Pill index={0}>{CV.role}</Pill>
                                    <Pill index={1}>React</Pill>
                                    <Pill index={2}>Next.js</Pill>
                                    <Pill index={3}>TypeScript</Pill>
                                    <Pill index={4}>PostgreSQL</Pill>
                                </div>
                            </div>

                            <div className="mt-auto flex flex-wrap gap-3 pt-6">
                                <Link
                                    href="/"
                                    className="btn-fill-secondary group inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300"
                                >
                                    <Home className="h-4 w-4"/>
                                    {t('actions.backHome')}
                                </Link>

                                <CvDownloadButton
                                    label={t('actions.downloadPdf')}
                                    loadingLabel={t('actions.downloadPdfLoading')}
                                />
                            </div>
                        </div>

                        <ProfileBlock
                            name={CV.name}
                            role={CV.role}
                            email={CV.email}
                            website={CV.website}
                            githubUrl={CV.githubUrl}
                            githubLabel={CV.githubLabel}
                            github={t('sections.profile.github')}
                            linkedinUrl={CV.linkedinUrl}
                            linkedinLabel={CV.linkedinLabel}
                            linkedin={t('sections.profile.linkedin')}
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'competences',
            title: t('sections.skills.title'),
            icon: <Code2 className="h-4 w-4"/>,
            content: (
                <div className="grid gap-4 md:grid-cols-2">
                    <SkillCard
                        icon={<Code2 className="h-4 w-4"/>}
                        title={t('sections.skills.frontend')}
                        items={CV.skills.frontend}
                    />
                    <SkillCard
                        icon={<Layers className="h-4 w-4"/>}
                        title={t('sections.skills.stateApi')}
                        items={CV.skills.stateApi}
                    />
                    <SkillCard
                        icon={<Database className="h-4 w-4"/>}
                        title={t('sections.skills.backendData')}
                        items={CV.skills.backendData}
                    />
                    <SkillCard
                        icon={<Wrench className="h-4 w-4"/>}
                        title={t('sections.skills.tooling')}
                        items={CV.skills.tooling}
                    />
                    <div className="md:col-span-2">
                        <SkillCard
                            icon={<Shield className="h-4 w-4"/>}
                            title={t('sections.skills.security')}
                            items={CV.skills.security}
                        />
                    </div>
                </div>
            )
        },
        {
            id: 'formation',
            title: t('sections.education.title'),
            icon: <GraduationCap className="h-4 w-4"/>,
            content: (
                <div className="space-y-4">
                    {CV.education.map((ed) => (
                        <div
                            key={ed.title}
                            className="glass-card rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/30 transition-colors"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-base font-semibold text-foreground">{ed.title}</p>
                                    <div className="text-sm text-muted-foreground">
                                        <div className="hidden sm:flex flex-wrap items-center gap-x-2 gap-y-1">
                                            {ed.key === 'openclassrooms' ? (
                                                <span className="inline-flex items-center gap-2">
                                                    <Image
                                                        src="/OC.svg"
                                                        alt="OpenClassrooms"
                                                        width={13}
                                                        height={16}
                                                        className="shrink-0"
                                                    />
                                                    <span className="leading-none">{ed.org}</span>
                                                </span>
                                            ) : (
                                                <span className="leading-none">{ed.org}</span>
                                            )}

                                            <span aria-hidden="true">•</span>
                                            <span>{ed.level}</span>

                                            {ed.note ? (
                                                <>
                                                    <span aria-hidden="true">•</span>
                                                    <span>{ed.note}</span>
                                                </>
                                            ) : null}
                                        </div>

                                        <div className="sm:hidden space-y-1">
                                            <div className="flex items-center gap-2">
                                                {ed.key === 'openclassrooms' ? (
                                                    <Image
                                                        src="/OC.svg"
                                                        alt="OpenClassrooms"
                                                        width={13}
                                                        height={16}
                                                        className="shrink-0"
                                                    />
                                                ) : null}
                                                <span className="leading-none">{ed.org}</span>
                                            </div>

                                            <div className="leading-none">{ed.level}</div>

                                            {ed.note ? <div className="leading-none">{ed.note}</div> : null}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                                    <Calendar className="h-4 w-4"/>
                                    {ed.date}
                                </div>
                            </div>

                            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {ed.bullets.map((b) => (
                                    <li key={b} className="relative pl-4">
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                                        />
                                        <span className="block">{b}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            )
        },
        {
            id: 'experience',
            title: t('sections.experience.title'),
            icon: <Briefcase className="h-4 w-4"/>,
            content: (
                () => {
                    const pinnedGroupKey = 'pinkail';
                    const pinnedGroup = CV.experience.find((g) => g.key === pinnedGroupKey);
                    const otherGroups = CV.experience.filter((g) => g.key !== pinnedGroupKey);

                    const Card = ({
                        xp
                    }: {
                        xp: { key: string; title: string; date: string; bullets: string[] };
                    }) => (
                        <div
                            key={xp.key}
                            className="glass-card rounded-2xl border border-blue-500/20 p-6 hover:border-blue-500/30 transition-colors"
                        >
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <p className="text-base font-semibold text-foreground">{xp.title}</p>
                                </div>

                                <div
                                    className="inline-flex items-center gap-2 rounded-xl border border-border bg-muted/60 px-3 py-2 text-xs font-medium text-muted-foreground">
                                    <Calendar className="h-4 w-4"/>
                                    {xp.date}
                                </div>
                            </div>

                            <ul className="mt-4 grid gap-2 sm:grid-cols-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                                {xp.bullets.map((b) => (
                                    <li key={b} className="relative min-w-0 pl-4">
                                        <span
                                            aria-hidden="true"
                                            className="absolute left-0 top-[0.6em] h-1.5 w-1.5 rounded-full bg-muted-foreground/60"
                                        />
                                        <span className="block">{b}</span>
                                    </li>
                                ))}
                            </ul>


                        </div>
                    );

                    return (
                        <div className="space-y-5">
                            {pinnedGroup ? (
                                <div className="space-y-4">
                                    {pinnedGroup.items.map((xp) => (
                                        <Card
                                            key={xp.key}
                                            xp={xp as { key: string; title: string; date: string; bullets: string[] }}
                                        />
                                    ))}
                                </div>
                            ) : null}

                            {otherGroups.map((group) => (
                                <div key={group.key} className="space-y-4">
                                    {'groupTitle' in group && group.groupTitle ? (
                                        <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                                            {group.groupTitle}
                                        </p>
                                    ) : null}

                                    <div className="space-y-4">
                                        {group.items.map((xp) => (
                                            <Card
                                                key={xp.key}
                                                xp={xp as {
                                                    key: string;
                                                    title: string;
                                                    date: string;
                                                    bullets: string[]
                                                }}
                                            />
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    );
                }
            )()
        }
    ];

    return (
        <>
            <LegalNavigation/>
            <div className="min-h-screen w-full bg-background">
                <main className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 mt-24 mb-12 relative">
                    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                        <div
                            className="absolute left-1/2 top-[-140px] h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-foreground/5 blur-3xl"/>
                        <div
                            className="absolute right-[-120px] top-[220px] h-[360px] w-[360px] rounded-full bg-blue-500/5 blur-3xl"/>
                    </div>

                    <header className="text-center mb-12">
                        <div
                            className="inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-card px-4 py-1.5 text-xs font-medium text-muted-foreground">
                            <FileBadge/>
                            {t('badge')}
                        </div>

                        <h1 className="text-4xl sm:text-5xl font-bold mt-5 gradient-text">{t('title')}</h1>

                        <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
                            {t('description', { role: CV.role })}
                        </p>

                        <p className="text-xs text-muted-foreground mt-4">
                            {t('lastUpdatedLabel')}{' '}
                            <span className="text-foreground/80 font-medium">{lastUpdated}</span>
                        </p>
                    </header>

                    <section className="space-y-6">
                        {sections.map((s) => (
                            <article
                                key={s.id}
                                id={s.id}
                                className="glass-card rounded-2xl border border-blue-500/20 border-l-4 border-l-blue-500/50 p-6 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-all duration-300 scroll-mt-28"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="rounded-xl border border-border bg-muted/60 p-2.5 text-muted-foreground">
                                        {s.icon}
                                    </div>
                                    <h2 className="text-xl font-semibold text-foreground">{s.title}</h2>
                                </div>

                                <div
                                    className="mt-5 text-sm sm:text-base text-muted-foreground leading-relaxed break-words [hyphens:none]">
                                    {s.content}
                                </div>
                            </article>
                        ))}
                    </section>
                </main>
            </div>
        </>
    );
}