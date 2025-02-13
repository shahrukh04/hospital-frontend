import React from "react";

const Hero = () => {
  return (
    <section className="relative bg-cover bg-center h-screen flex flex-col items-center justify-center text-white text-center">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 bg-[url('https://www.asterhospitals.in/sites/default/files/styles/webp/public/2021-01/about-us-new.jpg.webp?itok=WCVIH3LP')] bg-cover bg-center">
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/30"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-4">
          Your Health, Our Priority
        </h2>
        <p className="text-lg sm:text-xl md:text-2xl max-w-2xl mx-auto mb-8">
          We provide top-notch healthcare services with the latest technology and expert doctors.
        </p>

        {/* Call-to-Action Button */}
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition duration-300 transform hover:scale-105">
          Book an Appointment
        </button>
      </div>

      {/* Statistics Section */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/10 backdrop-blur-sm py-6">
        <div className="container mx-auto grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">500+</h3>
            <p className="text-sm sm:text-base">Patients Daily</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">100+</h3>
            <p className="text-sm sm:text-base">Expert Doctors</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">24/7</h3>
            <p className="text-sm sm:text-base">Emergency Services</p>
          </div>
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold">95%</h3>
            <p className="text-sm sm:text-base">Patient Satisfaction</p>
          </div>
        </div>
      </div>

      {/* Services Section */}
      <div className="absolute bottom-20 left-0 right-0 hidden sm:block">
        <div className="container mx-auto grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Emergency Care</h3>
            <p className="text-sm">24/7 emergency services</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Online Consultations</h3>
            <p className="text-sm">Consult doctors online</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Advanced Diagnostics</h3>
            <p className="text-sm">State-of-the-art labs</p>
          </div>
          <div className="bg-white/10 backdrop-blur-sm p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Health Checkups</h3>
            <p className="text-sm">Comprehensive packages</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;