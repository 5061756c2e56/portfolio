import { LS_READ_KEY } from './constants';

export function loadReadSet(): Set<string> {
    try {
        const raw = localStorage.getItem(LS_READ_KEY);
        const arr = raw ? (
            JSON.parse(raw) as string[]
        ) : [];
        return new Set(arr);
    } catch {
        return new Set();
    }
}

export function saveReadSet(set: Set<string>) {
    localStorage.setItem(LS_READ_KEY, JSON.stringify(Array.from(set)));
}