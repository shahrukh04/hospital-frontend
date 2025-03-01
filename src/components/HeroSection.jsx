import React, { useState } from "react";
import PropTypes from "prop-types";
import MonthlyPrescriptionsChart from "./MonthlyPrescriptionsChart";
import SpecializationDistributionChart from "./SpecializationDistributionChart";
import PatientDemographicsChart from "./PatientDemographicsChart";
import BedOccupancyChart from "./BedOccupancyChart";
import RevenueExpensesChart from "./RevenueExpensesChart";
import ChartCard from "./ChartCard";
import AlertBanner from "./AlertBanner";
import StatsCard from "./StatsCard";
import {
  ChartBarIcon,
  UsersIcon,
  BriefcaseIcon,
  BeakerIcon,
  ClipboardDocumentListIcon,
  UserGroupIcon,
  BanknotesIcon,
  BellAlertIcon,
  ArrowTrendingUpIcon
} from "@heroicons/react/24/outline";
import AdComponent from "./AdComponent";
import EmergencyAlerts from "./EmergencyAlerts";
import UpcomingAppointments from "./UpcomingAppointments";

/**
 * HeroSection Component
 *
 * The HeroSection component serves as a vital part of the hospital management system's dashboard.
 * This component displays an overview of key hospital data, including total medicines, total doctors,
 * total prescriptions, and medicines with low stock, patient statistics, bed occupancy, and financial metrics.
 *
 * It integrates multiple charts for comprehensive hospital data visualization:
 * 1. MonthlyPrescriptionsChart - Displays the number of prescriptions issued each month.
 * 2. SpecializationDistributionChart - Provides a visual breakdown of doctors' specializations within the hospital.
 * 3. PatientDemographicsChart - Shows patient distribution by age, gender, and other demographics.
 * 4. BedOccupancyChart - Displays current bed occupancy rates across different departments.
 * 5. RevenueExpensesChart - Tracks financial performance of the hospital over time.
 *
 * By providing quick insights into these critical data points, hospital administrators can make
 * informed decisions and maintain better control over hospital operations.
 *
 * @param {Object} props - Component props.
 * @param {Array} props.monthlyStats - Data for monthly prescriptions chart.
 * @param {Array} props.distributionData - Data for specialization distribution chart.
 * @param {Array} props.demographicsData - Data for patient demographics chart.
 * @param {Array} props.bedOccupancyData - Data for bed occupancy chart.
 * @param {Array} props.financialData - Data for revenue and expenses chart.
 * @param {number} props.medicinesCount - Total count of medicines available.
 * @param {number} props.doctorsCount - Total count of doctors.
 * @param {number} props.prescriptionsCount - Total count of prescriptions issued.
 * @param {number} props.patientsCount - Total count of registered patients.
 * @param {number} props.bedCount - Total count of hospital beds.
 * @param {number} props.occupiedBeds - Count of currently occupied beds.
 * @param {Array} props.lowStockMedicines - List of medicines with stock lower than 10 units.
 * @param {Array} props.criticalPatients - List of patients in critical condition requiring attention.
 * @param {Array} props.upcomingAppointments - List of upcoming appointments for the day.
 * @param {Array} props.emergencyAlerts - List of emergency alerts and notifications.
 *
 * @returns {JSX.Element} React component rendering hospital dashboard overview and charts.
 */
