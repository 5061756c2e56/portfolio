import { lazy, Suspense } from 'react';
import Navigation from '@/components/Navigation';
import { getMessages, getTranslations } from 'next-intl/server';
import { NextIntlClientProvider } from 'next-intl';

const Quiz = lazy(() => import('@/components/Quiz'));
const GitHubStats = lazy(() => import('@/components/GitHubStats'));
const Footer = lazy(() => import('@/components/Footer'));

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'games' });

    return {
        title: t('meta.title'),
        description: t('meta.description')
    };
}

export default async function GamesPage({ params }: { params: Promise<{ locale: string }> }) {
    const { locale } = await params;
    const messages = await getMessages();
    const t = await getTranslations({ locale, namespace: 'games' });

    return (
        <NextIntlClientProvider messages={messages}>
            <Navigation/>
            <main className="min-h-screen text-foreground transition-colors duration-300">
                <section
                    className="min-h-[60vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-20 lg:pt-0 pb-24 relative">
                    <div className="max-w-5xl mx-auto text-center w-full relative z-10 animate-fade-in-up">
                        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold mb-6 sm:mb-8 leading-[1.1] tracking-tight px-4 gradient-text">
                            {t('hero.title')}
                        </h1>
                        <p className="text-base sm:text-lg md:text-xl text-foreground/75 max-w-2xl mx-auto mb-12 sm:mb-16 leading-relaxed px-4">
                            {t('hero.description')}
                        </p>
                    </div>
                </section>

                <Suspense fallback={null}>
                    <Quiz/>
                </Suspense>
                <Suspense fallback={null}>
                    <GitHubStats/>
                </Suspense>
                <Suspense fallback={null}>
                    <Footer/>
                </Suspense>
            </main>
        </NextIntlClientProvider>
    );
}