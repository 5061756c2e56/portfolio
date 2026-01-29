import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

export function SVGLayout(props: Props) {
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="10" y="14" width="44" height="36" rx="8" stroke="currentColor" opacity="0.35" strokeWidth="2"/>
            <rect x="14" y="18" width="36" height="7" rx="3.5" fill="currentColor" opacity="0.18"/>
            <rect x="16" y="20" width="18" height="3" rx="1.5" fill="currentColor" opacity="0.55"/>
            <rect x="16" y="26" width="26" height="4" rx="2" fill="currentColor" opacity="0.28"/>
            <rect x="16" y="33" width="14" height="5" rx="2.5" fill="currentColor" opacity="0.22"/>
            <rect x="16" y="40" width="18" height="4" rx="2" fill="currentColor" opacity="0.18"/>
            <rect x="34" y="33" width="16" height="5" rx="2.5" fill="currentColor" opacity="0.22"/>
            <rect x="34" y="40" width="12" height="4" rx="2" fill="currentColor" opacity="0.18"/>
            <rect x="44" y="26" width="6" height="4" rx="2" fill="#FEC34E"/>
        </svg>
    );
}