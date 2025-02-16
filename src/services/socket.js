// frontend/src/socket.js
import io from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://hospital-backend-vmq5.onrender.com'
    : 'http://localhost:5000';

const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling']
});

// Debugging: Log socket connection status
socket.on("connect", () => {
    console.log("Connected to socket server:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Disconnected from socket server");
});

export default socket;