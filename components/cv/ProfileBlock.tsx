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

import { useCallback, useState } from 'react';
import { Download, Globe, Mail } from 'lucide-react';
import { useContactModal } from '@/hooks/useContactModal';
import { SiGithub, SiLinkedin } from 'react-icons/si';

export function CvDownloadButton({
    label,
    loadingLabel,
    href,
    filename
}: {
    label: string;
    loadingLabel: string;
    href: string;
    filename: string;
}) {
    const [isDownloading, setIsDownloading] = useState(false);

    const handleDownload = useCallback(() => {
        if (isDownloading) return;

        setIsDownloading(true);

        const reset = () => setIsDownloading(false);

        document.addEventListener(
            'visibilitychange',
            () => {
                if (document.visibilityState === 'visible') reset();
            },
            { passive: true }
        );
        window.addEventListener('focus', reset, { once: true });
        window.addEventListener('pagehide', reset, { once: true });

        const link = document.createElement('a');
        link.href = href;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        const t = window.setTimeout(reset, 2500);
        window.setTimeout(() => window.clearTimeout(t), 3000);
    }, [isDownloading, href, filename]);

    return (
        <button
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            aria-busy={isDownloading}
            className={`btn-fill-primary group inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                isDownloading ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
            }`}
        >
            {isDownloading ? (
                <svg className="h-4 w-4 animate-spin shrink-0" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                </svg>
            ) : (
                <Download className="h-4 w-4 shrink-0"/>
            )}
            <span>{isDownloading ? loadingLabel : label}</span>
        </button>
    );
}

type CvProfileBlockProps = {
    name: string;
    role: string;
    email: string;
    website: string;

    githubUrl: string | undefined;
    githubLabel: string;
    github: string;

    linkedinUrl: string | undefined;
    linkedinLabel: string;
    linkedin: string;
};

export default function ProfileBlock({
    name,
    role,
    email,
    website,

    githubUrl,
    githubLabel,
    github,

    linkedinUrl,
    linkedinLabel,
    linkedin
}: CvProfileBlockProps) {
    const { openContact } = useContactModal();

    const handleEmailClick = useCallback(() => {
        void openContact();
    }, [openContact]);

    const initials = name
        .split(' ')
        .map((p) => p[0])
        .slice(0, 2)
        .join('')
        .toUpperCase();

    return (
        <div
            className="glass-card rounded-2xl p-6 border border-blue-500/20 hover:border-blue-500/30 hover:shadow-[0_0_25px_rgba(59,130,246,0.08)] transition-all duration-300">
            <div className="flex items-center gap-4">
                <div
                    className="h-14 w-14 rounded-2xl bg-muted/80 border border-border grid place-items-center text-foreground font-bold text-lg">
                    {initials}
                </div>
                <div>
                    <p className="text-base font-semibold text-foreground">{name}</p>
                    <p className="text-sm text-muted-foreground">{role}</p>
                </div>
            </div>

            <div className="mt-5 space-y-3 text-sm">
                <button
                    type="button"
                    onClick={handleEmailClick}
                    className="flex w-full items-center gap-3 rounded-xl p-2.5 text-left text-muted-foreground hover:text-foreground hover:bg-muted/50 border border-transparent hover:border-blue-500/20 transition-all duration-300 cursor-pointer"
                >
                    <span className="rounded-lg bg-muted/60 p-2 text-muted-foreground">
                        <Mail className="h-4 w-4"/>
                    </span>
                    {email}
                </button>

                <a
                    href={`https://${website}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-3 rounded-xl p-2.5 text-muted-foreground hover:text-blue-500 hover:bg-muted/50 border border-transparent hover:border-blue-500/20 transition-all duration-300"
                >
                    <span className="rounded-lg bg-muted/60 p-2 text-muted-foreground">
                        <Globe className="h-4 w-4"/>
                    </span>
                    {website}
                </a>

                {githubUrl ? (
                    <a
                        href={githubUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl p-2.5 text-muted-foreground hover:text-blue-500 hover:bg-muted/50 border border-transparent hover:border-blue-500/20 transition-all duration-300"
                    >
                        <span className="rounded-lg bg-muted/60 p-2 text-muted-foreground">
                            <SiGithub className="h-4 w-4"/>
                        </span>
                        {githubLabel}
                    </a>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl p-2.5 text-muted-foreground">
                        <span className="rounded-lg bg-muted/60 p-2">
                            <SiGithub className="h-4 w-4"/>
                        </span>
                        {github}
                    </div>
                )}

                {linkedinUrl ? (
                    <a
                        href={linkedinUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-3 rounded-xl p-2.5 text-muted-foreground hover:text-blue-500 hover:bg-muted/50 border border-transparent hover:border-blue-500/20 transition-all duration-300"
                    >
                        <span className="rounded-lg bg-muted/60 p-2 text-muted-foreground">
                            <SiLinkedin className="h-4 w-4"/>
                        </span>
                        {linkedinLabel}
                    </a>
                ) : (
                    <div className="flex items-center gap-3 rounded-xl p-2.5 text-muted-foreground">
                        <span className="rounded-lg bg-muted/60 p-2">
                            <SiLinkedin className="h-4 w-4"/>
                        </span>
                        {linkedin}
                    </div>
                )}
            </div>
        </div>
    );
}