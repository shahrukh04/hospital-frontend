import React from 'react';
import { Routes, Route } from "react-router-dom";
// import HeroSection from "../components/HeroSection";
import Dashboard from "../Admin/Dashboard";
import ChatRoom from "../Admin/Chat/ChatRoom";
import Medicines from "../Admin/Medicines";
import Doctors from "../Admin/Doctors";
import PrescriptionList from "../Admin/PrescriptionList";
import PrescriptionForm from "../Admin/PrescriptionForm";
import Staff from "../Admin/Staff";
import Appointment from "../Admin/Appointment";
import Bed from "../Admin/Bed";
import Bill from "../Admin/Bill";
import Consultation from "../Admin/Consultation";
import DemographicsStats from "../Admin/DemographicsStats";
import DistributionStats from "../Admin/DistributionStats";
import Emergency from "../Admin/Emergency";
import Equipment from "../Admin/Equipment";
import FinancialStats from "../Admin/FinancialStats";
import LabTest from "../Admin/LabTest";
import PerformanceMetrics from "../Admin/PerformanceMetrics";
import Report from "../Admin/Report";
import Room from "../Admin/Room";
import User from "../Admin/User";
import PatientModel from "../Admin/PatientModel";
import Department from "@/Admin/Department";

const SidebarRouter = () => {
  return (
    <Routes>
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="medicines" element={<Medicines />} />
      <Route path="doctors" element={<Doctors />} />
      <Route path="PrescriptionList" element={<PrescriptionList />} />
      <Route path="create" element={<PrescriptionForm />} />
      <Route path="Appointment" element={<Appointment />} />
      <Route path="Bed" element={<Bed />} />
      <Route path="Bill" element={<Bill />} />
      <Route path="Consultation" element={<Consultation />} />
      <Route path="DemographicsStats" element={<DemographicsStats />} />
      <Route path="Department" element={<Department />} />
      <Route path="DistributionStats" element={<DistributionStats />} />
      <Route path="Emergency" element={<Emergency />} />
      <Route path="Equipment" element={<Equipment />} />
      <Route path="FinancialStats" element={<FinancialStats />} />
      <Route path="LabTest" element={<LabTest />} />
      <Route path="patientModel" element={<PatientModel />} />
      <Route path="PerformanceMetrics" element={<PerformanceMetrics />} />
      <Route path="Report" element={<Report />} />
      <Route path="Room" element={<Room />} />
      <Route path="User" element={<User />} />
      <Route path="ChatRoom" element={<ChatRoom />} />
      <Route path="Staff" element={<Staff/>} />
    </Routes>
  );
};

export default SidebarRouter;