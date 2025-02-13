import { useState } from "react";
import { registerUser } from "../services/api";
import { useNavigate } from "react-router-dom";

const Register = ({ closeModal, switchToLogin }) => {
    const [form, setForm] = useState({ username: "", email: "", password: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await registerUser(form);
            if (response.success) {
                alert("Registration successful! Please log in.");
                switchToLogin(); // Switch to login modal instead of navigating
            } else {
                alert(response.message || "Registration failed.");
            }
        } catch (error) {
            alert("Error during registration. Try again.");
        }
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

            <h2 className="text-center text-3xl font-bold text-gray-800">
                Create an Account
            </h2>
            
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-5">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                            Username
                        </label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            required
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter your username"
                            value={form.username}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email address
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Enter your email"
                            value={form.email}
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
                            className="w-full px-4 py-3 bg-white/50 backdrop-blur-md border border-gray-300 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                            placeholder="Create a password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <button
                        type="submit"
                        className="w-full px-4 py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg font-medium transition duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                        Create Account
                    </button>

                    <div className="text-center pt-4 border-t border-gray-300">
                        <span className="text-gray-600 text-sm">
                            Already have an account?{' '}
                            <button 
                                onClick={switchToLogin}
                                className="font-medium text-blue-600 hover:text-blue-700 transition duration-200"
                            >
                                Sign in here
                            </button>
                        </span>
                    </div>
                </div>
            </form>

            <p className="text-center text-sm text-gray-500">
                By registering, you agree to our{' '}
                <a href="/terms" className="text-blue-600 hover:text-blue-700">
                    Terms of Service
                </a>{' '}
                and{' '}
                <a href="/privacy" className="text-blue-600 hover:text-blue-700">
                    Privacy Policy
                </a>
            </p>
        </div>
        </div>
    );
};


export default Register;
