// StatsCard.jsx
import React from "react";
import PropTypes from "prop-types";

const StatsCard = ({ title, value, icon, colorClass, bgColorClass }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex items-center">
        <div className={`p-3 rounded-full ${bgColorClass} ${colorClass} mr-4`}>
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className={`text-3xl font-bold ${colorClass}`}>{value}</p>
        </div>
      </div>
    </div>
  );
};

StatsCard.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  icon: PropTypes.node.isRequired,
  colorClass: PropTypes.string.isRequired,
  bgColorClass: PropTypes.string.isRequired
};

export default StatsCard;