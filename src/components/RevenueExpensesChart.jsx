// RevenueExpensesChart.jsx
import React from "react";
import PropTypes from "prop-types";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  ComposedChart
} from "recharts";

const RevenueExpensesChart = ({ data = [] }) => {
  // Default data if none provided
  const defaultData = [
    { month: 'Jan', revenue: 125000, expenses: 90000, profit: 35000 },
    { month: 'Feb', revenue: 130000, expenses: 88000, profit: 42000 },
    { month: 'Mar', revenue: 142000, expenses: 95000, profit: 47000 },
    { month: 'Apr', revenue: 120000, expenses: 98000, profit: 22000 },
    { month: 'May', revenue: 135000, expenses: 92000, profit: 43000 },
    { month: 'Jun', revenue: 150000, expenses: 97000, profit: 53000 }
  ];

  const chartData = data.length > 0 ? data : defaultData;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <ComposedChart
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
        <Tooltip 
          formatter={(value) => `$${value.toLocaleString()}`}
        />
        <Legend />
        <Area type="monotone" dataKey="profit" fill="#82ca9d" stroke="#82ca9d" name="Profit" />
        <Line type="monotone" dataKey="revenue" stroke="#8884d8" name="Revenue" />
        <Line type="monotone" dataKey="expenses" stroke="#ff7300" name="Expenses" />
      </ComposedChart>
    </ResponsiveContainer>
  );
};

RevenueExpensesChart.propTypes = {
  data: PropTypes.array
};

export default RevenueExpensesChart;