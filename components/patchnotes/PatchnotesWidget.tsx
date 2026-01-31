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

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize from 'rehype-sanitize';
import Image from 'next/image';
import { Bell, CalendarDays, ChevronDown, Home, Menu, Search, Sparkles, X } from 'lucide-react';
import { cn } from '@/lib/utils';

import type { Lang, Patchnote, PatchnoteMeta, SortOrder } from './types';
import { HOME_ID } from './constants';
import { loadReadSet, saveReadSet } from './storage';
import { useLockBodyScroll } from './hooks/useLockBodyScroll';
import { useClickOutside } from './hooks/useClickOutside';
import { splitPatchnote } from './markdown/splitPatchnote';
import { sanitizeSchema } from './markdown/sanitizeSchema';
import { getHomeGuide, getHomeMeta } from './home';

function FloatingButton({ onClick, unreadCount }: { onClick: () => void; unreadCount: number }) {
    return (
        <button
            onClick={onClick}
            className={cn(
                'fixed bottom-5 right-5 z-50 group',
                'flex items-center justify-center',
                'h-12 w-12 sm:h-14 sm:w-14 rounded-2xl',
                'bg-linear-to-br from-primary to-primary/80',
                'shadow-lg shadow-primary/25',
                'transition-all duration-300 ease-out',
                'hover:scale-105 hover:shadow-xl hover:shadow-primary/30',
                'active:scale-95',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'
            )}
            aria-label="Patchnotes"
        >
            <Bell
                className="h-5 w-5 sm:h-6 sm:w-6 text-primary-foreground transition-transform duration-300 group-hover:rotate-12"/>
            {unreadCount > 0 && (
                <span className={cn(
                    'absolute -top-1 -right-1',
                    'flex items-center justify-center',
                    'min-w-5 h-5 px-1.5 rounded-full',
                    'bg-red-500 text-white text-xs font-bold',
                    'ring-2 ring-background',
                    'animate-in zoom-in duration-200'
                )}>
                    {unreadCount > 9 ? '9+' : unreadCount}
                </span>
            )}
        </button>
    );
}

