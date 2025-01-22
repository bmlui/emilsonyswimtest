import Redis from 'ioredis';

class RedisClient {
    private static instance: Redis | null = null;
    private static EXPIRY_TIME = 120 * 60; // 120 minutes in seconds
    private static TIMEOUT = 5000; // 5 seconds timeout

    private constructor() {}

    public static getInstance(): Redis | null {
        if (!RedisClient.instance) {
            if (process.env.REDIS_URL) {
                try {
                    RedisClient.instance = new Redis(process.env.REDIS_URL, {
                        connectTimeout: RedisClient.TIMEOUT,
                    });
                } catch (error) {
                    console.error('Error connecting to Redis:', error);
                    return null;
                }
                if (RedisClient.instance) {
                    RedisClient.instance.on('error', (err) => {
                        console.error('Redis client error:', err);
                        RedisClient.instance?.disconnect();
                        RedisClient.instance = null;
                    });
                }
            } else {
                console.warn('REDIS_URL environment variable is not defined');
                return null;
            }
        }
        return RedisClient.instance;
    }

    private static withTimeout<T>(promise: Promise<T>, timeout: number): Promise<T> {
        const timeoutPromise = new Promise<T>((_, reject) =>
            setTimeout(() => reject(new Error('Redis command timed out')), timeout)
        );
        return Promise.race([promise, timeoutPromise]);
    }


    public static async get(key: string): Promise<string | null> {
        const redis = RedisClient.getInstance();
        if (!redis) return null;
        try {
            return await RedisClient.withTimeout(redis.get(key), RedisClient.TIMEOUT);
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            return null;
        }
    }

    public static async set(key: string, value: string): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await RedisClient.withTimeout(redis.set(key, value), RedisClient.TIMEOUT);
        } catch (error) {
            console.error(`Error setting key ${key} with value ${value}:`, error);
        }
    }

    public static async getList(listKey: string): Promise<string[] | null> {
        const redis = RedisClient.getInstance();
        if (!redis) return null;
        try {
            return await RedisClient.withTimeout(redis.lrange(listKey, 0, -1), RedisClient.TIMEOUT);
        } catch (error) {
            console.error(`Error getting list ${listKey}:`, error);
            return null;
        }
    }

    public static async setList(listKey: string, values: string[]): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await RedisClient.withTimeout(redis.del(listKey), RedisClient.TIMEOUT); // Delete existing list
            await RedisClient.withTimeout(redis.rpush(listKey, ...values), RedisClient.TIMEOUT); // Set new list
            await RedisClient.withTimeout(redis.expire(listKey, RedisClient.EXPIRY_TIME), RedisClient.TIMEOUT); // Set expiry time
        } catch (error) {
            console.error(`Error setting list ${listKey} with values ${values}:`, error);
        }
    }

    public static async pushToEnd(listKey: string, value: string): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await RedisClient.withTimeout(redis.rpush(listKey, value), RedisClient.TIMEOUT);
            await RedisClient.withTimeout(redis.expire(listKey, RedisClient.EXPIRY_TIME), RedisClient.TIMEOUT);
        } catch (error) {
            console.error(`Error pushing value ${value} to list ${listKey}:`, error);
        }
    }

    public static async del(key: string): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await RedisClient.withTimeout(redis.del(key), RedisClient.TIMEOUT);
        } catch (error) {
            console.error(`Error deleting key ${key}:`, error);
            throw error;
        }
    }

    public static async flushall(): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await redis.flushall();
        } catch (error) {
            console.error('Error flushing Redis:', error);
            throw error;
        }
    }

    public static async exists(key: string): Promise<boolean> {
        const redis = RedisClient.getInstance();
        if (!redis) return false;
        try {
            const result = await RedisClient.withTimeout(redis.exists(key), RedisClient.TIMEOUT);
            return result === 1;
        } catch (error) {
            console.error(`Error checking existence of key ${key}:`, error);
            return false;
        }
    }

    public static async close(): Promise<void> {
        if (RedisClient.instance) {
            try {
                await RedisClient.instance.quit();
                RedisClient.instance = null;
                console.log('Redis connection closed');
            } catch (error) {
                console.error('Error closing Redis connection:', error);
            }
        }
    }
}

// Ensure Redis connection is closed when the application is shutting down
if (process.env.NODE_ENV === 'development') {
    process.on('SIGINT', async () => {
        await RedisClient.close();
        process.exit(0);
    });

    process.on('SIGTERM', async () => {
        await RedisClient.close();
        process.exit(0);
    });
}

export default RedisClient;
