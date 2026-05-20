import { Server, Socket } from "socket.io";
import { getUsableProblem } from "../services/fetchProblem.js"

export const io = new Server({
  cors: {
    origin: "*",
  },
});

interface RoomData {
  creator: string;        // socket id
  joiner?: string;        // socket id
  creatorHandle: string;
  joinerHandle?: string;
  tags: string[];
  ratingLeft: number;
  ratingRight: number;
}

const rooms = new Map<string, RoomData>();

io.on("connection", (socket: Socket) => {
  console.log("connected:", socket.id);

  // Creator emits this after clicking START BATTLE
  socket.on(
    "create_room",
    (data: {
      roomId: string;
      handle: string;
      tags: string[];
      ratingLeft: number;
      ratingRight: number;
    }) => {
      const { roomId, handle, tags, ratingLeft, ratingRight } = data;

      rooms.set(roomId, {
        creator: socket.id,
        creatorHandle: handle,
        tags,
        ratingLeft,
        ratingRight,
      });

      socket.join(roomId);
      socket.emit("room_created", { roomId });
      console.log(`Room ${roomId} created by ${handle}`);
    }
  );

  // Joiner emits this when they land on /room/:roomId
  socket.on(
    "join_room",
    async (data: { roomId: string; handle: string }) => {
      const { roomId, handle } = data;
      const room = rooms.get(roomId);

      if (!room) {
        socket.emit("error", { message: "Room not found" });
        return;
      }

      if (room.joiner) {
        socket.emit("error", { message: "Room is full" });
        return;
      }

      room.joiner = socket.id;
      room.joinerHandle = handle;
      socket.join(roomId);

      console.log(`${handle} joined room ${roomId}`);

      // Both players in — fetch a suitable problem and start the battle
      try {
        const problem = await getUsableProblem(
          room.tags,
          room.ratingLeft,
          room.ratingRight,
          [room.creatorHandle, handle]
        );

        if (!problem) {
          io.to(roomId).emit("error", { message: "No suitable problem found" });
          return;
        }

        // Both players receive this and navigate to the battle page
        io.to(roomId).emit("battle_start", {
          problem,
          roomId,
          players: {
            p1: room.creatorHandle,
            p2: handle,
          },
        });
      } catch (err) {
        console.error(err);
        io.to(roomId).emit("error", { message: "Failed to fetch problem" });
      }
    }
  );

  socket.on("disconnect", () => {
    rooms.forEach((room, roomId) => {
      if (room.creator === socket.id || room.joiner === socket.id) {
        io.to(roomId).emit("opponent_disconnected");
        rooms.delete(roomId);
      }
    });
  });
});