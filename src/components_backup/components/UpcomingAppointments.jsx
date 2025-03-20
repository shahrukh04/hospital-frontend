// UpcomingAppointments.jsx
import React from "react";
import PropTypes from "prop-types";
import { ClockIcon } from "@heroicons/react/24/outline";

const UpcomingAppointments = ({ appointments }) => {
  return (
    <div className="bg-white shadow rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Upcoming Appointments</h3>
        <button className="text-sm text-blue-600 hover:underline">View all</button>
      </div>
      
      {appointments.length > 0 ? (
        <div className="space-y-3">
          {appointments.slice(0, 5).map((appointment, index) => (
            <div 
              key={appointment.id || index} 
              className="flex items-start p-3 border-l-4 border-blue-500 bg-blue-50 rounded"
            >
              <div className="bg-white p-2 rounded-full border border-blue-200 mr-3">
                <ClockIcon className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <div className="flex justify-between">
                  <p className="font-medium">{appointment.patientName || "Unknown Patient"}</p>
                  <span className="text-sm text-blue-700 font-medium">
                    {appointment.time || "TBD"}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  Dr. {appointment.doctorName || "Unassigned"} - {appointment.department || "General"}
                </p>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                    {appointment.type || "Check-up"}
                  </span>
                  <div>
                    <button className="text-xs text-blue-600 hover:underline mr-2">
                      Reschedule
                    </button>
                    <button className="text-xs text-red-600 hover:underline">
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-gray-500">
          <ClockIcon className="h-10 w-10 mb-2" />
          <p>No appointments scheduled for today</p>
        </div>
      )}
    </div>
  );
};

UpcomingAppointments.propTypes = {
  appointments: PropTypes.array.isRequired
};

export default UpcomingAppointments;