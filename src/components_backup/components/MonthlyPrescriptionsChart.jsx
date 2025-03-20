import React from "react";
import { Line } from "react-chartjs-2";
import PropTypes from "prop-types";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';

// 🟢 Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

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
    },
  },
  scales: {
    y: { beginAtZero: true, grid: { color: "rgba(0, 0, 0, 0.05)" } },
    x: { grid: { display: false } },
  },
};

// 🛡️ Safe wrapper for data
const safeChartData = (data) => ({
  labels: Array.isArray(data?.labels) ? data.labels : [],
  datasets: Array.isArray(data?.datasets) ? data.datasets : []
});

const MonthlyPrescriptionsChart = ({ data }) => {
  const chartData = safeChartData(data); // Ensure data is safe

  return (
    <div className="h-56 sm:h-64 relative">
      <Line data={chartData} options={lineChartOptions} />
    </div>
  );
};

MonthlyPrescriptionsChart.propTypes = {
  data: PropTypes.object.isRequired,
};

export default MonthlyPrescriptionsChart;
