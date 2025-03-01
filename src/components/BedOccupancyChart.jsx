// BedOccupancyChart.jsx
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

const BedOccupancyChart = ({ data = [] }) => {
  // Default data if none provided
  const defaultData = [
    { department: 'ICU', occupied: 18, total: 20, occupancyRate: 90 },
    { department: 'Emergency', occupied: 15, total: 25, occupancyRate: 60 },
    { department: 'Pediatrics', occupied: 12, total: 15, occupancyRate: 80 },
    { department: 'Cardiology', occupied: 22, total: 30, occupancyRate: 73 },
    { department: 'Neurology', occupied: 8, total: 15, occupancyRate: 53 },
    { department: 'Orthopedics', occupied: 14, total: 20, occupancyRate: 70 }
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
        <XAxis dataKey="department" />
        <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
        <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
        <Tooltip />
        <Legend />
        <Bar yAxisId="left" dataKey="occupied" name="Occupied Beds" fill="#8884d8" />
        <Bar yAxisId="left" dataKey="total" name="Total Beds" fill="#82ca9d" />
        <Bar yAxisId="right" dataKey="occupancyRate" name="Occupancy Rate (%)" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
};

BedOccupancyChart.propTypes = {
  data: PropTypes.array
};

export default BedOccupancyChart;
