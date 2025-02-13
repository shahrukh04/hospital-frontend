// src/context/AuthContext.js

import React from 'react';
import { io } from "socket.io-client";
import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext({});
const socket = io("https://hospital-backend-vmq5.onrender.com");
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
            setAuth({
                user: JSON.parse(user),
                token,
                isAuthenticated: true,
            });
        }
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setAuth({
            user: userData,
            token,
            isAuthenticated: true,
        });
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        socket.emit("logout"); // Notify server on logout
        setAuth({
            user: null,
            token: null,
            isAuthenticated: false,
        });
    };

    return (
        <AuthContext.Provider value={{ ...auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export default AuthContext;