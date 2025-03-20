import React from "react";
import { FaStar } from "react-icons/fa";

const Testimonials = () => {
  const testimonials = [
    {
      name: "John Doe",
      feedback: "Amazing service and caring doctors!",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    {
      name: "Jane Smith",
      feedback: "Best hospital experience I've ever had.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
    },
    {
      name: "Alice Johnson",
      feedback: "The staff was very professional and supportive.",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-8 bg-gradient-to-r from-blue-50 to-purple-50 mt-4">
      <div className="container mx-auto">
        <h2 className="text-3xl sm:text-4xl font-bold text-center mb-8 text-gray-800">What Our Patients Say</h2>
        <p className="text-lg sm:text-xl text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Hear from our patients about their experiences with our hospital. We are committed to providing the best care for you and your family.
        </p>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimony, index) => (
            <div
              key={index}
              className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">
                {/* Avatar */}
                <img
                  src={testimony.avatar}
                  alt={testimony.name}
                  className="w-16 h-16 rounded-full mb-4"
                />
                {/* Feedback */}
                <p className="text-gray-600 mb-4">"{testimony.feedback}"</p>
                {/* Rating */}
                <div className="flex mb-4">
                  {[...Array(testimony.rating)].map((_, i) => (
                    <FaStar key={i} className="w-5 h-5 text-yellow-400" />
                  ))}
                </div>
                {/* Name */}
                <h3 className="text-lg font-semibold text-gray-800">- {testimony.name}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Call-to-Action Button */}
        <div className="text-center mt-12">
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
            Share Your Feedback
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;