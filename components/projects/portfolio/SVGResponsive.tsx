import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

export function SVGResponsive(props: Props) {
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="12" y="10" width="28" height="44" rx="8" stroke="currentColor" opacity="0.35" strokeWidth="2"/>
            <rect x="44" y="18" width="12" height="28" rx="6" stroke="currentColor" opacity="0.35" strokeWidth="2"/>
            <rect x="16" y="18" width="18" height="6" rx="3" fill="currentColor" opacity="0.2"/>
            <rect x="16" y="28" width="20" height="5" rx="2.5" fill="currentColor" opacity="0.16"/>
            <rect x="16" y="36" width="14" height="10" rx="5" fill="currentColor" opacity="0.2"/>
        </svg>
    );
}