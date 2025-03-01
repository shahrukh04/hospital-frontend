import React from "react";
import PropTypes from "prop-types";
import { AdjustmentsHorizontalIcon } from "@heroicons/react/24/outline";

const ChartCard = ({ title, icon, children, minHeight = "300px", maxHeight = "500px" }) => (
  <div
    className="bg-white/95 backdrop-blur-lg p-4 sm:p-6 rounded-xl shadow-lg border border-white/20"
    style={{ minHeight, maxHeight }}
  >
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

    {/* Content container with scroll if needed */}
    <div className="relative overflow-y-auto" style={{ maxHeight: `calc(${maxHeight} - 100px)` }}>
      {children}
    </div>
  </div>
);

ChartCard.propTypes = {
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
  minHeight: PropTypes.string,
  maxHeight: PropTypes.string,
};

export default ChartCard;
