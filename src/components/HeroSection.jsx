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
      {/* Hero Banner with Enhanced Gradient */}
      <div className="relative w-full h-[100vh] overflow-hidden">
        {/* Advanced Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-600 via-blue-500 to-purple-600">
          {/* Enhanced Pattern Overlay */}
          <div className="absolute inset-0 opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAzNGM0LjQxOCAwIDgtMy41ODIgOC04cy0zLjU4Mi04LTgtOC04IDMuNTgyLTggOCAzLjU4MiA4IDggOHoiIGZpbGw9IiNmZmYiLz48L2c+PC9zdmc+')] mix-blend-overlay" />
          {/* Animated Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/10 to-purple-600/20 animate-pulse" />
        </div>

        {/* Content */}
        <div className="relative flex items-center justify-center h-full px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-5xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight">
              Hospital Management System
              <span className="block text-lg sm:text-xl font-normal mt-3 text-blue-100">
                Streamlining Healthcare Operations
              </span>
            </h1>

            {/* Enhanced Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mt-12">
              {/* Medicine Stats */}
              <StatCard
                icon={<BeakerIcon className="h-8 w-8 text-blue-600" />}
                value={totalMedicines}
                label="Medicines"
                trend="12% increase"
                trendIcon={<ArrowTrendingUpIcon className="h-4 w-4" />}
                bgColor="bg-white/10"
              />

              {/* Doctors Stats */}
              <StatCard
                icon={<UsersIcon className="h-8 w-8 text-purple-600" />}
                value={totalDoctors}
                label="Doctors"
                trend="8 new this month"
                trendIcon={<UserPlusIcon className="h-4 w-4" />}
                bgColor="bg-white/10"
              />

              {/* Prescriptions Stats */}
              <StatCard
                icon={<DocumentTextIcon className="h-8 w-8 text-indigo-600" />}
                value={totalPrescriptions}
                label="Prescriptions"
                trend="24 today"
                trendIcon={<ArrowTrendingUpIcon className="h-4 w-4" />}
                bgColor="bg-white/10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Charts Section */}
      <div className="mt-32">
        <div className="mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Monthly Prescriptions Chart */}
            <ChartCard
              title="Monthly Prescriptions"
              icon={<ChartBarIcon className="h-5 w-5 text-blue-600" />}
              chart={<Line data={monthlyStats} options={lineChartOptions} />}
            />

            {/* Specialization Distribution Chart */}
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

// Enhanced Stat Card Component with Improved Animations
const StatCard = ({ icon, value, label, trend, trendIcon, bgColor }) => (
  <div className="transform hover:scale-105 transition-all duration-300 ease-out">
    <div className={`${bgColor} backdrop-blur-lg p-6 rounded-2xl shadow-xl border border-white/20 hover:border-white/30 transition-all duration-300`}>
      <div className="flex flex-col items-center">
        <div className="p-4 bg-white/20 rounded-full mb-4 transform hover:rotate-3 transition-transform duration-300">{icon}</div>
        <span className="text-3xl font-bold text-white mb-2 relative">
          <CountUp end={value} duration={2.5} separator="," />
          <div className="absolute -inset-1 bg-white/5 blur-sm rounded-lg -z-10" />
        </span>
        <span className="text-sm font-medium text-white uppercase tracking-wide">
          {label}
        </span>
        <div className="mt-4 flex items-center text-emerald-300 transition-colors duration-300 hover:text-emerald-200">
          {trendIcon}
          <span className="ml-1">{trend}</span>
        </div>
      </div>
    </div>
  </div>
);

// PropTypes definitions
StatCard.propTypes = {
  icon: PropTypes.node.isRequired,
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
  trend: PropTypes.string.isRequired,
  trendIcon: PropTypes.node.isRequired,
  bgColor: PropTypes.string.isRequired,
};

// Enhanced Chart Card Component
const ChartCard = ({ title, icon, chart }) => (
  <div className="bg-white/95 backdrop-blur-lg p-6 rounded-xl shadow-xl border border-white/20 hover:shadow-2xl transition-all duration-300 hover:border-white/30">
    <div className="flex items-center justify-between mb-4">
      <h2 className="text-lg font-semibold text-gray-900 flex items-center">
        {icon}
        <span className="ml-2">{title}</span>
      </h2>
      {title === "Monthly Prescriptions" && (
        <select className="text-sm border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500 bg-white/50 backdrop-blur-sm transition-colors duration-200 hover:bg-white/70">
          <option>Last 6 months</option>
          <option>Last year</option>
          <option>All time</option>
        </select>
      )}
      {title === "Specialization Distribution" && (
        <button className="text-sm text-gray-600 hover:text-gray-900 transition-colors duration-200">
          <AdjustmentsHorizontalIcon className="h-5 w-5" />
        </button>
      )}
    </div>
    <div className="h-64 relative group">
      {chart}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg pointer-events-none" />
    </div>
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  chart: PropTypes.node.isRequired,
};

// Enhanced Chart Options
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
      grid: {
        color: "rgba(0, 0, 0, 0.05)",
        borderColor: 'transparent',
      },
      ticks: {
        padding: 8,
      },
      border: {
        display: false
      }
    },
    x: {
      grid: {
        display: false,
        borderColor: 'transparent',
      },
      ticks: {
        padding: 8,
      },
      border: {
        display: false
      }
    },
  },
  interaction: {
    intersect: false,
    mode: 'index',
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
      radius: 4,
      borderWidth: 2,
      backgroundColor: 'white',
    },
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
        font: {
          size: 12,
        },
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
  animation: {
    animateScale: true,
    animateRotate: true
  },
};

export default HeroSection;