// MonthlyPrescriptionsChart.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";

const MonthlyPrescriptionsChart = ({ data = [] }) => {
  // Default data if none provided
  const defaultData = [
    { month: 'Jan', prescriptions: 120 },
    { month: 'Feb', prescriptions: 145 },
    { month: 'Mar', prescriptions: 150 },
    { month: 'Apr', prescriptions: 135 },
    { month: 'May', prescriptions: 160 },
    { month: 'Jun', prescriptions: 180 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={chartData}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="prescriptions" fill="#8884d8" name="Prescriptions" />
      </BarChart>
    </ResponsiveContainer>
  );
};

MonthlyPrescriptionsChart.propTypes = {
  data: PropTypes.array
};

export default MonthlyPrescriptionsChart;
