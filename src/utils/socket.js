import io from 'socket.io-client';

const fullUrl = import.meta.env.VITE_API_URL;
const url = new URL(fullUrl);
const baseUrl = `${url.protocol}//${url.hostname}:${url.port}`;

const socket = io(baseUrl, {
  transports: ['websocket'],
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

export default socket;
