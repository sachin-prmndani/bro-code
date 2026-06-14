import { io } from 'socket.io-client';
import ENV from '../ENV.js'

const socket = io(ENV.VITE_API_URL, {
  autoConnect: true,
});

export default socket;
