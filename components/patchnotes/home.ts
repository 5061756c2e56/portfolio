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

const homeMetaByLocale: Record<string, PatchnoteMeta> = {
    fr: { id: HOME_ID, title: 'Accueil', displayDate: 'Guide', fileDate: '', description: '' },
    en: { id: HOME_ID, title: 'Welcome', displayDate: 'Guide', fileDate: '', description: '' },
    es: { id: HOME_ID, title: 'Inicio', displayDate: 'Guía', fileDate: '', description: '' }
};

const homeGuideByLocale: Record<string, { badge: string; subtitle: string; items: string[] }> = {
    fr: {
        badge: 'Guide rapide',
        subtitle: 'Comment lire les patch-notes',
        items: [
            'Choisis un patch-note dans la liste à gauche.',
            'Le point rouge = nouveauté non lue.',
            'Utilise la recherche pour retrouver une fonctionnalité.',
            'Change le tri en haut (récent ↔ ancien).'
        ]
    },
    en: {
        badge: 'Quick guide',
        subtitle: 'How to read the patch notes',
        items: [
            'Pick a patch note from the list on the left.',
            'Red dot = unread update.',
            'Use search to quickly find a feature.',
            'Change sorting at the top (newest ↔ oldest).'
        ]
    },
    es: {
        badge: 'Guía rápida',
        subtitle: 'Cómo leer las notas de parche',
        items: [
            'Elige una nota de parche en la lista de la izquierda.',
            'El punto rojo = novedad no leída.',
            'Usa la búsqueda para encontrar una funcionalidad.',
            'Cambia el orden arriba (reciente ↔ antiguo).'
        ]
    }
};

export function getHomeMeta(locale: string): PatchnoteMeta {
    return homeMetaByLocale[locale] ?? homeMetaByLocale['en']!;
}

export function getHomeGuide(locale: string) {
    return homeGuideByLocale[locale] ?? homeGuideByLocale['en']!;
}