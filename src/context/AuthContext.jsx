// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { io } from "socket.io-client";

const AuthContext = createContext({});

// Get the socket URL based on environment
const SOCKET_URL = import.meta.env.VITE_NODE_ENV === 'production'
    ? 'https://hospital-backend-vmq5.onrender.com'
    : 'http://localhost:5000';

// Configure socket with proper options
const socket = io(SOCKET_URL, {
    withCredentials: true,
    transports: ['websocket', 'polling'],
    autoConnect: true
});

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({
        user: null,
        token: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        // Check if user is logged in on component mount
        const token = localStorage.getItem('token');
        const user = localStorage.getItem('user');
        
        if (token && user) {
            const userData = JSON.parse(user);
            setAuth({
                user: userData,
                token,
                isAuthenticated: true,
            });

            // Connect socket with user data
            socket.connect();
            socket.emit('join_chat', {
                userId: userData._id,
                username: userData.name || userData.email
            });
        }

        // Cleanup on unmount
        return () => {
            socket.disconnect();
        };
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth({
            user: userData,
            token,
            isAuthenticated: true,
        });

        // Connect socket after successful login
        socket.connect();
        socket.emit('join_chat', {
            userId: userData._id,
            username: userData.name || userData.email
        });
    };

    const logout = () => {
        // Notify server before clearing data
        socket.emit("logout");
        socket.disconnect();

        localStorage.removeItem('token');
        localStorage.removeItem('user');

        setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout, socket }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;