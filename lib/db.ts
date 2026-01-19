import Redis from 'ioredis';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

const MONTHLY_LIMIT = 200;
const COUNTER_FILE = join(process.cwd(), 'data', 'email-counter.json');

interface CounterData {
    count: number;
    month: string;
}

function getCurrentMonthParis(): string {
    const formatter = new Intl.DateTimeFormat('fr-FR', {
        timeZone: 'Europe/Paris',
        year: 'numeric',
        month: '2-digit'
    });

    const parts = formatter.formatToParts(new Date());
    const year = parts.find(p => p.type === 'year')!.value;
    const month = parts.find(p => p.type === 'month')!.value;

    return `${year}-${month}`;
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
            count: typeof parsed.count === 'string' ? parseInt(parsed.count, 10) : (
                parsed.count || 0
            ),
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

export async function getEmailCounter() {
    const { redis, hasRedis } = await getKVInstance();
    const month = getCurrentMonthParis();
    const key = `email_counter:${month}`;

    if (!hasRedis || !redis) {
        return { count: 0, month };
    }

    const value = await redis.get(key);
    return {
        count: value ? parseInt(value, 10) : 0,
        month
    };
}

export async function incrementEmailCounter(): Promise<{
    allowed: boolean;
    count: number;
    month: string;
}> {
    const { redis, hasRedis } = await getKVInstance();
    const month = getCurrentMonthParis();
    const key = `email_counter:${month}`;

    if (!hasRedis || !redis) {
        return { allowed: false, count: 0, month };
    }

    const count = await redis.incr(key);

    if (count === 1) {
        await redis.expire(key, 60 * 60 * 24 * 40);
    }

    if (count > MONTHLY_LIMIT) {
        return { allowed: false, count, month };
    }

    return { allowed: true, count, month };
}