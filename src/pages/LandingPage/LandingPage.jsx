import React, { useState } from "react";
import Header from "../../components/Header";
import Hero from "../../components/Hero";
import AboutUs from "../../components/AboutUs";
import Services from "../../components/Services";
import Testimonials from "../../components/Testimonials";
import Contact from "../../components/Contact";
import Footer from "../../components/Footer";

const LandingPage = () => {
  const [userId, setUserId] = useState(null);

  return (
    <div>
     <Header setUserId={setUserId} />
      <Hero />
      <Services />
      <Testimonials />
      <Contact />
      <AboutUs />
      <Footer />
    </div>
  );
};

export default LandingPage;
