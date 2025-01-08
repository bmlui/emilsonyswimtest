import Redis from 'ioredis';

let redis: Redis | null = null;

if (process.env.REDIS_URL) {
    try {
        redis = new Redis(process.env.REDIS_URL);
    } catch (error) {
        console.error('Error connecting to Redis:', error);
        redis = null;
    }
} else {
    console.warn('REDIS_URL environment variable is not defined');
}

const EXPIRY_TIME = 120 * 60; // 60 minutes in seconds

export const get = async (key: string): Promise<string | null> => {
    if (!redis) return null;
    try {
        return await redis.get(key);
    } catch (error) {
        console.error(`Error getting key ${key}:`, error);
        return null;
    }
};

export const set = async (key: string, value: string): Promise<void> => {
    if (!redis) return;
    try {
        await redis.set(key, value, 'EX', EXPIRY_TIME);
    } catch (error) {
        console.error(`Error setting key ${key} with value ${value}:`, error);
    }
};

export const getList = async (listKey: string): Promise<string[] | null> => {
    if (!redis) return null;
    try {
        return await redis.lrange(listKey, 0, -1);
    } catch (error) {
        console.error(`Error getting list ${listKey}:`, error);
        return null;
    }
};
//set redis list 
export const setList = async (listKey: string, values: string[]): Promise<void> => {
    if (!redis) return;
    try {
        await redis.del(listKey); // Clear existing list
        await redis.rpush(listKey, ...values); // Push new values
        await redis.expire(listKey, EXPIRY_TIME); // Set expiry time
    } catch (error) {
        console.error(`Error setting list ${listKey} with values ${values}:`, error);
    }
};

export const pushToEnd = async (listKey: string, value: string): Promise<void> => {
    if (!redis) return;
    try {
        await redis.rpush(listKey, value);
        await redis.expire(listKey, EXPIRY_TIME);
    } catch (error) {
        console.error(`Error pushing value ${value} to list ${listKey}:`, error);
    }
};

export const del = async (key: string): Promise<void> => {
    if (!redis) return;
    try {
        await redis.del(key);
    } catch (error) {
        console.error(`Error deleting key ${key}:`, error);
    }
};

const redisClient = {
    get,
    set,
    getList,
    setList,
    pushToEnd,
    del,
};

export default redisClient;
