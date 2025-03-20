// EmergencyAlerts.jsx
import React from "react";
import PropTypes from "prop-types";
import { BellAlertIcon } from "@heroicons/react/24/outline";

const EmergencyAlerts = ({ alerts }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Emergency Alerts</h3>
        {alerts.length > 0 && (
          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {alerts.length}
          </span>
        )}
      </div>
      
      {alerts.length > 0 ? (
        <div className="space-y-3">
          {alerts.map((alert, index) => (
            <div 
              key={alert.id || index} 
              className="flex items-start p-3 border-l-4 border-red-500 bg-red-50 rounded"
            >
              <BellAlertIcon className="h-5 w-5 text-red-600 mr-2 flex-shrink-0" />
              <div>
                <p className="font-medium text-red-800">{alert.title || "Emergency Alert"}</p>
                <p className="text-sm text-red-700">{alert.message || "No details provided"}</p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs text-red-600">
                    {alert.time || "Unknown time"}
                  </span>
                  <button className="text-xs text-blue-600 hover:underline">
                    Take action
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <BellAlertIcon className="h-10 w-10 mb-2" />
          <p>No emergency alerts at this time</p>
        </div>
      )}
    </div>
  );
};

EmergencyAlerts.propTypes = {
  alerts: PropTypes.array.isRequired
};

export default EmergencyAlerts;