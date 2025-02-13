import React from "react";
import { FaStethoscope, FaHeartbeat, FaUsers } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-50 to-purple-50 mt-4">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">About Us</h2>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Our hospital is dedicated to providing world-class medical services with a patient-centric approach. Learn more about our mission, values, and team.
        </p>

        {/* About Us Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <FaStethoscope className="w-12 h-12 mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h3>
              <p className="text-gray-600 mb-4">
                To provide compassionate, high-quality healthcare services to our patients and community.
              </p>
            </div>
          </div>

          <div
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <FaHeartbeat className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Values</h3>
              <p className="text-gray-600 mb-4">
                We value excellence, compassion, integrity, and teamwork in everything we do.
              </p>
            </div>
          </div>

          <div
            className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
          >
            <div className="flex flex-col items-center text-center">
              <FaUsers className="w-12 h-12 mb-4 text-red-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Team</h3>
              <p className="text-gray-600 mb-4">
                Meet our team of experienced healthcare professionals dedicated to providing exceptional care.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;