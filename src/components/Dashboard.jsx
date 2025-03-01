import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import HeroSection from "./HeroSection";
import Navbar from "./Navbar";
import LoadingSpinner from "./LoadingSpinner";
import ErrorAlert from "./ErrorAlert";
import { createAuthenticatedAPI, API_BASE_URL } from "../services/api";


const Dashboard = () => {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    medicinesCount: 0,
    doctorsCount: 0,
    prescriptionsCount: 0,
    patientsCount: 0,
    bedCount: 0,
    occupiedBeds: 0,
    lowStockMedicines: [],
    monthlyStats: [],
    distributionData: [],
    demographicsData: [],
    bedOccupancyData: [],
    financialData: [],
    criticalPatients: [],
    upcomingAppointments: [],
    emergencyAlerts: []
  });

  const prevTokenRef = useRef();
  const prevUserIdRef = useRef();

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const authenticatedAPI = createAuthenticatedAPI(token);

        const fetchData = async (url) => {
          try {
            const response = await authenticatedAPI.get(url);
            return response.data;
          } catch (err) {
            console.error(`Error fetching data from ${url}:`, err);
            return null;
          }
        };

        const [
          medicinesCountRes,
          doctorsCountRes,
          prescriptionsCountRes,
          patientsCountRes,
          bedCountRes,
          occupiedBedsRes,
          lowStockMedicinesRes,
          monthlyStatsRes,
          distributionDataRes,
          demographicsDataRes,
          bedOccupancyDataRes,
          financialDataRes,
          criticalPatientsRes,
          upcomingAppointmentsRes,
          emergencyAlertsRes
        ] = await Promise.all([
          fetchData(`${API_BASE_URL}/api/medicines/count`),
          fetchData(`${API_BASE_URL}/api/doctors/count`),
          fetchData(`${API_BASE_URL}/api/prescriptions/count`),
          fetchData(`${API_BASE_URL}/api/patients/count`),
          fetchData(`${API_BASE_URL}/api/beds/stats/total`),
          fetchData(`${API_BASE_URL}/api/beds/stats/occupied`),
          fetchData(`${API_BASE_URL}/api/medicines/low-stock`),
          fetchData(`${API_BASE_URL}/api/stats/monthly`),
          fetchData(`${API_BASE_URL}/api/stats/distribution`),
          fetchData(`${API_BASE_URL}/api/stats/demographics`),
          fetchData(`${API_BASE_URL}/api/stats/bed-occupancy`),
          fetchData(`${API_BASE_URL}/api/stats/financial`),
          fetchData(`${API_BASE_URL}/api/patients/critical`),
          fetchData(`${API_BASE_URL}/api/appointments/today`),
          fetchData(`${API_BASE_URL}/api/emergency/alerts`)
        ]);

        setDashboardData({
          medicinesCount: medicinesCountRes?.count || 0,
          doctorsCount: doctorsCountRes?.count || 0,
          prescriptionsCount: prescriptionsCountRes?.count || 0,
          patientsCount: patientsCountRes?.count || 0,
          bedCount: bedCountRes?.count || 0,
          occupiedBeds: occupiedBedsRes?.count || 0,
          lowStockMedicines: lowStockMedicinesRes || [],
          monthlyStats: Array.isArray(monthlyStatsRes) ? monthlyStatsRes : [],
          distributionData: Array.isArray(distributionDataRes) ? distributionDataRes : [],
          demographicsData: Array.isArray(demographicsDataRes) ? demographicsDataRes : [],
          bedOccupancyData: Array.isArray(bedOccupancyDataRes) ? bedOccupancyDataRes : [],
          financialData: Array.isArray(financialDataRes) ? financialDataRes : [],
          criticalPatients: Array.isArray(criticalPatientsRes) ? criticalPatientsRes : [],
          upcomingAppointments: Array.isArray(upcomingAppointmentsRes) ? upcomingAppointmentsRes : [],
          emergencyAlerts: Array.isArray(emergencyAlertsRes) ? emergencyAlertsRes : [],
      });

      } catch (err) {
        console.error("Dashboard data fetch error:", err);
        setError("There was a problem loading your dashboard data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const userId = user?.id;
    if (token && userId && (token !== prevTokenRef.current || userId !== prevUserIdRef.current)) {
      prevTokenRef.current = token;
      prevUserIdRef.current = userId;
      fetchDashboardData();
    }
  }, [user?.id, token]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner message="Loading dashboard data..." />
    </div>;
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center">
      <ErrorAlert message={error} />
    </div>;
  }

  return (
<div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <main className="flex-1 overflow-y-auto p-8">
          <HeroSection
            title={`Welcome back, ${user?.name || 'User'}!`}
            subtitle="Here's your hospital management dashboard overview"
            {...dashboardData}
          />

          {/* Stats Overview Section */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-gray-500 text-sm font-medium">Patients</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.patientsCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-gray-500 text-sm font-medium">Doctors</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.doctorsCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-gray-500 text-sm font-medium">Medicines</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.medicinesCount}</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
              <h3 className="text-gray-500 text-sm font-medium">Prescriptions</h3>
              <p className="text-3xl font-bold text-gray-900">{dashboardData.prescriptionsCount}</p>
            </div>
          </section>

          {/* Bed Management Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Bed Management</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Total Beds</h3>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.bedCount}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Occupied</h3>
                <p className="text-2xl font-bold text-gray-900">{dashboardData.occupiedBeds}</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Available</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.bedCount - dashboardData.occupiedBeds}
                </p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-gray-500 text-sm font-medium">Occupancy Rate</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardData.bedCount > 0
                    ? Math.round((dashboardData.occupiedBeds / dashboardData.bedCount) * 100)
                    : 0}%
                </p>
              </div>
            </div>
          </section>

          {/* Critical Patients Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Critical Patients</h2>
            {dashboardData.criticalPatients.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Age</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Room</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Condition</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.criticalPatients.map(patient => (
                      <tr key={patient.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.id}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.age}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.room}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.condition}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{patient.doctor}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                No critical patients at this time.
              </div>
            )}
          </section>

          {/* Low Stock Medicines Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Low Stock Medicines</h2>
            {dashboardData.lowStockMedicines.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Medicine</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Current Stock</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Minimum Required</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.lowStockMedicines.map(medicine => (
                      <tr key={medicine.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.currentStock}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{medicine.minimumRequired}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          medicine.currentStock < medicine.minimumRequired / 2
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}>
                          {medicine.currentStock < medicine.minimumRequired / 2 ? 'Critical' : 'Low'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                All medicines are well-stocked.
              </div>
            )}
          </section>

          {/* Upcoming Appointments Section */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Today's Appointments</h2>
            {dashboardData.upcomingAppointments.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Department</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {dashboardData.upcomingAppointments.map(appointment => (
                      <tr key={appointment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.time}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.patient}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.doctor}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{appointment.department}</td>
                        <td className={`px-6 py-4 whitespace-nowrap text-sm font-medium ${
                          appointment.status.toLowerCase() === 'completed'
                            ? 'text-green-600'
                            : appointment.status.toLowerCase() === 'pending'
                            ? 'text-yellow-600'
                            : 'text-blue-600'
                        }`}>
                          {appointment.status}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="bg-white p-6 rounded-lg shadow-sm text-center text-gray-500">
                No appointments scheduled for today.
              </div>
            )}
          </section>

          {/* Emergency Alerts Section */}
          {dashboardData.emergencyAlerts.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">Emergency Alerts</h2>
              <div className="grid grid-cols-1 gap-4">
                {dashboardData.emergencyAlerts.map(alert => (
                  <div key={alert.id} className={`p-4 rounded-lg shadow-sm ${
                    alert.severity === 'high'
                      ? 'bg-red-50 border-l-4 border-red-400'
                      : 'bg-yellow-50 border-l-4 border-yellow-400'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{alert.title}</h4>
                        <p className="mt-1 text-sm text-gray-600">{alert.message}</p>
                        <small className="text-xs text-gray-500">Reported: {alert.timestamp}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
    </div>
  );
};

export default Dashboard;