
import redisClient from '../../../services/redis';
import { NextResponse } from 'next/server';

const cacheKey = process.env.REDIS_CACHEKEY || 'swimTestCache';

export async function GET() {
    try {
        await redisClient.del(cacheKey);
        return NextResponse.json({ message: `Server cache purged successfully: ${cacheKey}` }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to purge cache' }, { status: 500 });
    }

}