import React, { useEffect, useState } from "react";
import ChartCard from "./ChartCard";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";
import api from "../services/api"; // Your existing API service

const DashboardCharts = () => {
  const [monthlyData, setMonthlyData] = useState([]);
  const [demographicsData, setDemographicsData] = useState([]);
  const [bedOccupancyData, setBedOccupancyData] = useState([]);
  const [financialData, setFinancialData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    try {
      const [monthlyRes, demographicsRes, bedRes, financialRes, performanceRes] = await Promise.all([
        api.getMonthlyStats(),
        api.getDemographicsData(),
        api.getDistributionData(),
        api.getFinancialData(),
        api.getPerformanceMetrics()
      ]);

      setMonthlyData(monthlyRes.data);
      setDemographicsData(demographicsRes.data);
      setBedOccupancyData(bedRes.data);
      setFinancialData(financialRes.data);
      setPerformanceData(performanceRes.data);

    } catch (error) {
      console.error("Error fetching analytics data:", error);
    }
  };

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Monthly Prescriptions */}
      <ChartCard title="Monthly Prescriptions" icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={monthlyData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="prescriptions" fill="#4F46E5" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Patient Demographics */}
      <ChartCard title="Patient Demographics" icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={demographicsData}
              dataKey="count"
              nameKey="ageGroup"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {demographicsData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Bed Occupancy */}
      <ChartCard title="Bed Occupancy" icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={bedOccupancyData}>
            <XAxis dataKey="department" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="occupiedBeds" fill="#10B981" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Financial Stats */}
      <ChartCard title="Financial Overview" icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={financialData}>
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#F59E0B" />
            <Bar dataKey="expenses" fill="#EF4444" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Performance Metrics */}
      <ChartCard title="Performance Metrics" icon={<AdjustmentsHorizontalIcon className="h-5 w-5" />}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={performanceData}>
            <XAxis dataKey="metric" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#6366F1" />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export default DashboardCharts;
