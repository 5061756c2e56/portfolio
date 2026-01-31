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

import { createContext, useContext, useMemo, useState } from 'react';
import ContactModal from '@/components/home/ContactModal';

type ContactModalContextValue = {
    openContact: (args?: { mailtoMode?: boolean }) => void;
};

const ContactModalContext = createContext<ContactModalContextValue | null>(null);

export function useContactModal() {
    const ctx = useContext(ContactModalContext);
    if (!ctx) {
        throw new Error('useContactModal must be used within ContactModalProvider');
    }
    return ctx;
}

export function ContactModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [mailtoMode, setMailtoMode] = useState(false);

    const value = useMemo(
        () => (
            {
                openContact: (args?: { mailtoMode?: boolean }) => {
                    setMailtoMode(!!args?.mailtoMode);
                    setIsOpen(true);
                }
            }
        ),
        []
    );

    return (
        <ContactModalContext.Provider value={value}>
            {children}
            <ContactModal isOpen={isOpen} onClose={() => setIsOpen(false)} mailtoMode={mailtoMode}/>
        </ContactModalContext.Provider>
    );
}