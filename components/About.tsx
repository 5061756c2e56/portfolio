'use client';

import {
    useEffect,
    useMemo,
    useRef,
    useState
} from 'react';
import { useTranslations } from 'next-intl';
import { useInView } from '@/hooks/use-in-view';
import { cn } from '@/lib/utils';

interface CodeBlockProps {
    code: string;
    lang?: string;
    writing?: boolean;
    duration?: number;
    delay?: number;
    onDone?: () => void;
    inView?: boolean;
}

function CodeBlock({
    code,
    lang = 'typescript',
    writing = true,
    duration = 5000,
    delay = 0,
    onDone,
    inView
}: CodeBlockProps) {
    const [displayedCode, setDisplayedCode] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const hasAnimatedRef = useRef(false);

    useEffect(() => {
        if (!inView) {
            setDisplayedCode('');
            hasAnimatedRef.current = false;
            return;
        }

        if (!writing) {
            setDisplayedCode(code);
            if (onDone) onDone();
            return;
        }

        if (hasAnimatedRef.current) {
            return;
        }

        setDisplayedCode('');
        hasAnimatedRef.current = true;

        let timeoutId: NodeJS.Timeout;
        let rafId: number | null = null;
        let cancelled = false;

        const startAnimation = () => {
            const startTime = Date.now();
            startTimeRef.current = startTime;

            const animate = () => {
                if (cancelled || !startTimeRef.current) return;

                const elapsed = Date.now() - startTimeRef.current;
                const progress = Math.min(elapsed / duration, 1);
                const charsToShow = Math.floor(progress * code.length);

                setDisplayedCode(code.slice(0, charsToShow));

                if (progress < 1) {
                    rafId = requestAnimationFrame(animate);
                } else {
                    setDisplayedCode(code);
                    setShowCursor(false);
                    if (onDone) onDone();
                }
            };

            rafId = requestAnimationFrame(animate);
        };

        timeoutId = setTimeout(startAnimation, delay);

        return () => {
            cancelled = true;
            clearTimeout(timeoutId);
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
            }
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [code, writing, duration, delay, onDone, inView]);

    useEffect(() => {
        const interval = setInterval(() => {
            setShowCursor(prev => !prev);
        }, 530);

        return () => clearInterval(interval);
    }, []);

    const highlightedCode = useMemo(() => {
        if (!displayedCode) return null;

        const lines = displayedCode.split('\n');
        return lines.map((line, lineIndex) => {
            const parts: React.ReactElement[] = [];
            let lastIndex = 0;

            const matches: Array<{
                index: number;
                length: number;
                type: 'keyword' | 'string' | 'key';
                text: string;
                colonIndex?: number
            }> = [];

            const keywordPattern = /\b(const|export|default)\b/g;
            let match;
            while ((match = keywordPattern.exec(line)) !== null) {
                matches.push({
                    index: match.index,
                    length: match[0].length,
                    type: 'keyword',
                    text: match[0]
                });
            }

            const stringPattern = /(`[^`]*`|"[^"]*")/g;
            while ((match = stringPattern.exec(line)) !== null) {
                matches.push({
                    index: match.index,
                    length: match[0].length,
                    type: 'string',
                    text: match[0]
                });
            }

            const keyPattern = /\b([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:/g;
            while ((match = keyPattern.exec(line)) !== null) {
                matches.push({
                    index: match.index,
                    length: match[0].length,
                    type: 'key',
                    text: match[1],
                    colonIndex: match.index + match[1].length
                });
            }

            matches.sort((a, b) => a.index - b.index);

            matches.forEach((m) => {
                if (m.index > lastIndex) {
                    parts.push(<span key={`text-${lastIndex}`}>{line.substring(lastIndex, m.index)}</span>);
                }

                if (m.type === 'keyword') {
                    parts.push(<span key={`kw-${m.index}`}
                                     className="text-blue-500 dark:text-blue-400">{m.text}</span>);
                    lastIndex = m.index + m.length;
                } else if (m.type === 'string') {
                    parts.push(<span key={`str-${m.index}`}
                                     className="text-green-500 dark:text-green-400">{m.text}</span>);
                    lastIndex = m.index + m.length;
                } else if (m.type === 'key') {
                    parts.push(<span key={`key-${m.index}`}
                                     className="text-purple-500 dark:text-purple-400">{m.text}</span>);
                    const colonPos = m.colonIndex;
                    if (colonPos !== undefined && colonPos < line.length && line[colonPos] === ':') {
                        parts.push(<span key={`colon-${m.index}`}>:</span>);
                        lastIndex = colonPos + 1;
                    } else {
                        lastIndex = m.index + m.length;
                    }
                }
            });

            if (lastIndex < line.length) {
                parts.push(<span key={`end-${lastIndex}`}>{line.substring(lastIndex)}</span>);
            }

            return (
                <div key={lineIndex} className="flex min-w-0 items-baseline">
                    <span
                        className="text-muted-foreground/50 mr-2 sm:mr-3 md:mr-4 select-none text-right w-5 sm:w-6 md:w-8 flex-shrink-0 text-[10px] sm:text-xs md:text-sm leading-snug">{lineIndex
                                                                                                                                                                                         + 1}</span>
                    <span
                        className="flex-1 min-w-0 break-words text-[10px] sm:text-xs md:text-sm lg:text-base leading-snug hyphens-auto">{parts.length
                                                                                                                                         > 0 ? parts : line}</span>
                </div>
            );
        });
    }, [displayedCode]);

    const isWriting = writing && displayedCode.length > 0 && displayedCode.length < code.length && inView;

    return (
        <div className="relative">
            <pre className="p-2.5 sm:p-4 md:p-6 bg-muted/30 rounded-b-lg border-t border-border/50 overflow-x-hidden">
                <code
                    className="text-[10px] sm:text-xs md:text-sm lg:text-base font-mono text-foreground/90 leading-relaxed whitespace-pre break-words">
                    {highlightedCode}
                    {isWriting && showCursor && (
                        <div className="flex">
                            <span
                                className="text-muted-foreground/50 mr-2 sm:mr-3 md:mr-4 w-5 sm:w-6 md:w-8 flex-shrink-0"></span>
                            <span
                                className="inline-block w-1 sm:w-1.5 md:w-2 h-2.5 sm:h-3 md:h-4 bg-foreground ml-0.5 animate-pulse"/>
                        </div>
                    )}
                </code>
            </pre>
        </div>
    );
}

function CodeHeader({
    fileName,
    icon
}: { fileName: string; icon?: React.ReactNode }) {
    return (
        <div
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 md:px-6 py-2 sm:py-3 bg-muted/50 border border-border/50 rounded-t-lg border-b-0">
            <div className="flex items-center gap-1.5 sm:gap-2 flex-1 min-w-0">
                {icon && <div className="flex-shrink-0 w-3 h-3 sm:w-4 sm:h-4">{icon}</div>}
                <span
                    className="text-[10px] sm:text-xs md:text-sm font-medium text-muted-foreground truncate">{fileName}</span>
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 flex-shrink-0">
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500/80"/>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500/80"/>
                <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-green-500/80"/>
            </div>
        </div>
    );
}

export default function About() {
    const t = useTranslations('about');
    const {
        ref,
        isInView
    } = useInView({ threshold: 0.2 });
    const [codeDone, setCodeDone] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 640);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const formatDescriptionLines = (text: string) => {
        const words = text.split(' ');
        const lines: string[] = [];
        let currentLine = '';
        const indent = '    ';
        const baseIndent = '  ';
        const maxLength = isMobile ? 28 : 50;

        words.forEach((word) => {
            const testLine = currentLine ? `${currentLine} ${word}` : word;
            if (testLine.length <= maxLength) {
                currentLine = testLine;
            } else {
                if (currentLine) {
                    lines.push(currentLine);
                }
                currentLine = word;
            }
        });
        if (currentLine) {
            lines.push(currentLine);
        }

        return lines.map((line, idx) => {
            if (idx === 0) {
                return line;
            }
            return `${baseIndent}${indent}${line}`;
        });
    };

    const descriptionLines = formatDescriptionLines(t('content'));
    const descriptionLinesEn = formatDescriptionLines(t('content'));

    const codeContent = `const about = {
  name: "Paul Viandier",
  role: "Intégrateur Web",
  status: "En formation",
  goal: "Développeur Fullstack",
  description: \`${descriptionLines.join('\n')}\`
};

export default about;`;

    const codeContentEn = `const about = {
  name: "Paul Viandier",
  role: "Web Integrator",
  status: "In training",
  goal: "Fullstack Developer",
  description: \`${descriptionLinesEn.join('\n')}\`
};

export default about;`;

    const currentCode = t('title') === 'About' ? codeContentEn : codeContent;

    return (
        <section ref={ref as React.RefObject<HTMLElement>} id="about"
                 className="py-20 sm:py-24 md:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-background via-background to-muted/10 relative overflow-hidden">
            <div
                className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(120,119,198,0.08),transparent_50%)] pointer-events-none"/>
            <div className="max-w-5xl lg:max-w-6xl mx-auto relative z-10">
                <h2 className={cn(
                    'text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-10 sm:mb-12 md:mb-16 text-foreground tracking-tight transition-all duration-700',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    <span
                        className="bg-gradient-to-r from-foreground via-foreground to-foreground/80 bg-clip-text text-transparent">
                        {t('title')}
                    </span>
                </h2>

                <div className={cn(
                    'transition-all duration-700 delay-150',
                    isInView ? 'animate-fade-in-up opacity-100' : 'opacity-0'
                )}>
                    <div
                        className="rounded-lg border border-border/50 bg-card/50 backdrop-blur-sm shadow-xl overflow-hidden">
                        <CodeHeader
                            fileName="about.ts"
                            icon={
                                <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor"
                                     viewBox="0 0 24 24" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                                </svg>
                            }
                        />
                        <CodeBlock
                            code={currentCode}
                            lang="typescript"
                            writing={true}
                            duration={6000}
                            delay={500}
                            inView={isInView}
                            onDone={() => setCodeDone(true)}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}