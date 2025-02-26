import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";

const Header = () => {
  const [isServicesOpen, setIsServicesOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);

  useEffect(() => {
    const closeDropdowns = (e) => {
      if (!e.target.closest(".services-dropdown")) {
        setIsServicesOpen(false);
      }
    };
    document.addEventListener("click", closeDropdowns);
    return () => document.removeEventListener("click", closeDropdowns);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Searching for:", searchQuery);
  };

  const switchToRegister = () => {
    setIsLoginOpen(false);
    setIsRegisterOpen(true);
  };

  const switchToLogin = () => {
    setIsRegisterOpen(false);
    setIsLoginOpen(true);
  };

  return (
    <header className="fixed w-full top-0 z-50 bg-white text-indigo-600 shadow-lg shadow-indigo-500/50">
      <div className="container mx-auto py-3 md:py-4 px-4 sm:px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <h1 className="text-xl md:text-2xl font-bold">
            <Link to="/" className="flex items-center space-x-1 md:space-x-2">
              <span className="text-2xl md:text-3xl">🏥</span>
              <span>HMS</span>
            </Link>
          </h1>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-6">
            <Link
              to="/"
              className="hover:underline transition-colors duration-200 text-sm lg:text-base"
            >
              Home
            </Link>
            <Link
              to="/about"
              className="hover:underline transition-colors duration-200 text-sm lg:text-base"
            >
              About Us
            </Link>

            {/* Services Dropdown */}
            <div className="relative services-dropdown">
              <button
                className="hover:underline focus:outline-none flex items-center space-x-1 text-sm lg:text-base"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServicesOpen(!isServicesOpen);
                }}
              >
                <span>Services</span>
                <span
                  className={`transform transition-transform duration-200 ${
                    isServicesOpen ? "rotate-180" : ""
                  }`}
                >
                  ▼
                </span>
              </button>
              {isServicesOpen && (
                <div className="absolute left-0 bg-white text-gray-800 mt-2 py-2 w-48 shadow-xl rounded-lg border border-gray-100 animate-fadeIn">
                  <Link
                    to="/services"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm"
                  >
                    All Services
                  </Link>
                  <Link
                    to="/emergency-care"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm"
                  >
                    Emergency Care
                  </Link>
                  <Link
                    to="/appointments"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm"
                  >
                    Appointments
                  </Link>
                  <Link
                    to="/departments"
                    className="block px-4 py-2 hover:bg-blue-50 text-sm"
                  >
                    Departments
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/testimonials"
              className="hover:underline transition-colors duration-200 text-sm lg:text-base"
            >
              Testimonials
            </Link>
            <Link
              to="/contact"
              className="hover:underline transition-colors duration-200 text-sm lg:text-base"
            >
              Contact
            </Link>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="relative min-w-[120px] max-w-[200px]">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-3 pr-8 py-1 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2"
              >
                🔍
              </button>
            </form>

            {/* Auth Buttons */}
            <div className="flex gap-2 lg:gap-4">
              <button
                onClick={() => setIsLoginOpen(true)}
                className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg transition-colors duration-200 bg-blue-600 text-white hover:bg-blue-700 text-sm lg:text-base"
              >
                Login
              </button>
              <button
                onClick={() => setIsRegisterOpen(true)}
                className="px-3 lg:px-4 py-1.5 lg:py-2 rounded-lg transition-colors duration-200 bg-green-600 text-white hover:bg-green-700 text-sm lg:text-base"
              >
                Register
              </button>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-2xl"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden mt-4 pb-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="hover:opacity-75">
                Home
              </Link>
              <Link to="/about" className="hover:opacity-75">
                About Us
              </Link>
              <Link to="/services" className="hover:opacity-75">
                Services
              </Link>
              <Link to="/testimonials" className="hover:opacity-75">
                Testimonials
              </Link>
              <Link to="/contact" className="hover:opacity-75">
                Contact
              </Link>
              <div className="flex flex-col space-y-2 mt-2">
                <form onSubmit={handleSearch} className="relative">
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-3 pr-8 py-1 rounded-full text-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  >
                    🔍
                  </button>
                </form>
                <button
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-white text-blue-600 px-4 py-2 rounded-lg text-center hover:bg-gray-100 w-full"
                >
                  Login
                </button>
                <button
                  onClick={() => setIsRegisterOpen(true)}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-center hover:bg-green-600 w-full"
                >
                  Register
                </button>
              </div>
            </div>
          </nav>
        )}
      </div>

      {/* Login Modal */}
      {isLoginOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Login
            closeModal={() => setIsLoginOpen(false)}
            switchToRegister={switchToRegister}
          />
        </div>
      )}

      {/* Register Modal */}
      {isRegisterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Register
            closeModal={() => setIsRegisterOpen(false)}
            switchToLogin={switchToLogin}
          />
        </div>
      )}
    </header>
  );
};

export default Header;