import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement>;

export function SVGProjectStructure(props: Props) {
    return (
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <rect x="10" y="14" width="44" height="36" rx="8" stroke="currentColor" opacity="0.35" strokeWidth="2"/>
            <rect x="16" y="20" width="22" height="6" rx="3" fill="currentColor" opacity="0.25"/>
            <rect x="16" y="30" width="32" height="5" rx="2.5" fill="currentColor" opacity="0.18"/>
            <rect x="16" y="38" width="26" height="5" rx="2.5" fill="currentColor" opacity="0.18"/>
        </svg>
    );
}