const HeroSection = ({
  monthlyStats,
  distributionData,
  demographicsData,
  bedOccupancyData,
  financialData,
  medicinesCount,
  doctorsCount,
  prescriptionsCount,
  patientsCount = 0,
  bedCount = 0,
  occupiedBeds = 0,
  lowStockMedicines,
  criticalPatients = [],
  upcomingAppointments = [],
  emergencyAlerts = []
}) => {
  const [activeView, setActiveView] = useState("overview");

  // Calculate bed occupancy percentage
  const bedOccupancyPercentage = bedCount > 0 ? Math.round((occupiedBeds / bedCount) * 100) : 0;

  // Determine occupancy status color
  const getOccupancyStatusColor = (percentage) => {
    if (percentage < 70) return "text-green-600";
    if (percentage < 90) return "text-yellow-600";
    return "text-red-600";
  };

  const occupancyStatusColor = getOccupancyStatusColor(bedOccupancyPercentage);

  const formatMonthlyStats = (monthlyStats) => ({
    labels: monthlyStats.map(item => item.month),
    datasets: [
        {
            label: 'Monthly Prescriptions',
            data: monthlyStats.map(item => item.count),
            backgroundColor: 'rgba(59, 130, 246, 0.5)',
            borderColor: 'rgba(59, 130, 246, 1)',
            fill: true,
            tension: 0.4
        }
    ]
});


  return (
    <div className="space-y-6">
      {/* Navigation Tabs */}
      <div className="flex border-b border-gray-200 mb-4">
        <button
          className={`px-4 py-2 font-medium ${activeView === "overview" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveView("overview")}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeView === "patients" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveView("patients")}
        >
          Patients
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeView === "resources" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveView("resources")}
        >
          Resources
        </button>
        <button
          className={`px-4 py-2 font-medium ${activeView === "finance" ? "border-b-2 border-blue-600 text-blue-600" : "text-gray-500"}`}
          onClick={() => setActiveView("finance")}
        >
          Finance
        </button>
      </div>

      {/* Emergency Alerts Banner - Always visible on top */}
      {emergencyAlerts && emergencyAlerts.length > 0 && (
        <AlertBanner
          alerts={emergencyAlerts}
          title="Emergency Alerts"
          icon={<BellAlertIcon className="h-5 w-5 text-white" />}
        />
      )}

      {activeView === "overview" && (
        <>
          {/* Top Stats Cards - Display key statistics about hospital assets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <StatsCard
              title="Total Patients"
              value={patientsCount}
              icon={<UserGroupIcon className="h-6 w-6" />}
              colorClass="text-blue-600"
              bgColorClass="bg-blue-100"
            />

            <StatsCard
              title="Total Doctors"
              value={doctorsCount}
              icon={<BriefcaseIcon className="h-6 w-6" />}
              colorClass="text-green-600"
              bgColorClass="bg-green-100"
            />

            <StatsCard
              title="Total Prescriptions"
              value={prescriptionsCount}
              icon={<ClipboardDocumentListIcon className="h-6 w-6" />}
              colorClass="text-purple-600"
              bgColorClass="bg-purple-100"
            />

            <StatsCard
              title="Total Medicines"
              value={medicinesCount}
              icon={<BeakerIcon className="h-6 w-6" />}
              colorClass="text-indigo-600"
              bgColorClass="bg-indigo-100"
            />
          </div>

          {/* Second Row Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Bed Occupancy Card */}
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold">Bed Occupancy</h3>
                <span className={`font-bold ${occupancyStatusColor}`}>{bedOccupancyPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    bedOccupancyPercentage < 70 ? "bg-green-600" :
                    bedOccupancyPercentage < 90 ? "bg-yellow-500" : "bg-red-600"
                  }`}
                  style={{ width: `${bedOccupancyPercentage}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{occupiedBeds} of {bedCount} beds occupied</p>
            </div>

            {/* Critical Patients Card */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Critical Patients</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-red-600 mr-2">{criticalPatients.length}</span>
                <span className="text-sm text-gray-500">Requiring immediate attention</span>
              </div>
              {criticalPatients.length > 0 && (
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  View details
                </button>
              )}
            </div>

            {/* Low Stock Medicines Card */}
            <div className="bg-white shadow rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Low Stock Medicines</h3>
              <div className="flex items-center">
                <span className="text-3xl font-bold text-amber-600 mr-2">{lowStockMedicines?.length ?? 0}</span>
                <span className="text-sm text-gray-500">Items below threshold</span>
              </div>
              {lowStockMedicines && lowStockMedicines.length > 0 && (
                <button className="mt-2 text-sm text-blue-600 hover:underline">
                  View inventory
                </button>
              )}
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Monthly Prescriptions Chart Section */}
            <ChartCard
              title="Monthly Prescriptions"
              icon={<ChartBarIcon className="h-5 w-5 text-blue-600" />}
            >
<MonthlyPrescriptionsChart data={formatMonthlyStats(monthlyStats)} />

            </ChartCard>

            {/* Specialization Distribution Chart Section */}
            <ChartCard
              title="Specialization Distribution"
              icon={<UsersIcon className="h-5 w-5 text-purple-600" />}
            >
              <SpecializationDistributionChart data={distributionData} />
            </ChartCard>
          </div>

          {/* Appointments and Alerts Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <UpcomingAppointments appointments={upcomingAppointments} />
            <EmergencyAlerts alerts={emergencyAlerts} />
          </div>
        </>
      )}

      {activeView === "patients" && (
        <>
          {/* Patient Demographics Chart */}
          <ChartCard
            title="Patient Demographics"
            icon={<UserGroupIcon className="h-5 w-5 text-blue-600" />}
          >
            <PatientDemographicsChart data={demographicsData} />
          </ChartCard>

          {/* Critical Patients List */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Critical Patients Monitor</h3>
            {criticalPatients && criticalPatients.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {criticalPatients.map((patient) => (
                      <tr key={patient?.id || Math.random()}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {patient?.patientId || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient?.name || "Unknown"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient?.department || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {patient?.status || "Critical"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {patient?.doctorName || "Unassigned"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">View</button>
                          <button className="text-red-600 hover:text-red-900">Alert</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No critical patients at this time.</p>
            )}
          </div>
        </>
      )}

      {activeView === "resources" && (
        <>
          {/* Bed Occupancy Chart */}
          <ChartCard
            title="Bed Occupancy by Department"
            icon={<BellAlertIcon className="h-5 w-5 text-blue-600" />}
          >
            <BedOccupancyChart data={bedOccupancyData} />
          </ChartCard>

          {/* Low Stock Medicines Detailed List */}
          <div className="bg-white shadow rounded-lg p-4">
            <h3 className="text-lg font-semibold mb-2">Low Stock Medicines (Qty &lt; 10)</h3>
            {lowStockMedicines && lowStockMedicines.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Medicine ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Current Stock
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reorder Level
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {lowStockMedicines.map((med) => (
                      <tr key={med?._id ?? med?.id ?? Math.random()}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {med?.id || "N/A"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {med?.name ?? "Unknown Medicine"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {med?.category || "Uncategorized"}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                            {med?.stock ?? "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {med?.reorderLevel || 10}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button className="text-indigo-600 hover:text-indigo-900 mr-3">Reorder</button>
                          <button className="text-blue-600 hover:text-blue-900">Edit</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-gray-500">No low stock medicines currently identified.</p>
            )}
          </div>
        </>
      )}

      {activeView === "finance" && (
        <>
          {/* Revenue vs Expenses Chart */}
          <ChartCard
            title="Revenue vs Expenses"
            icon={<BanknotesIcon className="h-5 w-5 text-green-600" />}
          >
            <RevenueExpensesChart data={financialData} />
          </ChartCard>

          {/* Financial KPIs */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600 mr-4">
                  <BanknotesIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Monthly Revenue</p>
                  <h3 className="text-lg font-semibold">$124,500.00</h3>
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +12.5% from last month
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 text-purple-600 mr-4">
                  <UsersIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Avg. Revenue per Patient</p>
                  <h3 className="text-lg font-semibold">$750.00</h3>
                  <p className="text-xs text-green-600 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1" />
                    +3.2% from last month
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white shadow rounded-lg p-4">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600 mr-4">
                  <ChartBarIcon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-gray-500">Operating Margin</p>
                  <h3 className="text-lg font-semibold">22.4%</h3>
                  <p className="text-xs text-red-600 flex items-center">
                    <ArrowTrendingUpIcon className="h-3 w-3 mr-1 rotate-180" />
                    -1.8% from last month
                  </p>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Advertisement Component - Can be positioned strategically based on requirements */}
      <AdComponent/>
    </div>
  );
};

HeroSection.propTypes = {
  monthlyStats: PropTypes.array.isRequired, // Monthly prescription data
  distributionData: PropTypes.array.isRequired, // Distribution data showing specialization distribution
  demographicsData: PropTypes.array, // Patient demographics data
  bedOccupancyData: PropTypes.array, // Bed occupancy data by department
  financialData: PropTypes.array, // Financial data for revenue and expenses
  medicinesCount: PropTypes.number.isRequired, // Total number of medicines
  doctorsCount: PropTypes.number.isRequired, // Total number of doctors
  prescriptionsCount: PropTypes.number.isRequired, // Total number of prescriptions
  patientsCount: PropTypes.number, // Total number of patients
  bedCount: PropTypes.number, // Total number of beds
  occupiedBeds: PropTypes.number, // Number of occupied beds
  lowStockMedicines: PropTypes.array.isRequired, // List of medicines with stock < 10
  criticalPatients: PropTypes.array, // List of patients in critical condition
  upcomingAppointments: PropTypes.array, // List of upcoming appointments
  emergencyAlerts: PropTypes.array // List of emergency alerts
};

export default HeroSection;