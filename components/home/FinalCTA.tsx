import { Link } from '@/i18n/routing';
import { FileText, Gamepad2 } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FinalCTA() {
    const t = useTranslations('finalCTA');

    return (
        <section id="extras" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 pb-24 pt-32">
            <div className="max-w-4xl mx-auto text-center">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-2">
                        <h3 className="text-2xl sm:text-3xl font-semibold tracking-tight">
                            {t('title')}
                        </h3>
                        <div className="mx-auto mt-5 mb-5 h-px w-24 bg-foreground/20"/>
                        <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                            {t('description')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            href="/faq"
                            className="btn-fill-primary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <FileText
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:-translate-y-0.5 md:group-hover:rotate-3"/>
                            <span>{t('faqButton')}</span>
                        </Link>

                        <Link
                            href="/games"
                            className="btn-fill-secondary group inline-flex items-center justify-center gap-3 px-8 py-4 text-base font-medium rounded-lg transition-all duration-300"
                        >
                            <Gamepad2
                                className="h-5 w-5 transition-transform duration-300 md:group-hover:scale-110 md:group-hover:-translate-y-0.5 md:group-hover:rotate-6"/>
                            <span>{t('gamesButton')}</span>
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}