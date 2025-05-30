// import { io, Socket } from 'socket.io-client';
// import { getToken } from '../context/AuthContext'
// let socket: Socket | null = null;

// export const initializeSocket = (userId: string) => {
//   if (!socket) {
//     socket = io(process.env.NEXT_PUBLIC_API_URL || '', {
//       withCredentials: true,
//       auth: {
//         token: getToken(),
//       },
//     });

//     socket.on('connect', () => {
//       console.log('Socket connected');
//       socket?.emit('join', userId);
//     });

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected');
//     });
//   }
//   return socket;
// };

// export const getSocket = () => {
//   if (!socket) {
//     throw new Error('Socket not initialized');
//   }
//   return socket;
// };

// export const disconnectSocket = () => {
//   if (socket) {
//     socket.disconnect();
//     socket = null;
//   }
// };






// src/services/socket.service.ts
import { io, Socket } from 'socket.io-client';

let socket: Socket | null = null;

// Get the API URL from environment or default
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

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
      console.log('Socket connected');
      socket?.emit('join', userId);
    });

    socket.on('connect_error', (err) => {
      console.error('Socket connection error:', err.message);
    });

    socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });
    
    // Ensure socket is connected
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
