import { io } from "../utils/socketIO.js";

export function joinRoom(roomId:string){
    io.on('connection',(socket)=>{
        const room = io.sockets.adapter.rooms.get(roomId);
        if(room && room.size >= 2) {
            io.to(roomId).emit("room_full");
            return;
        }
        socket.join(roomId);
        
    });
}