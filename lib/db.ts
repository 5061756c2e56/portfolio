import Redis from 'ioredis';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const COUNTER_KEY = 'email_counter';
const MONTH_KEY = 'email_counter_month';
const COUNTER_FILE = join(process.cwd(), 'data', 'email-counter.json');

interface CounterData {
    count: number;
    month: string;
}

function getCurrentMonthParis(): string {
    const now = new Date();
    const parisTime = new Date(now.toLocaleString('en-US', { timeZone: 'Europe/Paris' }));
    return `${parisTime.getFullYear()}-${String(parisTime.getMonth() + 1).padStart(2, '0')}`;
}

let redisClient: Redis | null = null;

function getRedisClient(): Redis | null {
    if (redisClient) {
        return redisClient;
    }

    try {
        const redisUrl = process.env.REDIS_URL;
        const redisHost = process.env.REDIS_HOST || 'localhost';
        const redisPort = parseInt(process.env.REDIS_PORT || '6379', 10);
        const redisPassword = process.env.REDIS_PASSWORD;

        if (redisUrl) {
            redisClient = new Redis(redisUrl, {
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3) {
                        return null;
                    }
                    return Math.min(times * 50, 2000);
                },
                lazyConnect: true
            });
        } else {
            redisClient = new Redis({
                host: redisHost,
                port: redisPort,
                password: redisPassword,
                maxRetriesPerRequest: 3,
                retryStrategy: (times) => {
                    if (times > 3) {
                        return null;
                    }
                    return Math.min(times * 50, 2000);
                },
                lazyConnect: true
            });
        }

        redisClient.on('error', (error) => {
            if (process.env.NODE_ENV !== 'production') {
                console.error('[Redis] Connection error');
            }
            redisClient = null;
        });

        return redisClient;
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Redis] Failed to create client');
        }
        return null;
    }
}

export async function getKVInstance(): Promise<{ redis: Redis | null; hasRedis: boolean }> {
    const redis = getRedisClient();
    if (!redis) {
        return { redis: null, hasRedis: false };
    }

    try {
        if (redis.status !== 'ready') {
            await redis.connect();
        }
        return { redis, hasRedis: true };
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Redis] Connection failed');
        }
        return { redis: null, hasRedis: false };
    }
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

async function readCounterFile(): Promise<CounterData> {
    try {
        await ensureDataDir();
        const data = await readFile(COUNTER_FILE, 'utf-8');
        const parsed = JSON.parse(data);
        return {
            count: typeof parsed.count === 'string' ? parseInt(parsed.count, 10) : (parsed.count || 0),
            month: parsed.month || getCurrentMonthParis()
        };
    } catch {
        return {
            count: 0,
            month: getCurrentMonthParis()
        };
    }
}

async function writeCounterFile(data: CounterData): Promise<void> {
    await ensureDataDir();
    await writeFile(COUNTER_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

export async function getEmailCounter(): Promise<{ count: number; month: string }> {
    try {
        const { redis, hasRedis } = await getKVInstance();
        const currentMonth = getCurrentMonthParis();
        
        if (hasRedis && redis) {
            try {
                const storedMonth = await redis.get(MONTH_KEY);
                
                if (storedMonth !== currentMonth) {
                    await redis.set(COUNTER_KEY, 0);
                    await redis.set(MONTH_KEY, currentMonth);
                    return { count: 0, month: currentMonth };
                }
                
                const countStr = await redis.get(COUNTER_KEY);
                const count = countStr ? parseInt(countStr, 10) : 0;
                return { count, month: currentMonth };
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('[Redis] Get error');
                }
                return await readCounterFile();
            }
        } else {
            return await readCounterFile();
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Counter] Get error');
        }
        return {
            count: 0,
            month: getCurrentMonthParis()
        };
    }
}

export async function incrementEmailCounter(): Promise<number> {
    try {
        const { redis, hasRedis } = await getKVInstance();
        const currentMonth = getCurrentMonthParis();
        
        if (hasRedis && redis) {
            try {
                const storedMonth = await redis.get(MONTH_KEY);
                
                if (storedMonth !== currentMonth) {
                    await redis.set(COUNTER_KEY, 0);
                    await redis.set(MONTH_KEY, currentMonth);
                }
                
                const newCount = await redis.incr(COUNTER_KEY);
                await redis.set(MONTH_KEY, currentMonth);
                
                return newCount;
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error('[Redis] Increment error');
                }
                const data = await readCounterFile();
                if (data.month !== currentMonth) {
                    await writeCounterFile({ count: 1, month: currentMonth });
                    return 1;
                }
                const newCount = data.count + 1;
                await writeCounterFile({ count: newCount, month: currentMonth });
                return newCount;
            }
        } else {
            const data = await readCounterFile();
            if (data.month !== currentMonth) {
                await writeCounterFile({ count: 1, month: currentMonth });
                return 1;
            }
            const newCount = data.count + 1;
            await writeCounterFile({ count: newCount, month: currentMonth });
            return newCount;
        }
    } catch (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error('[Counter] Increment error');
        }
        return 0;
    }
}
