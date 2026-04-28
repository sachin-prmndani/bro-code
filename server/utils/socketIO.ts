import {Socket} from 'socket.io';
import {Server} from 'socket.io';

export const io = new Server({
    cors: {
        origin: "*",
    }
});
