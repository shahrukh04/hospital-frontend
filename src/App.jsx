import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./Admin/Dashboard";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Sidebar from "./Admin/Sidebar/Sidebar";

import { AuthProvider } from "./context/AuthContext";
import Register from "./pages/Register";
import Login from "./pages/Login";
import LandingPage from "./pages/LandingPage/LandingPage";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    
  <AppRoutes/>
  );
};


export default App;