function SortDropdown({
    sort,
    sortOpen,
    setSortOpen,
    setSort,
    locale,
    sortRef
}: {
    sort: SortOrder;
    sortOpen: boolean;
    setSortOpen: (v: boolean | ( (prev: boolean) => boolean )) => void;
    setSort: (v: SortOrder) => void;
    locale: 'fr' | 'en';
    sortRef: React.RefObject<HTMLDivElement | null>;
}) {
    const sortLabel = sort === 'newest'
        ? (
            locale === 'fr' ? 'Plus récent' : 'Newest first'
        )
        : (
            locale === 'fr' ? 'Plus ancien' : 'Oldest first'
        );

    return (
        <div className="relative" ref={sortRef}>
            <button
                type="button"
                onClick={() => setSortOpen(v => !v)}
                className={cn(
                    'flex items-center justify-between gap-2 w-full',
                    'px-3 py-2.5 rounded-xl',
                    'bg-muted/50 border border-border/50',
                    'text-sm font-medium',
                    'transition-all duration-200',
                    'hover:bg-muted hover:border-border',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                )}
                aria-expanded={sortOpen}
            >
                <span>{sortLabel}</span>
                <ChevronDown className={cn(
                    'h-4 w-4 text-muted-foreground transition-transform duration-200',
                    sortOpen && 'rotate-180'
                )}/>
            </button>

            {sortOpen && (
                <div className={cn(
                    'absolute left-0 right-0 mt-2 z-50',
                    'rounded-xl border border-border/50 bg-popover/95 backdrop-blur-xl',
                    'shadow-xl shadow-black/10',
                    'overflow-hidden',
                    'animate-in fade-in slide-in-from-top-2 duration-200'
                )}>
                    {(
                        ['newest', 'oldest'] as const
                    ).map((value) => (
                        <button
                            key={value}
                            type="button"
                            onClick={() => {
                                setSort(value);
                                setSortOpen(false);
                            }}
                            className={cn(
                                'w-full px-3 py-2.5 text-left text-sm',
                                'flex items-center gap-3',
                                'transition-colors duration-150',
                                'hover:bg-muted/50',
                                sort === value && 'bg-primary/10'
                            )}
                        >
                            <span className={cn(
                                'h-4 w-4 rounded-full border-2 flex items-center justify-center',
                                'transition-colors duration-150',
                                sort === value ? 'border-primary' : 'border-muted-foreground/30'
                            )}>
                                {sort === value && (
                                    <span className="h-2 w-2 rounded-full bg-primary"/>
                                )}
                            </span>
                            <span>{value === 'newest'
                                ? (
                                    locale === 'fr' ? 'Plus récent au plus ancien' : 'Newest to oldest'
                                )
                                : (
                                    locale === 'fr' ? 'Plus ancien au plus récent' : 'Oldest to newest'
                                )
                            }</span>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

function SearchInput({
    value,
    onChange,
    placeholder
}: {
    value: string;
    onChange: (v: string) => void;
    placeholder: string;
}) {
    return (
        <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"/>
            <input
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-xl',
                    'bg-muted/50 border border-border/50',
                    'text-sm placeholder:text-muted-foreground/60',
                    'transition-all duration-200',
                    'hover:bg-muted hover:border-border',
                    'focus:bg-background focus:border-primary/50 focus:ring-2 focus:ring-primary/20',
                    'outline-none'
                )}
            />
        </div>
    );
}

function PatchnoteListItem({
    item,
    isActive,
    isUnread,
    onClick
}: {
    item: PatchnoteMeta;
    isActive: boolean;
    isUnread: boolean;
    onClick: () => void;
}) {
    const isHome = item.id === HOME_ID;

    return (
        <button
            onClick={onClick}
            className={cn(
                'relative w-full text-left',
                'px-4 py-3.5',
                'transition-all duration-200',
                'hover:bg-muted/50',
                'focus-visible:outline-none focus-visible:bg-muted/50',
                isActive && 'bg-primary/5'
            )}
        >
            <div className={cn(
                'absolute left-0 top-0 bottom-0 w-0.5',
                'transition-all duration-200',
                isActive ? 'bg-primary' : 'bg-transparent'
            )}/>

            <div className="flex items-start gap-3">
                {isHome && (
                    <div className={cn(
                        'shrink-0 w-8 h-8 rounded-lg',
                        'bg-linear-to-br from-primary/20 to-primary/5',
                        'flex items-center justify-center'
                    )}>
                        <Home className="h-4 w-4 text-primary"/>
                    </div>
                )}

                <div className="flex-1 min-w-0">
                    <div className={cn(
                        'font-medium text-sm leading-tight',
                        'line-clamp-2',
                        isActive && 'text-primary'
                    )}>
                        {item.title}
                    </div>
                    {(
                         item.displayDate || item.fileDate
                     ) && (
                         <div className="flex items-center gap-1.5 mt-1.5">
                             <CalendarDays className="h-3 w-3 text-muted-foreground/60"/>
                             <span className="text-xs text-muted-foreground">
                                {item.displayDate || item.fileDate}
                            </span>
                         </div>
                     )}
                </div>

                {isUnread && (
                    <span className={cn(
                        'shrink-0 mt-1',
                        'h-2.5 w-2.5 rounded-full',
                        'bg-red-500',
                        'ring-2 ring-background'
                    )}/>
                )}
            </div>
        </button>
    );
}

function HomeContent({
    homeMeta,
    homeGuide
}: {
    homeMeta: PatchnoteMeta;
    homeGuide: { badge: string; subtitle: string; items: string[] };
}) {
    return (
        <div className="h-full flex items-center justify-center p-6">
            <div className="max-w-lg w-full text-center">
                <div className={cn(
                    'inline-flex items-center justify-center',
                    'w-16 h-16 rounded-2xl mb-6',
                    'bg-linear-to-br from-primary/20 to-primary/5',
                    'ring-1 ring-primary/10'
                )}>
                    <Sparkles className="h-8 w-8 text-primary"/>
                </div>

                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {homeMeta.title}
                </h2>

                <div className="mt-4">
                    <span className={cn(
                        'inline-flex items-center gap-2',
                        'px-3 py-1.5 rounded-full',
                        'bg-primary/10 text-primary text-sm font-medium'
                    )}>
                        {homeGuide.badge}
                    </span>
                </div>

                <p className="mt-4 text-muted-foreground leading-relaxed">
                    {homeGuide.subtitle}
                </p>

                <div className="mt-8 space-y-3">
                    {homeGuide.items.map((item, idx) => (
                        <div
                            key={idx}
                            className={cn(
                                'flex items-start gap-3 text-left',
                                'p-3 rounded-xl',
                                'bg-muted/30 border border-border/50'
                            )}
                        >
                            <span className={cn(
                                'shrink-0 w-6 h-6 rounded-lg',
                                'bg-primary/10 text-primary',
                                'flex items-center justify-center',
                                'text-xs font-bold'
                            )}>
                                {idx + 1}
                            </span>
                            <p className="text-sm text-foreground/80 leading-relaxed">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

function PatchnoteContent({
    title,
    description,
    date,
    body
}: {
    title: string;
    description: string;
    date: string;
    body: string;
}) {
    return (
        <div className="p-6">
            <header className="pb-6 border-b border-border/50">
                <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
                    {title}
                </h2>
                {description && (
                    <p className="mt-2 text-muted-foreground leading-relaxed">
                        {description}
                    </p>
                )}
                {date && (
                    <div className="flex items-center gap-2 mt-4">
                        <CalendarDays className="h-4 w-4 text-muted-foreground/60"/>
                        <span className="text-sm text-muted-foreground">{date}</span>
                    </div>
                )}
            </header>

            <div className={cn(
                'mt-6',
                'prose prose-neutral dark:prose-invert max-w-none',
                'prose-headings:font-semibold prose-headings:tracking-tight',
                'prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-4',
                'prose-h3:text-lg prose-h3:mt-6 prose-h3:mb-3',
                'prose-p:leading-7 prose-p:text-foreground/80',
                'prose-li:leading-7 prose-li:text-foreground/80',
                'prose-a:text-primary prose-a:font-medium prose-a:no-underline hover:prose-a:underline',
                'prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:text-sm',
                'prose-pre:bg-muted prose-pre:border prose-pre:border-border/50 prose-pre:rounded-xl',
                'prose-blockquote:border-l-primary prose-blockquote:bg-muted/30 prose-blockquote:rounded-r-xl prose-blockquote:py-1',
                'prose-img:rounded-xl prose-img:border prose-img:border-border/50'
            )}>
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
                    skipHtml
                    components={{
                        code: ({ node, children, className, ...props }) => {
                            const raw =
                                node?.type === 'element' &&
                                Array.isArray(node.children)
                                    ? node.children
                                          .filter((c): c is { type: 'text'; value: string } => c.type === 'text')
                                          .map(c => c.value)
                                          .join('')
                                    : null;
                            let value =
                                raw ??
                                (
                                    typeof children === 'string'
                                        ? children
                                        : Array.isArray(children)
                                            ? children.map(c => (
                                                typeof c === 'string' ? c : ''
                                            )).join('')
                                            : String(children ?? '')
                                );
                            value = value.replace(/&#123;/g, '{').replace(/&#125;/g, '}');
                            return (
                                <code className={className} {...props}>
                                    {value}
                                </code>
                            );
                        },
                        a: (props) => <a {...props} target="_blank" rel="noreferrer noopener"/>,
                        img: ({ src, alt }) => {
                            const s = (
                                src ?? ''
                            ).toString();
                            if (!s) return null;

                            const isHttp = /^https?:\/\//i.test(s);
                            const isLocal = s.startsWith('/');

                            if (!isHttp && !isLocal) {
                                return (
                                    <img
                                        src={s}
                                        alt={alt ?? ''}
                                        loading="lazy"
                                        decoding="async"
                                        className="rounded-xl border border-border/50 max-w-full"
                                    />
                                );
                            }

                            return (
                                <span
                                    className="block relative w-full overflow-hidden rounded-xl border border-border/50 shadow-sm">
                                    <Image
                                        src={s}
                                        alt={alt ?? ''}
                                        width={1600}
                                        height={900}
                                        sizes="(max-width: 768px) 92vw, 760px"
                                        className="h-auto w-full"
                                        priority={false}
                                    />
                                </span>
                            );
                        }
                    }}
                >
                    {body}
                </ReactMarkdown>
            </div>
        </div>
    );
}

export default function PatchnotesWidget({ locale }: { locale: 'fr' | 'en' }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [open, setOpen] = useState(false);
    const [sort, setSort] = useState<SortOrder>('newest');
    const [sortOpen, setSortOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

    const homeMeta = useMemo(() => getHomeMeta(locale), [locale]);
    const homeGuide = useMemo(() => getHomeGuide(locale), [locale]);

    const [list, setList] = useState<PatchnoteMeta[]>(() => [getHomeMeta(locale)]);
    const [activeId, setActiveId] = useState<string | null>(HOME_ID);
    const [active, setActive] = useState<Patchnote | null>(null);
    const [readSet, setReadSet] = useState<Set<string>>(new Set());

    const lang: Lang = locale === 'fr' ? 'FR' : 'EN';

    const sortRef = useRef<HTMLDivElement | null>(null);
    useClickOutside(sortRef, () => setSortOpen(false), sortOpen);

    const modalRef = useRef<HTMLDivElement | null>(null);
    const prevSearchParamsRef = useRef(searchParams.toString());

    useLockBodyScroll(open);

    const syncURLWithState = useCallback((isOpen: boolean) => {
        const params = new URLSearchParams(searchParams.toString());
        const hasChangelog = params.has('changelog');

        if (isOpen === hasChangelog) return;

        params.delete('changelog');
        const otherParams = params.toString();

        let newURL: string;
        if (isOpen) {
            newURL = otherParams
                ? `${pathname}?${otherParams}&changelog`
                : `${pathname}?changelog`;
        } else {
            newURL = otherParams ? `${pathname}?${otherParams}` : pathname;
        }

        router.replace(newURL, { scroll: false });
    }, [pathname, router, searchParams]);

    useEffect(() => {
        const currentParams = searchParams.toString();
        const hasChangelog = searchParams.has('changelog');

        if (currentParams !== prevSearchParamsRef.current) {
            prevSearchParamsRef.current = currentParams;

            if (hasChangelog && !open) {
                setOpen(true);
                setQuery('');
                setActiveId(HOME_ID);
            }
        }
    }, [searchParams, open]);

    useEffect(() => {
        setReadSet(loadReadSet());
    }, []);

    useEffect(() => {
        setList(prev => [homeMeta, ...prev.filter(p => p.id !== HOME_ID)]);
    }, [homeMeta]);

    useEffect(() => {
        if (!open) return;
        setMobileSidebarOpen(false);
        setSortOpen(false);
        setQuery('');
        setActiveId(HOME_ID);
    }, [open]);

    useEffect(() => {
        (
            async () => {
                const res = await fetch(`/api/patchnotes?lang=${lang}&sort=${sort}`, { cache: 'no-store' });
                const data = (
                    await res.json()
                ) as PatchnoteMeta[];
                setList([homeMeta, ...data]);
                setActiveId(prev => prev ?? HOME_ID);
            }
        )();
    }, [lang, sort, homeMeta]);

    useEffect(() => {
        if (!activeId) return;
        if (activeId === HOME_ID) {
            setActive(null);
            return;
        }
        (
            async () => {
                const res = await fetch(`/api/patchnotes?id=${encodeURIComponent(activeId)}`, { cache: 'no-store' });
                const data = (
                    await res.json()
                ) as Patchnote;
                setActive(data);
            }
        )();
    }, [activeId]);

    useEffect(() => {
        if (!open || !activeId || activeId === HOME_ID) return;

        setReadSet(prev => {
            if (prev.has(activeId)) return prev;
            const next = new Set(prev);
            next.add(activeId);
            saveReadSet(next);
            return next;
        });
    }, [open, activeId]);

    const unreadCount = useMemo(
        () => list.filter(p => p.id !== HOME_ID && !readSet.has(p.id)).length,
        [list, readSet]
    );

    const filteredList = useMemo(() => {
        const q = query.trim().toLowerCase();
        const home = list.find(p => p.id === HOME_ID);
        const rest = list.filter(p => p.id !== HOME_ID);

        if (!q) return home ? [home, ...rest] : rest;

        const matches = rest.filter(p => p.title.toLowerCase().includes(q));
        return home ? [home, ...matches] : matches;
    }, [list, query]);

    useEffect(() => {
        if (!activeId || activeId === HOME_ID) return;
        if (filteredList.some(p => p.id === activeId)) return;
        setActiveId(filteredList[0]?.id ?? HOME_ID);
    }, [filteredList, activeId]);

    const activeParsed = useMemo(() => {
        if (!active?.content) return { title: '', description: '', displayDate: '', body: '' };
        return splitPatchnote(active.content);
    }, [active?.content]);

    const headerTitle = activeParsed.title || active?.title || '';
    const headerDescription = activeParsed.description || active?.description || '';
    const headerDate = activeParsed.displayDate || active?.displayDate || active?.fileDate || '';

    const close = useCallback(() => {
        setOpen(false);
        setSortOpen(false);
        setMobileSidebarOpen(false);
        syncURLWithState(false);
    }, [syncURLWithState]);

    useEffect(() => {
        if (!open) return;

        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') close();
        };

        const onDown = (e: MouseEvent | TouchEvent) => {
            const el = modalRef.current;
            if (!el) return;
            if (e.target instanceof Node && !el.contains(e.target)) close();
        };

        document.addEventListener('keydown', onKey);
        document.addEventListener('mousedown', onDown, { passive: true });
        document.addEventListener('touchstart', onDown, { passive: true });

        return () => {
            document.removeEventListener('keydown', onKey);
            document.removeEventListener('mousedown', onDown);
            document.removeEventListener('touchstart', onDown);
        };
    }, [open, close]);

    const onSelect = (id: string) => {
        setActiveId(id);
        setSortOpen(false);
        setMobileSidebarOpen(false);
    };

    const searchPlaceholder = locale === 'fr' ? 'Rechercher...' : 'Search...';
    const noResultsText = locale === 'fr' ? 'Aucun résultat' : 'No results';
    const closeLabel = locale === 'fr' ? 'Fermer' : 'Close';
    const menuLabel = locale === 'fr' ? 'Menu' : 'Menu';

    return (
        <>
            <FloatingButton
                onClick={() => {
                    setOpen(true);
                    setQuery('');
                    setActiveId(HOME_ID);
                    syncURLWithState(true);
                }}
                unreadCount={unreadCount}
            />

            {open && (
                <div className="fixed inset-0 z-50">
                    <div className={cn(
                        'absolute inset-0',
                        'bg-black/60 backdrop-blur-sm',
                        'animate-in fade-in duration-200'
                    )}/>

                    <div
                        ref={modalRef}
                        role="dialog"
                        aria-modal="true"
                        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
                        className={cn(
                            'absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2',
                            'w-[min(640px,95vw)] h-[min(720px,85vh)]',
                            'md:w-[min(1000px,90vw)] md:h-[min(700px,85vh)]',
                            'rounded-2xl overflow-hidden',
                            'bg-background/95 backdrop-blur-xl',
                            'border border-border/50',
                            'shadow-2xl shadow-black/20',
                            'flex flex-col md:flex-row',
                            'animate-in fade-in zoom-in-95 duration-300'
                        )}
                    >
                        <header className={cn(
                            'md:hidden',
                            'flex items-center justify-between',
                            'px-4 py-3',
                            'bg-muted/30 border-b border-border/50'
                        )}>
                            <button
                                type="button"
                                onClick={() => setMobileSidebarOpen(v => !v)}
                                aria-label={menuLabel}
                                className={cn(
                                    'p-2.5 rounded-xl',
                                    'bg-background border border-border/50',
                                    'transition-colors duration-200',
                                    'hover:bg-muted',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                )}
                            >
                                {mobileSidebarOpen ? <X className="h-5 w-5"/> : <Menu className="h-5 w-5"/>}
                            </button>

                            <button
                                type="button"
                                onClick={close}
                                aria-label={closeLabel}
                                className={cn(
                                    'p-2.5 rounded-xl',
                                    'bg-background border border-border/50',
                                    'transition-colors duration-200',
                                    'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30',
                                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                                )}
                            >
                                <X className="h-5 w-5"/>
                            </button>
                        </header>

                        <button
                            type="button"
                            onClick={close}
                            aria-label={closeLabel}
                            className={cn(
                                'hidden md:flex',
                                'absolute top-4 right-4 z-30',
                                'p-2.5 rounded-xl',
                                'bg-background/80 backdrop-blur border border-border/50',
                                'transition-colors duration-200',
                                'hover:bg-destructive/10 hover:text-destructive hover:border-destructive/30',
                                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring'
                            )}
                        >
                            <X className="h-5 w-5"/>
                        </button>

                        {mobileSidebarOpen && (
                            <div className="md:hidden absolute inset-0 z-20">
                                <div
                                    className="absolute inset-0 bg-black/40 animate-in fade-in duration-200"
                                    onClick={() => setMobileSidebarOpen(false)}
                                />

                                <aside className={cn(
                                    'absolute left-0 top-0 h-full',
                                    'w-[85vw] max-w-[320px]',
                                    'bg-background border-r border-border/50',
                                    'flex flex-col',
                                    'animate-in slide-in-from-left duration-300'
                                )}>
                                    <div className="p-4 space-y-3 border-b border-border/50">
                                        <SortDropdown
                                            sort={sort}
                                            sortOpen={sortOpen}
                                            setSortOpen={setSortOpen}
                                            setSort={setSort}
                                            locale={locale}
                                            sortRef={sortRef}
                                        />
                                        <SearchInput
                                            value={query}
                                            onChange={setQuery}
                                            placeholder={searchPlaceholder}
                                        />
                                    </div>

                                    <div className="flex-1 overflow-auto">
                                        {filteredList.map(p => (
                                            <PatchnoteListItem
                                                key={p.id}
                                                item={p}
                                                isActive={p.id === activeId}
                                                isUnread={p.id !== HOME_ID && !readSet.has(p.id)}
                                                onClick={() => onSelect(p.id)}
                                            />
                                        ))}

                                        {filteredList.length === 0 && (
                                            <div className="p-6 text-center text-sm text-muted-foreground">
                                                {noResultsText}
                                            </div>
                                        )}
                                    </div>
                                </aside>
                            </div>
                        )}

                        <aside className={cn(
                            'hidden md:flex md:flex-col',
                            'w-[320px] min-w-70',
                            'border-r border-border/50',
                            'bg-muted/20'
                        )}>
                            <div className="p-4 space-y-3 border-b border-border/50">
                                <SortDropdown
                                    sort={sort}
                                    sortOpen={sortOpen}
                                    setSortOpen={setSortOpen}
                                    setSort={setSort}
                                    locale={locale}
                                    sortRef={sortRef}
                                />
                                <SearchInput
                                    value={query}
                                    onChange={setQuery}
                                    placeholder={searchPlaceholder}
                                />
                            </div>

                            <div className="flex-1 overflow-auto">
                                {filteredList.map(p => (
                                    <PatchnoteListItem
                                        key={p.id}
                                        item={p}
                                        isActive={p.id === activeId}
                                        isUnread={p.id !== HOME_ID && !readSet.has(p.id)}
                                        onClick={() => onSelect(p.id)}
                                    />
                                ))}

                                {filteredList.length === 0 && (
                                    <div className="p-6 text-center text-sm text-muted-foreground">
                                        {noResultsText}
                                    </div>
                                )}
                            </div>
                        </aside>

                        <main className="flex-1 min-h-0 overflow-auto">
                            {activeId === HOME_ID ? (
                                <HomeContent homeMeta={homeMeta} homeGuide={homeGuide}/>
                            ) : (
                                <PatchnoteContent
                                    title={headerTitle}
                                    description={headerDescription}
                                    date={headerDate}
                                    body={activeParsed.body.replace(/\{/g, '&#123;').replace(/\}/g, '&#125;')}
                                />
                            )}
                        </main>
                    </div>
                </div>
            )}
        </>
    );
}
