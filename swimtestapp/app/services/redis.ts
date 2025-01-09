import Redis from 'ioredis';

class RedisClient {
    private static instance: Redis | null = null;
    private static EXPIRY_TIME = 120 * 60; // 60 minutes in seconds

    private constructor() {}


    public static getInstance(): Redis | null {
    

        if (!RedisClient.instance) {
            if (process.env.REDIS_URL) {
                try {
                    RedisClient.instance = new Redis(process.env.REDIS_URL);
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

    

    public static async get(key: string): Promise<string | null> {
        const redis = RedisClient.getInstance();
        if (!redis) return null;
        try {
            return await redis.get(key);
        } catch (error) {
            console.error(`Error getting key ${key}:`, error);
            return null;
        }
    }

    public static async set(key: string, value: string): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await redis.set(key, value, 'EX', RedisClient.EXPIRY_TIME);
        } catch (error) {
            console.error(`Error setting key ${key} with value ${value}:`, error);
        }
    }

    public static async getList(listKey: string): Promise<string[] | null> {
        const redis = RedisClient.getInstance();
        if (!redis) return null;
        try {
            return await redis.lrange(listKey, 0, -1);
        } catch (error) {
            console.error(`Error getting list ${listKey}:`, error);
            return null;
        }
    }

    public static async setList(listKey: string, values: string[]): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await redis.del(listKey); // Clear existing list
            await redis.rpush(listKey, ...values); // Push new values
            await redis.expire(listKey, RedisClient.EXPIRY_TIME); // Set expiry time
        } catch (error) {
            console.error(`Error setting list ${listKey} with values ${values}:`, error);
        }
    }

    public static async pushToEnd(listKey: string, value: string): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await redis.rpush(listKey, value);
            await redis.expire(listKey, RedisClient.EXPIRY_TIME);
        } catch (error) {
            console.error(`Error pushing value ${value} to list ${listKey}:`, error);
        }
    }

    public static async del(key: string): Promise<void> {
        const redis = RedisClient.getInstance();
        if (!redis) return;
        try {
            await redis.del(key);
        } catch (error) {
            console.error(`Error deleting key ${key}:`, error);
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
