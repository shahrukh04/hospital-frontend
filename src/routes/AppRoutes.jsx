import React from 'react';
import Home from "../components/Home";
import AboutUs from '../components/AboutUs';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "../Admin/Sidebar/Sidebar";
import { AuthProvider } from "../context/AuthContext";
import Register from "../pages/Register";
import Login from "../pages/Login";
import LandingPage from "../pages/LandingPage/LandingPage";
import Header from '../components/Header';
// Component to conditionally render Header
const Layout = ({ children }) => {
  const location = useLocation();
  const isSidebarRoute = location.pathname.startsWith('/Sidebar');
  return (
    <>
      {!isSidebarRoute && <Header />}
      {children}
    </>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <AuthProvider>
        <ToastContainer />
        <Layout>
          <Routes>
            <Route path="/Sidebar/*" element={<Sidebar />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<LandingPage />} />
            <Route path="/Home" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/services" element={<Services />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default AppRoutes;