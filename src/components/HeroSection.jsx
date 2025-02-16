import React, { useEffect, useState } from "react";
import PropTypes from 'prop-types';
import { Line, Doughnut } from "react-chartjs-2";
import {
  BeakerIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  UserPlusIcon,
  UsersIcon,
  AdjustmentsHorizontalIcon,
  ChartBarIcon,
} from "@heroicons/react/24/outline";
import CountUp from "react-countup";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { api } from "../services/api";
// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);
export const HeroSection = () => {
  const [totalMedicines, setTotalMedicines] = useState(0);
  const [totalDoctors, setTotalDoctors] = useState(0);
  const [totalPrescriptions, setTotalPrescriptions] = useState(0);
  const [monthlyStats, setMonthlyStats] = useState({
    labels: [],
    datasets: [],
  });
  const [distributionData, setDistributionData] = useState({
    labels: [],
    datasets: [],
  });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [medicinesResponse, doctorsResponse, prescriptionsResponse] =
          await Promise.all([
            api.getAllMedicines(),
            api.getAllDoctors(),
            api.getAllPrescriptions(),
          ]);

        setTotalMedicines(medicinesResponse.data.length);
        setTotalDoctors(doctorsResponse.data.length);
        setTotalPrescriptions(prescriptionsResponse.data.length);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
    fetchMonthlyStats();
    fetchDistributionData();
  }, []);
  const fetchMonthlyStats = async () => {
    try {
      const response = await api.getMonthlyStats();
      setMonthlyStats(response.data);
    } catch (error) {
      console.error("Failed to fetch monthly stats:", error);
    }
  };
  const fetchDistributionData = async () => {
    try {
      const response = await api.getDistributionData();
      setDistributionData(response.data);
    } catch (error) {
      console.error("Failed to fetch distribution data:", error);
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Banner */}
      <div className="relative w-full h-screen overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-blue-500 to-purple-600">
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] mix-blend-overlay" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-purple-600/20 animate-pulse" />
        </div>

        {/* Content Section */}
        <div className="relative flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 sm:mb-6 tracking-tight">
              Hospital Management System
              <span className="block text-base sm:text-lg font-normal mt-2 sm:mt-3 text-blue-100">
                Streamlining Healthcare Operations
              </span>
            </h1>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto mt-8 sm:mt-12">
              <StatCard
                icon={<BeakerIcon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />}
                value={totalMedicines}
                label="Medicines"
                trend="12% increase"
                trendIcon={<ArrowTrendingUpIcon className="h-4 w-4" />}
              />

              <StatCard
                icon={<UsersIcon className="h-6 w-6 sm:h-8 sm:w-8 text-purple-600" />}
                value={totalDoctors}
                label="Doctors"
                trend="8 new this month"
                trendIcon={<UserPlusIcon className="h-4 w-4" />}
              />

              <StatCard
                icon={<DocumentTextIcon className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-600" />}
                value={totalPrescriptions}
                label="Prescriptions"
                trend="24 today"
                trendIcon={<ArrowTrendingUpIcon className="h-4 w-4" />}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="py-12 sm:py-16 lg:py-20">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartCard
              title="Monthly Prescriptions"
              icon={<ChartBarIcon className="h-5 w-5 text-blue-600" />}
              chart={<Line data={monthlyStats} options={lineChartOptions} />}
            />

            <ChartCard
              title="Specialization Distribution"
              icon={<UsersIcon className="h-5 w-5 text-purple-600" />}
              chart={<Doughnut data={distributionData} options={doughnutChartOptions} />}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

// Stat Card Component
const StatCard = ({ icon, value, label, trend, trendIcon }) => (
  <div className="transform hover:scale-[1.02] transition-transform duration-300 ease-out">
    <div className="bg-white/10 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
      <div className="flex flex-col items-center space-y-2 sm:space-y-3">
        <div className="p-2 sm:p-3 bg-white/20 rounded-full">{icon}</div>
        <span className="text-2xl sm:text-3xl font-bold text-white">
          <CountUp end={value} duration={2.5} separator="," />
        </span>
        <span className="text-xs sm:text-sm font-medium text-white/90 uppercase tracking-wide">
          {label}
        </span>
        <div className="flex items-center text-emerald-300 text-xs sm:text-sm">
          {trendIcon}
          <span className="ml-1">{trend}</span>
        </div>
      </div>
    </div>
  </div>
);

StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  trend: PropTypes.string.isRequired,
  trendIcon: PropTypes.node.isRequired,
};

// Chart Card Component
const ChartCard = ({ title, icon, chart }) => (
  <div className="bg-white/95 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg border border-white/20">
    <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
      <h2 className="text-base sm:text-lg font-semibold text-gray-900 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      <div className="flex items-center space-x-2">
        {title === "Monthly Prescriptions" && (
          <select className="text-xs sm:text-sm border-gray-200 rounded-lg focus:ring-blue-500 bg-white/50 px-2 py-1">
            <option>Last 6 months</option>
            <option>Last year</option>
          </select>
        )}
        <button className="p-1.5 hover:bg-gray-50 rounded-lg">
          <AdjustmentsHorizontalIcon className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
        </button>
      </div>
    </div>
    <div className="h-56 sm:h-64 relative">
      {chart}
    </div>
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  chart: PropTypes.node.isRequired,
};

// Chart Options
const lineChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1e293b',
      bodyColor: '#475569',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: { color: "rgba(0, 0, 0, 0.05)", borderColor: 'transparent' },
      ticks: { padding: 8 },
      border: { display: false }
    },
    x: {
      grid: { display: false, borderColor: 'transparent' },
      ticks: { padding: 8 },
      border: { display: false }
    },
  },
  elements: {
    line: { tension: 0.4 },
    point: { radius: 4, borderWidth: 2, backgroundColor: 'white' },
  },
};

const doughnutChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: { size: 12 },
      },
    },
    tooltip: {
      backgroundColor: 'rgba(255, 255, 255, 0.9)',
      titleColor: '#1e293b',
      bodyColor: '#475569',
      borderColor: '#e2e8f0',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 8,
    }
  },
  cutout: '70%',
  animation: { animateScale: true, animateRotate: true },
};

export default HeroSection;
