import io from 'socket.io-client';

const socket = io('https://hospital-backend-vmq5.onrender.com', {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});
export default socket;