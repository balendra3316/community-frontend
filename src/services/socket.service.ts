












































import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;


const API_URL = process.env.NEXT_PUBLIC_SOCKET_URL

export const initializeSocket = (userId: string): Socket => {
  if (!socket) {
    socket = io(API_URL, {
      path: '/api/socket.io',
      withCredentials: true,
      transports: ['websocket', 'polling'], // Try WebSocket first, fall back to polling
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: true
    });

    socket.on('connect', () => {
      socket?.emit('join', userId);
    });

    socket.on('connect_error', (err) => {
    });

    socket.on('disconnect', () => {
    });
    

    if (!socket.connected) {
      socket.connect();
    }
  }

  return socket;
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error('Socket not initialized. Call initializeSocket first.');
  }
  return socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

export default {
  initializeSocket,
  getSocket,
  disconnectSocket
};
