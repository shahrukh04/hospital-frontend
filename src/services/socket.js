import io from 'socket.io-client';

const socket = io('https://hospital-backend-vmq5.onrender.com', {
    cors: {
        origin: "https://hospital-frontend-tan.vercel.app",
        methods: ["GET", "POST"]
    }
});
export default socket;