// AlertBanner.jsx
import React from "react";
import PropTypes from "prop-types";

const AlertBanner = ({ alerts, title, icon }) => {
  return (
    <div className="bg-red-600 text-white p-4 rounded-lg shadow-md">
      <div className="flex items-center mb-2">
        {icon}
        <h3 className="text-lg font-bold ml-2">{title}</h3>
      </div>
      {alerts.length > 0 ? (
        <div className="space-y-2">
          {alerts.slice(0, 3).map((alert, index) => (
            <div key={alert.id || index} className="flex items-center">
              <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
              <p>{alert.message || "Unknown alert"}</p>
            </div>
          ))}
          {alerts.length > 3 && (
            <button className="text-white underline text-sm mt-1">
              View all {alerts.length} alerts
            </button>
          )}
        </div>
      ) : (
        <p>No active alerts at this time.</p>
      )}
    </div>
  );
};

AlertBanner.propTypes = {
  alerts: PropTypes.array.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired
};

export default AlertBanner;