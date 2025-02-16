import React, { useState, useEffect } from "react";
import socket from "../../../services/socket";
import axios from "axios";
import { FaPaperPlane, FaUser } from "react-icons/fa"; // Import icons
import { API_BASE_URL } from "../../../services/api"; // Import the API_BASE_URL

const ChatRoom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

                // Use the API_BASE_URL from api.js
                const response = await axios.get(`${API_BASE_URL}/api/auth/me`, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const fetchedUserId = response.data.user._id;
                const fetchedUsername = response.data.user.username;

                setUserId(fetchedUserId);
                setUsername(fetchedUsername);

                if (fetchedUserId && fetchedUsername) {
                    socket.emit("join_chat", { userId: fetchedUserId, username: fetchedUsername });
                }
            } catch (error) {
                console.error("Error fetching user:", error.response?.data || error.message);
            }
        };

        fetchUser();

        const handleReceiveMessage = (data) => {
            setMessages((prev) => [...prev, data]);
        };

        const handleUserListUpdate = (userList) => {
            setUsers(userList);
        };

        socket.on("receive_message", handleReceiveMessage);
        socket.on("user_list", handleUserListUpdate);

        // Cleanup on component unmount
        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_list", handleUserListUpdate);
            socket.emit("logout", { userId, username }); // Notify server that user is leaving
        };
    }, [userId, username]);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const data = { sender: username, text: message };
        socket.emit("send_message", data);
        setMessage("");
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            {/* Sidebar */}
            <div className="w-1/4 bg-gray-800 p-6 border-r border-gray-700">
                <h2 className="text-xl font-bold mb-6 flex items-center">
                    <FaUser className="mr-2" /> Online Users
                </h2>
                <ul>
                    {users.map((user, index) => (
                        <li key={index} className="py-2 flex items-center">
                            <span
                                className={`w-2 h-2 rounded-full mr-2 ${
                                    user.isOnline ? "bg-green-500" : "bg-red-500"
                                }`}
                            ></span>
                            {user.username}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Chat Box */}
            <div className="w-3/4 flex flex-col p-6">
                {/* Chat Messages */}
                <div className="flex-1 overflow-y-auto mb-6">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`flex mb-4 ${msg.sender === username ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[70%] p-4 rounded-lg ${
                                    msg.sender === username
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-700 text-white"
                                }`}
                            >
                                <strong>{msg.sender}:</strong> {msg.text}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Input Box */}
                <div className="flex items-center">
                    <input
                        type="text"
                        className="flex-1 p-3 bg-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Type a message..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    />
                    <button
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg ml-4 hover:bg-blue-700 transition duration-200 flex items-center"
                        onClick={sendMessage}
                    >
                        <FaPaperPlane className="mr-2" /> Send
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;