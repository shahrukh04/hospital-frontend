import React, { useState, useEffect, useRef } from "react";
import socket from "../../../services/socket";
import axios from "axios";
import { FaPaperPlane, FaUser, FaEllipsisV, FaSearch, FaArrowLeft, FaTimes } from "react-icons/fa";
import { API_BASE_URL } from "../../../services/api";

const ChatRoom = () => {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [userId, setUserId] = useState("");
    const [username, setUsername] = useState("");
    const [users, setUsers] = useState([]);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [showGroupInfo, setShowGroupInfo] = useState(false);
    const messagesEndRef = useRef(null);
    const chatContainerRef = useRef(null);

    const filteredUsers = users.filter(user =>
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.error("No token found");
                    return;
                }

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

        return () => {
            socket.off("receive_message", handleReceiveMessage);
            socket.off("user_list", handleUserListUpdate);
            socket.emit("logout", { userId, username });
        };
    }, [userId, username]);

    const sendMessage = () => {
        if (message.trim() === "") return;

        const data = { sender: username, text: message };
        socket.emit("send_message", data);
        setMessage("");
    };

    const formatTime = () => {
        const now = new Date();
        return now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
        setShowGroupInfo(false);
    };

    const toggleGroupInfo = () => {
        setShowGroupInfo(!showGroupInfo);
        setIsSidebarOpen(false);
    };

    const getOnlineUsersCount = () => {
        return users.filter(user => user.isOnline).length;
    };

    return (
<div className="h-screen w-full flex flex-col bg-gray-900 rounded-lg overflow-hidden">
            {/* Chat Header */}
            <div className="h-16 bg-gray-800 flex items-center justify-between shadow-md px-4">
                <div className="flex items-center flex-1">
                    {showGroupInfo && (
                        <button
                            className="mr-4 text-white"
                            onClick={toggleGroupInfo}
                        >
                            <FaArrowLeft size={20} />
                        </button>
                    )}
                    <button
                        className="lg:hidden mr-4 text-white"
                        onClick={toggleSidebar}
                    >
                        <FaEllipsisV />
                    </button>
                    <div
                        className="flex items-center cursor-pointer"
                        onClick={toggleGroupInfo}
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3">
                            <FaUser className="text-white" />
                        </div>
                        <div>
                            <h1 className="text-white text-xl font-semibold">Global Chat</h1>
                            <p className="text-gray-400 text-sm">{getOnlineUsersCount()} online</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="flex flex-1 overflow-hidden relative h-[calc(100vh-4rem)]">
                {/* Sidebar - Group Info */}
                <div className={`
                    ${showGroupInfo ? 'translate-x-0' : '-translate-x-full'}
                    absolute lg:relative
                    w-full lg:w-96 h-full
                    bg-gray-800
                    transition-transform duration-300 ease-in-out
                    z-40
                    border-r border-gray-700
                `}>
                    <div className="flex flex-col h-full">
                        <div className="p-4 border-b border-gray-700">
                            <h2 className="text-white text-xl font-semibold mb-2">Group Info</h2>
                            <p className="text-gray-400">Members: {users.length}</p>
                        </div>
                        <div className="p-4">
                            <div className="flex items-center bg-gray-700 rounded-lg p-2 mb-4">
                                <FaSearch className="text-gray-400 mr-2" />
                                <input
                                    type="text"
                                    placeholder="Search members..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="bg-transparent text-white w-full focus:outline-none"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="text-gray-400 hover:text-white"
                                    >
                                        <FaTimes />
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="flex-1 overflow-y-auto">
                            {filteredUsers.map((user, index) => (
                                <div key={index} className="flex items-center p-3 mx-2 hover:bg-gray-700 rounded-lg">
                                    <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center mr-3">
                                        <FaUser className="text-gray-300" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-white font-medium">{user.username}</h3>
                                        <p className="text-gray-400 text-sm">
                                            {user.isOnline ? 'Online' : 'Offline'}
                                        </p>
                                    </div>
                                    <div className={`w-2 h-2 rounded-full ${user.isOnline ? 'bg-green-500' : 'bg-gray-500'}`} />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Chat Area */}
                <div className="flex-1 flex flex-col min-w-0">
                <div
    ref={chatContainerRef}
    className="flex-1 overflow-y-auto px-4 py-2 h-[calc(100vh-8rem)]"
>
                        <div className="space-y-4">
                            {messages.map((msg, index) => (
                                <div
                                    key={index}
                                    className={`flex ${msg.sender === username ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className="max-w-[85%] lg:max-w-[65%] relative group">
                                        <div
                                            className={`
                                                p-3 rounded-lg
                                                ${msg.sender === username
                                                    ? 'bg-blue-600 rounded-tr-none'
                                                    : 'bg-gray-700 rounded-tl-none'
                                                }
                                            `}
                                        >
                                            {msg.sender !== username && (
                                                <p className="text-gray-300 text-sm mb-1">{msg.sender}</p>
                                            )}
                                            <p className="text-white whitespace-pre-wrap break-words">{msg.text}</p>
                                            <span className="text-xs text-gray-300 float-right mt-1 ml-2">
                                                {formatTime()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                    </div>

                    {/* Message Input */}
                    <div className="bg-gray-800 p-4 border-t border-gray-700">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                className="flex-1 bg-gray-700 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                            />
                            <button
                                className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full w-10 h-10 flex items-center justify-center transition-colors"
                                onClick={sendMessage}
                            >
                                <FaPaperPlane className="text-sm" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;