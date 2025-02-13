// src/components/Footer.jsx
import React from "react";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-blue-900 to-purple-900 text-white text-center py-12">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div>
            <h4 className="text-xl font-bold mb-4">About Us</h4>
            <p className="text-gray-300 mb-6">
              Our hospital is dedicated to providing world-class medical services with a patient-centric approach.
            </p>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Quick Links</h4>
            <ul className="text-gray-300 mb-6">
              <li className="mb-2">
                <a href="#" className="hover:text-white transition duration-300">
                  Home
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-white transition duration-300">
                  About Us
                </a>
              </li>
              <li className="mb-2">
                <a href="#" className="hover:text-white transition duration-300">
                  Contact Us
                </a>
              </li>
            </ul>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Follow Us</h4>
            <div className="flex justify-center mb-6">
              <a href="#" className="mr-4 text-gray-300 hover:text-white transition duration-300">
                <FaFacebook className="w-6 h-6" />
              </a>
              <a href="#" className="mr-4 text-gray-300 hover:text-white transition duration-300">
                <FaTwitter className="w-6 h-6" />
              </a>
              <a href="#" className="mr-4 text-gray-300 hover:text-white transition duration-300">
                <FaInstagram className="w-6 h-6" />
              </a>
              <a href="#" className="text-gray-300 hover:text-white transition duration-300">
                <FaLinkedin className="w-6 h-6" />
              </a>
            </div>
          </div>
          <div>
            <h4 className="text-xl font-bold mb-4">Contact Information</h4>
            <p className="text-gray-300 mb-6">
              Phone: (123) 456-7890
              <br />
              Email: <a href="#" className="hover:text-white transition duration-300">contact@hospital.com</a>
            </p>
          </div>
        </div>
        <p className="text-gray-300 mt-8">&copy; 2025 Hospital Management System. All rights reserved.</p>
        <p className="text-gray-300 mt-2">
          Designed and Developed by <a href="#" className="hover:text-white transition duration-300">SRK Limited</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;