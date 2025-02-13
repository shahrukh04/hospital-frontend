import React from "react";
import { FaHeart, FaBrain, FaBone, FaChild, FaClinicMedical, FaAllergies } from "react-icons/fa";

const Services = () => {
  const services = [
    {
      name: "Cardiology",
      icon: <FaHeart className="w-12 h-12 mb-4 text-blue-600" />,
      description: "Comprehensive heart care with advanced diagnostics and treatments.",
    },
    {
      name: "Neurology",
      icon: <FaBrain className="w-12 h-12 mb-4 text-green-600" />,
      description: "Expert care for brain and nervous system disorders.",
    },
    {
      name: "Orthopedics",
      icon: <FaBone className="w-12 h-12 mb-4 text-purple-600" />,
      description: "Specialized treatments for bones, joints, and muscles.",
    },
    {
      name: "Pediatrics",
      icon: <FaChild className="w-12 h-12 mb-4 text-pink-600" />,
      description: "Compassionate care for children's health and development.",
    },
    {
      name: "General Surgery",
      icon: <FaClinicMedical className="w-12 h-12 mb-4 text-red-600" />,
      description: "Advanced surgical procedures for various health conditions.",
    },
    {
      name: "Dermatology",
      icon: <FaAllergies className="w-12 h-12 mb-4 text-yellow-600" />,
      description: "Skin care and treatment for dermatological conditions.",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-50 to-purple-50">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">Our Services</h2>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          We offer a wide range of medical services to meet your healthcare needs. Our expert team is dedicated to providing the best care for you and your family.
        </p>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                {service.icon}
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition duration-300">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Testimonials Section */}
      
      </div>
    </section>
  );
};

export default Services;