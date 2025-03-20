import React from "react";
import { FaPhone, FaEnvelope, FaMapMarkerAlt } from "react-icons/fa";

const Contact = () => {
  return (
    <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-50 to-purple-50 mt-4">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">
          Get in Touch
        </h2>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Have a question or need help? Contact us today!
        </p>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaPhone className="w-12 h-12 mb-4 text-blue-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Phone</h3>
              <p className="text-gray-600 mb-4">(123) 456-7890</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaEnvelope className="w-12 h-12 mb-4 text-green-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Email</h3>
              <p className="text-gray-600 mb-4">contact@hospital.com</p>
            </div>
          </div>

          <div className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105">
            <div className="flex flex-col items-center text-center">
              <FaMapMarkerAlt className="w-12 h-12 mb-4 text-red-600" />
              <h3 className="text-2xl font-semibold text-gray-800 mb-2">Address</h3>
              <p className="text-gray-600 mb-4">123 Hospital Drive, Anytown, USA</p>
            </div>
          </div>
        </div>

        {/* Contact Form */}
        <div className="mt-12">
          <h3 className="text-2xl font-semibold text-gray-800 mb-4">Send us a message</h3>
          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="sr-only">Name</label>
                <input
                  id="name"
                  type="text"
                  placeholder="Name"
                  className="w-full p-4 border border-gray-200 rounded-lg"
                />
              </div>

              <div>
                <label htmlFor="email" className="sr-only">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Email"
                  className="w-full p-4 border border-gray-200 rounded-lg"
                />
              </div>

              <div className="sm:col-span-2">
                <label htmlFor="message" className="sr-only">Message</label>
                <textarea
                  id="message"
                  placeholder="Message"
                  className="w-full p-4 border border-gray-200 rounded-lg"
                />
              </div>
            </div>

            <div className="text-center sm:text-left">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300"
              >
                Send Message
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};

export default Contact;
