import { io, Socket } from 'socket.io-client';

let socket: Socket;

export const getSocket = () => {
  if (!socket) {
    socket = io('http://localhost:3001', {
      transports: ['websocket'],
    });
  }
  return socket;
};
