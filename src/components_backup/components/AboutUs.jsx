import React from "react";
import { FaStethoscope, FaHeartbeat, FaUsers } from "react-icons/fa";

const AboutUs = () => {
  return (
    <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-50 to-purple-50 mt-4 pb-16">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          About Us
        </h2>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Welcome to <strong>Our Hospital</strong>, where compassionate care meets medical excellence. Our team of dedicated healthcare professionals works tirelessly to ensure the health and well-being of every patient. With modern facilities, experienced doctors, and a patient-first approach, we are committed to delivering comprehensive healthcare services to our community.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <FaStethoscope className="w-12 h-12 sm:w-14 sm:h-14 mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Mission</h3>
              <p className="text-gray-600">
                To provide compassionate, high-quality healthcare services that enhance the quality of life for our patients and community.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <FaHeartbeat className="w-12 h-12 sm:w-14 sm:h-14 mb-4 text-green-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Values</h3>
              <p className="text-gray-600">
                Our core values include compassion, excellence, integrity, innovation, and teamwork — all focused on improving patient outcomes.
              </p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-transform duration-300 transform hover:scale-105 animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <FaUsers className="w-12 h-12 sm:w-14 sm:h-14 mb-4 text-red-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Our Team</h3>
              <p className="text-gray-600">
                Our dedicated team of doctors, nurses, and staff bring decades of expertise and are committed to personalized patient care.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-16 text-gray-700 max-w-4xl mx-auto leading-relaxed space-y-4">
          <h3 className="text-2xl font-semibold text-center mb-4">Why Choose Us?</h3>
          <p>
            At Our Hospital, we understand that healthcare is not just about treating illnesses, but about building relationships and fostering trust with our patients. Our hospital is equipped with state-of-the-art technology, modern diagnostic tools, and world-class facilities to ensure accurate diagnoses and effective treatments.
          </p>
          <p>
            From routine health check-ups to advanced surgeries, we offer a wide range of medical services under one roof. Our specialties include cardiology, orthopedics, pediatrics, gynecology, neurology, and more. We take pride in our patient-centric approach, ensuring that every patient receives personalized care tailored to their specific needs.
          </p>
          <p>
            Our community outreach programs focus on health awareness, preventive care, and education, empowering individuals to take charge of their health. As a trusted healthcare provider, we aim to make a positive impact on the health and well-being of our community.
          </p>
          <p className="text-center font-semibold text-lg mt-6">
            Your Health, Our Priority.
          </p>
          <div className="text-center mt-4">
            <a href="/contact" className="inline-block bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
