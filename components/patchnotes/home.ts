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

import type { PatchnoteMeta } from './types';
import { HOME_ID } from './constants';

export function getHomeMeta(locale: 'fr' | 'en'): PatchnoteMeta {
    if (locale === 'fr') {
        return {
            id: HOME_ID,
            title: 'Accueil',
            displayDate: 'Guide',
            fileDate: '',
            description: ''
        };
    }
    return {
        id: HOME_ID,
        title: 'Welcome',
        displayDate: 'Guide',
        fileDate: '',
        description: ''
    };
}

export function getHomeGuide(locale: 'fr' | 'en') {
    if (locale === 'fr') {
        return {
            badge: 'Guide rapide',
            subtitle: 'Comment lire les patch-notes',
            items: [
                'Choisis un patch-note dans la liste à gauche.',
                'Le point rouge = nouveauté non lue.',
                'Utilise la recherche pour retrouver une fonctionnalité.',
                'Change le tri en haut (récent ↔ ancien).'
            ]
        };
    }
    return {
        badge: 'Quick guide',
        subtitle: 'How to read the patch notes',
        items: [
            'Pick a patch note from the list on the left.',
            'Red dot = unread update.',
            'Use search to quickly find a feature.',
            'Change sorting at the top (newest ↔ oldest).'
        ]
    };
}