import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

import ENV from './ENV.js';
import connectDB from './utils/mongoose.js';
import { getUsableProblem } from './services/fetchProblem.js';
import codeRoutes from '../server/routes/codeRoutes.js'

const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
connectDB();

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
});

// In-memory room store
interface RoomData {
  p1: string;               // CF handle of creator
  p2?: string;              // CF handle of joiner
  tags: string[];
  ratingLeft: number;
  ratingRight: number;
}

const rooms = new Map<string, RoomData>();

io.on('connection', (socket) => {
  console.log(`[socket] connected: ${socket.id}`);

  // ── CREATE ROOM (Player 1) ──
  socket.on('create_room', ({ roomId, handle, tags, ratingLeft, ratingRight }) => {
    if (rooms.has(roomId)) {
      socket.emit('error', { message: 'Room ID already exists. Refresh to get a new one.' });
      return;
    }

    rooms.set(roomId, {
      p1: handle,
      tags: tags ?? [],
      ratingLeft: ratingLeft ?? 800,
      ratingRight: ratingRight ?? 3500,
    });

    socket.join(roomId);
    console.log(`[room] created: ${roomId} by ${handle}`);
  });

  // ── JOIN ROOM (Player 2) ──
  socket.on('join_room', async ({ roomId, handle }) => {
    const room = rooms.get(roomId);

    if (!room) {
      socket.emit('error', { message: `Room "${roomId}" not found.` });
      return;
    }

    if (room.p2) {
      socket.emit('error', { message: 'Room is already full.' });
      return;
    }

    if (room.p1 === handle) {
      socket.emit('error', { message: 'You cannot join your own room.' });
      return;
    }

    // Mark player 2
    room.p2 = handle;
    socket.join(roomId);
    console.log(`[room] ${handle} joined room: ${roomId}`);

    // Fetch a problem neither player has solved
    try {
      const problem = await getUsableProblem(
        room.tags,
        room.ratingLeft,
        room.ratingRight,
        [room.p1, handle]
      );

      if (!problem) {
        io.to(roomId).emit('error', { message: 'No unsolved problem found for these filters. Try different tags/rating.' });
        rooms.delete(roomId);
        return;
      }

      const players = { p1: room.p1, p2: handle };
      io.to(roomId).emit('battle_start', { problem, roomId, players });
      console.log(`[battle] started in room ${roomId}: ${problem.name}`);

      // Clean up room from memory after battle starts
      rooms.delete(roomId);

    } catch (err) {
      console.error('[battle] error fetching problem:', err);
      io.to(roomId).emit('error', { message: 'Failed to fetch problem. Try again.' });
      rooms.delete(roomId);
    }
  });

  socket.on('disconnect', () => {
    console.log(`[socket] disconnected: ${socket.id}`);
  });
});
app.use('/api',codeRoutes);

app.get('/', (_req, res) => {
  res.send('Bro Code API running');
});

const PORT = ENV.PORT ?? 3000;
httpServer.listen(PORT, () => {
  console.log(`[server] listening on port ${PORT}`);
});