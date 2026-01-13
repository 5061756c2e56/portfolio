'use client';

import { useEffect } from 'react';

export default function GlobalError({
    error,
    reset
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }, [error]);

    return (
        <html lang="fr">
        <body>
        <div
            className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-background via-background to-muted/20 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,oklch(0.68_0.15_240/0.1),transparent_50%)] pointer-events-none"/>
            <div className="max-w-2xl mx-auto text-center relative z-10">
                <h1 className="text-9xl font-bold mb-4 bg-gradient-to-r from-foreground via-primary to-accent bg-clip-text text-transparent">
                    500
                </h1>
                <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-foreground">
                    Erreur critique
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                    Une erreur critique s'est produite. Veuillez recharger la page.
                </p>
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border border-border bg-background hover:bg-muted hover:border-primary/30 transition-all duration-300 cursor-pointer group"
                >
                    <span className="text-base font-medium text-foreground">Recharger</span>
                    <svg className="w-5 h-5 text-foreground group-hover:rotate-180 transition-transform duration-300"
                         fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
                    </svg>
                </button>
            </div>
        </div>
        </body>
        </html>
    );
}