// utils/pusher.ts
import Pusher from "pusher";

class PusherService {
    private static instance: Pusher | null = null;

    private constructor() {}

    public static getInstance(): Pusher  {
        if (!PusherService.instance) {
            if (!process.env.PUSHER_APP_ID || !process.env.NEXT_PUBLIC_PUSHER_KEY || !process.env.PUSHER_SECRET || !process.env.NEXT_PUBLIC_PUSHER_CLUSTER) {
                console.warn("Pusher environment variables are not defined");
                throw new Error("Pusher environment variables are not defined");
            }
            try {
                PusherService.instance = new Pusher({
                    appId: process.env.PUSHER_APP_ID || "",
                    key: process.env.NEXT_PUBLIC_PUSHER_KEY || "",
                    secret: process.env.PUSHER_SECRET || "",
                    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || "",
                    useTLS: true, // Use secure connection
                });
            } catch (error) {
                console.error("Failed to initialize Pusher:", error);
                throw error;
            }
        }
        return PusherService.instance;
    }

    
}

export default PusherService;