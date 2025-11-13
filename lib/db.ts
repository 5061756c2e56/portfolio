const COUNTER_KEY = 'email_counter';
const MONTH_KEY = 'email_counter_month';

function getCurrentMonthParis(): string {
    const now = new Date();
    const parisTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    return `${parisTime.getFullYear()}-${String(parisTime.getMonth() + 1).padStart(2, '0')}`;
}

async function getKVInstance() {
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
        const { kv } = await import('@vercel/kv');
        return { kv, hasKV: true };
    }
    return { kv: null, hasKV: false };
}

export async function getEmailCounter(): Promise<{ count: number; month: string }> {
    try {
        const { kv, hasKV } = await getKVInstance();
        const currentMonth = getCurrentMonthParis();
        
        if (hasKV && kv) {
            const storedMonth = await kv.get<string>(MONTH_KEY);
            
            if (storedMonth !== currentMonth) {
                await kv.set(COUNTER_KEY, 0);
                await kv.set(MONTH_KEY, currentMonth);
                return { count: 0, month: currentMonth };
            }
            
            const count = (await kv.get<number>(COUNTER_KEY)) || 0;
            return { count, month: currentMonth };
        } else {
            const dbDev = await import('./db-dev');
            return await dbDev.getEmailCounter();
        }
    } catch (error) {
        console.error('Erreur getEmailCounter:', error);
        const dbDev = await import('./db-dev');
        return await dbDev.getEmailCounter();
    }
}

export async function incrementEmailCounter(): Promise<number> {
    try {
        const { kv, hasKV } = await getKVInstance();
        const currentMonth = getCurrentMonthParis();
        
        if (hasKV && kv) {
            const storedMonth = await kv.get<string>(MONTH_KEY);
            
            if (storedMonth !== currentMonth) {
                await kv.set(COUNTER_KEY, 0);
                await kv.set(MONTH_KEY, currentMonth);
            }
            
            const newCount = await kv.incr(COUNTER_KEY);
            await kv.set(MONTH_KEY, currentMonth);
            
            return newCount;
        } else {
            const dbDev = await import('./db-dev');
            return await dbDev.incrementEmailCounter();
        }
    } catch (error) {
        console.error('Erreur incrementEmailCounter:', error);
        const dbDev = await import('./db-dev');
        return await dbDev.incrementEmailCounter();
    }
}