import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
// Import icons from react-icons
import { 
  MdDashboard,
  MdMedication,
  MdPersonSearch,
  MdAssignment,
  MdAdd,
  MdCalendarToday,
  MdBed,
  MdReceipt,
  MdForum,
  MdPieChart,
  MdBarChart,
  MdEmergency,
  MdBiotech,
  MdMonetizationOn,
  MdScience,
  MdPerson,
  MdSpeed,
  MdDescription,
  MdMeetingRoom,
  MdPeople,
  MdChat,
  MdSupervisorAccount,
  MdHome,
} from 'react-icons/md';
import {
  Bars3Icon,
  XMarkIcon,
  UserCircleIcon,
  ArrowRightOnRectangleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import SidebarRouter from "../../routes/SidebarRoutes";

const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { logout, user } = useAuth(); // Use the logout function and user from AuthContext
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = () => {
    logout(); // Use the logout function from AuthContext
    navigate('/'); // Navigate to login page after logout
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 ${
             isSidebarOpen ? "w-48 md:w-52" : "w-16"
        } bg-white shadow-xl transform transition-all duration-300 ease-in-out md:w-16 flex flex-col overflow-hidden`}
      >
        {/* Sidebar Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <div className="flex items-center space-x-2">
            <div className="h-10 w-10 bg-gradient-to-r from-indigo-600 to-blue-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">H</span>
            </div>
            {isSidebarOpen && (
              <div>
                <span className="text-xl font-bold text-gray-800">Hospitalpro</span>
                <span className="text-xs block text-gray-500">Management</span>
              </div>
            )}
          </div>
          {/* Sidebar Toggle Button (Visible on Mobile and Desktop) */}
          <button
            onClick={toggleSidebar}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
            aria-label="Toggle Sidebar"
          >
            {isSidebarOpen ? (
              <XMarkIcon className="h-6 w-6 text-gray-600" />
            ) : (
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            )}
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <nav className=" space-y-1 mt-4 flex-1 overflow-y-auto">
          <Link
            to="/Sidebar/dashboard"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdDashboard color="#4285F4" className="h-5 w-5 text-blue-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Dashboard</span>}
          </Link>
          <Link
            to="/Sidebar/medicines"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdMedication color="#0F9D58" className="h-5 w-5 text-green-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Medicines</span>}
          </Link>
          <Link
            to="/Sidebar/doctors"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdPersonSearch color="#4285F4" className="h-5 w-5 text-purple-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Doctors</span>}
          </Link>
          <Link
            to="/Sidebar/PrescriptionList"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdAssignment color="#DB4437" className="h-5 w-5 text-orange-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Prescriptions</span>}
          </Link>
          <Link
            to="/Sidebar/create"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdAdd color="#0F9D58" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Create Prescription</span>}
          </Link>

          {/* <Link
            to="/Sidebar/Chat"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <ChatBubbleLeftRightIcon className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Chat</span>}
          </Link> */}

          <Link
            to="/Sidebar/Bed"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdBed color="#4285F4" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Bed</span>}
          </Link>
          <Link
            to="/Sidebar/Bill"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdReceipt color="#DB4437" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Bill</span>}
          </Link>
          <Link
            to="/Sidebar/Consultation"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdForum color="#0F9D58" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Consultation</span>}
          </Link>
          <Link
            to="/Sidebar/DemographicsStats"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdPieChart color="#F4B400" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Demographics Stats</span>}
          </Link>
          <Link
            to="/Sidebar/Department"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdHome color="#DB4437" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Department</span>}
          </Link>
          <Link
            to="/Sidebar/DistributionStats"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdBarChart color="#4285F4" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Distribution Stats</span>}
          </Link>
          <Link
            to="/Sidebar/Emergency"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdEmergency color="#DB4437" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Emergency</span>}
          </Link>
          <Link
            to="/Sidebar/Equipment"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdBiotech color="#0F9D58" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Equipment</span>}
          </Link>
          <Link
            to="/Sidebar/FinancialStats"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdMonetizationOn color="#F4B400" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Financial Stats</span>}
          </Link>
          <Link
            to="/Sidebar/LabTest"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdScience color="#4285F4" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Lab Test</span>}
          </Link>
          <Link
            to="/Sidebar/patientModel"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdPerson color="#DB4437" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">patient Model</span>}
          </Link>
          <Link
            to="/Sidebar/PerformanceMetrics"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdSpeed color="#0F9D58" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Performance Metrics</span>}
          </Link>
          <Link
            to="/Sidebar/Report"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdDescription color="#F4B400" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Report</span>}
          </Link>
          <Link
            to="/Sidebar/Room"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdMeetingRoom color="#4285F4" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Room</span>}
          </Link>
          <Link
            to="/Sidebar/User"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdPeople color="#DB4437" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">User</span>}
          </Link>
          <Link
            to="/Sidebar/ChatRoom"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdChat color="#0F9D58" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Chat Room</span>}
          </Link>
          <Link
            to="/Sidebar/Staff"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdSupervisorAccount color="#F4B400" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Staff</span>}
          </Link>
          <Link
            to="/Sidebar/Appointment"
            className="flex items-center px-4 py-3 text-gray-700 transition-all duration-200 rounded-xl hover:bg-gray-100 group no-underline"
          >
            <MdCalendarToday color="#F4B400" className="h-5 w-5 text-indigo-500" />
            {isSidebarOpen && <span className="ml-3 text-sm font-medium">Appointment</span>}
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-gray-700 rounded-xl hover:bg-red-50 hover:text-red-600 transition-all duration-200"
          >
            <ArrowRightOnRectangleIcon className="h-5 w-5 text-red-600" />
            {isSidebarOpen && <span className="ml-3">Logout</span>}
          </button>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          isSidebarOpen ? "ml-48" : "ml-16"
        }`}
      >
        {/* Header */}
        <header className="h-16 bg-white shadow-md fixed top-0 right-0 left-0 z-10 flex items-center px-6">
          <div className="flex items-center justify-between w-full">
            {/* Sidebar Toggle Button (Visible on Mobile and Desktop) */}
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-xl hover:bg-gray-100 transition duration-200 focus:outline-none focus:ring-2 focus:ring-gray-200"
              aria-label="Toggle Sidebar"
            >
              <Bars3Icon className="h-6 w-6 text-gray-600" />
            </button>

            {/* Center Title */}
            <h1 className="text-2xl font-bold text-gray-800">Hospital Management</h1>

            {/* Right Section - Settings & Profile */}
            <div className="flex items-center space-x-4">
              {/* Settings Button */}
              <button className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 transition duration-200">
                <Cog6ToothIcon className="h-6 w-6" />
              </button>

              {/* User Profile */}
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 bg-gray-100 rounded-xl hover:bg-gray-200 transition duration-200">
                  <UserCircleIcon className="h-6 w-6 text-gray-600" />
                  <span className="text-sm font-medium text-gray-700 hidden md:inline">{user?.username || 'Admin'}</span>
                </button>

                {/* Dropdown Menu */}
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-lg p-2 hidden group-hover:block">
                  <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Profile
                  </a>
                  <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
                    Settings
                  </a>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-100 rounded"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>
    

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto pt-16">
          <div className="p-2">
            {/* Use the new SidebarRouter component */}
            <SidebarRouter />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Sidebar;