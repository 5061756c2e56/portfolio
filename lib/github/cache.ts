import { getKVInstance } from '@/lib/db';
import { CACHE_TTL, TimeRange } from './types';

interface CacheResult<T> {
    data: T | null;
    fromCache: boolean;
}

export async function getFromCache<T>(key: string): Promise<CacheResult<T>> {
    try {
        const { redis, hasRedis } = await getKVInstance();

        if (!hasRedis || !redis) {
            return { data: null, fromCache: false };
        }

        const cached = await redis.get(key);

        if (cached) {
            return {
                data: JSON.parse(cached) as T,
                fromCache: true
            };
        }

        return { data: null, fromCache: false };
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[GitHub Cache] Get error:', error);
        }
        return { data: null, fromCache: false };
    }
}

export async function setInCache<T>(
    key: string,
    data: T,
    ttlSeconds: number
): Promise<boolean> {
    try {
        const { redis, hasRedis } = await getKVInstance();

        if (!hasRedis || !redis) {
            return false;
        }

        await redis.setex(key, ttlSeconds, JSON.stringify(data));
        return true;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[GitHub Cache] Set error:', error);
        }
        return false;
    }
}

export async function withCache<T>(
    key: string,
    ttlSeconds: number,
    fetchFn: () => Promise<T>
): Promise<{ data: T; fromCache: boolean }> {
    const cached = await getFromCache<T>(key);
    if (cached.data !== null) {
        return { data: cached.data, fromCache: true };
    }

    const data = await fetchFn();

    setInCache(key, data, ttlSeconds).catch(() => {
    });

    return { data, fromCache: false };
}

export async function invalidateCache(key: string): Promise<void> {
    try {
        const { redis, hasRedis } = await getKVInstance();
        if (hasRedis && redis) {
            await redis.del(key);
        }
    } catch {
    }
}

export async function invalidateAllGitHubCache(): Promise<void> {
    try {
        const { redis, hasRedis } = await getKVInstance();
        if (hasRedis && redis) {
            const keys = await redis.keys('github:*');
            if (keys.length > 0) {
                await redis.del(...keys);
            }
        }
    } catch {
    }
}

export function getTTLForRange(range: TimeRange): number {
    return CACHE_TTL[range];
}
