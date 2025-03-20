// SpecializationDistributionChart.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Legend,
  Tooltip
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const SpecializationDistributionChart = ({ data = [] }) => {
  // Default data if none provided
  const defaultData = [
    { name: 'Cardiology', value: 12 },
    { name: 'Neurology', value: 8 },
    { name: 'Orthopedics', value: 10 },
    { name: 'Pediatrics', value: 14 },
    { name: 'General Medicine', value: 20 },
    { name: 'Others', value: 15 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

SpecializationDistributionChart.propTypes = {
  data: PropTypes.array
};

export default SpecializationDistributionChart;
