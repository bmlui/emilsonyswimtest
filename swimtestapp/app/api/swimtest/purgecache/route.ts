
import redisClient from '../../../services/redis';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        await redisClient.flushall();
        return NextResponse.json({ message: 'Cache purged successfully' }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Failed to purge cache' }, { status: 500 });
    }

}