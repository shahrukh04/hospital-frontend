import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api"; // Import the loginUser function from api.js

const Login = ({ closeModal, switchToRegister }) => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await loginUser(formData);

            if (response.data) { // axios wraps the response in .data
                login(response.data.user, response.data.token);
                navigate("/Sidebar/dashboard");
                closeModal();
            }
        } catch (error) {
            console.error("Login error:", error);
            setError(error.response?.data?.message || "Failed to login. Please try again.");
        }
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="relative w-full max-w-md bg-white/90 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl p-8 space-y-8">
                <button 
                    onClick={closeModal} 
                    className="absolute top-4 right-4 text-gray-700 hover:text-gray-900"
                >
                    ✕
                </button>

                <h2 className="text-center text-3xl font-bold text-gray-800">Sign in to your account</h2>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                required
                                className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter your email"
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                className="w-full px-4 py-3 bg-white/70 backdrop-blur-md border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                placeholder="Enter your password"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <button
                            type="submit"
                            className="w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Sign in
                        </button>

                        <div className="text-center">
                            <a href="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 transition duration-200">
                                Forgot your password?
                            </a>
                        </div>

                        <div className="text-center pt-2 border-t border-gray-300">
                            <span className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <button 
                                    onClick={switchToRegister}
                                    className="font-medium text-blue-600 hover:text-blue-700 transition duration-200"
                                >
                                    Register here
                                </button>
                            </span>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;