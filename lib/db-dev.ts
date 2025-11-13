import {
    readFile,
    writeFile
} from 'fs/promises';

import { join } from 'path';

const COUNTER_FILE = join(process.cwd(), 'data', 'email-counter.json');

interface CounterData {
    count: number;
    month: string;
}

async function ensureDataDir(): Promise<void> {
    const fs = await import('fs/promises');
    const dataDir = join(process.cwd(), 'data');
    try {
        await fs.access(dataDir);
    } catch {
        await fs.mkdir(dataDir, { recursive: true });
    }
}

async function readCounter(): Promise<CounterData> {
    try {
        await ensureDataDir();
        const data = await readFile(COUNTER_FILE, 'utf-8');
        return JSON.parse(data);
    } catch {
        return {
            count: 0,
            month: getCurrentMonthParis()
        };
    }
}

async function writeCounter(data: CounterData): Promise<void> {
    await ensureDataDir();
    await writeFile(COUNTER_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function getCurrentMonthParis(): string {
    const now = new Date();
    const parisTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    return `${parisTime.getFullYear()}-${String(parisTime.getMonth() + 1).padStart(2, '0')}`;
}

export async function getEmailCounter(): Promise<{ count: number; month: string }> {
    try {
        const currentMonth = getCurrentMonthParis();
        const data = await readCounter();

        if (data.month !== currentMonth) {
            await writeCounter({
                count: 0,
                month: currentMonth
            });
            return {
                count: 0,
                month: currentMonth
            };
        }

        return data;
    } catch (error) {
        console.error('Erreur getEmailCounter:', error);
        return {
            count: 0,
            month: getCurrentMonthParis()
        };
    }
}

export async function incrementEmailCounter(): Promise<number> {
    try {
        const currentMonth = getCurrentMonthParis();
        const data = await readCounter();

        if (data.month !== currentMonth) {
            await writeCounter({
                count: 1,
                month: currentMonth
            });
            return 1;
        }

        const newCount = data.count + 1;
        await writeCounter({
            count: newCount,
            month: currentMonth
        });

        return newCount;
    } catch (error) {
        console.error('Erreur incrementEmailCounter:', error);
        return 0;
    }
}



