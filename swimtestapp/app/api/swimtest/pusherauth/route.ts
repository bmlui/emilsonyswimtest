import {NextResponse} from 'next/server';
import PusherService from '../../../services/pusher';

export async function POST(request: Request) {
//pusher channel authorization, not the authentification for user 
    const contentType = request.headers.get('content-type') || '';
    let body: { socket_id?: string; channel_name?: string };
    if (contentType.includes('application/json')) {
        body = await request.json();
    } else if (contentType.includes('application/x-www-form-urlencoded')) {
        const formData = await request.formData();
        body = Object.fromEntries(formData.entries());
    } else {
        return NextResponse.json({message: 'Unsupported content type'}, {status: 400});
    }

    const socketId = body.socket_id;
    const channel = body.channel_name;
    if (!socketId || !channel) {
        return NextResponse.json({message: 'Invalid request'}, {status: 400});
    } else {
    const auth = PusherService.getInstance().authorizeChannel(socketId, channel);
    return NextResponse.json(auth);
    }
}