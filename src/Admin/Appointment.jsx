import React, { useState, useEffect } from "react";
import axios from "axios";
import { format } from "date-fns";
import { toast } from "react-toastify";

const Appointment = () => {
  // State Management
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [viewMode, setViewMode] = useState("list"); // 'list', 'create', 'edit', 'view'
  const [availableSlots, setAvailableSlots] = useState([]);
  const [patients, setPatients] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Filter/Search State
  const [filters, setFilters] = useState({
    status: "",
    doctorId: "",
    patientId: "",
    startDate: "",
    endDate: "",
    date: "",
  });

  // Form State for Create/Edit
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    departmentId: "",
    appointmentType: "new",
    date: "",
    startTime: "",
    endTime: "",
    duration: 30,
    reason: "",
    priority: "medium",
    notes: "",
    insurance: "",
  });

  // Fetch Patients
  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("/api/patients", {
          params: { search: searchQuery },
        });
        console.log(object)
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error);
        toast.error("Failed to fetch patients");
      }
    };

    if (searchQuery) {
      fetchPatients();
    }
  }, [searchQuery]);

  // Initial data fetch
  useEffect(() => {
    fetchAppointments();
    fetchDoctors();
    fetchDepartments();
  }, [currentPage, filters]);

  // API Functions
  const fetchAppointments = async () => {
    setLoading(true);
    setError(null);
debugger;
    try {
      const queryParams = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...Object.fromEntries(
          Object.entries(filters).filter(([_, value]) => value !== "")
        ),
      });

      const response = await axios.get(`/api/appointments?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      console.log("API Response:", response.data);

      // Check if response.data is an array or if appointments are nested
      const appointmentsData = Array.isArray(response.data)
        ? response.data // If response.data is an array, use it directly
        : response.data.data; // If response.data is an object, access the data property

      if (!Array.isArray(appointmentsData)) {
        throw new Error("Expected an array of appointments but got something else.");
      }

      // Populate insurance details for each appointment
      const appointmentsWithInsurance = await Promise.all(
        appointmentsData.map(async (appointment) => {
          const populatedAppointment = await axios.get(
            `/api/appointments/${appointment._id}`,
            {
              headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
            }
          );
          return populatedAppointment.data;
        })
      );

      setAppointments(appointmentsWithInsurance);

      // Set total pages if available in the response
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch appointments");
      toast.error("Failed to load appointments");
      console.error("Error fetching appointments:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("/api/doctors", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setDoctors(response.data);
    } catch (err) {
      console.error("Error fetching doctors:", err);
      toast.error("Failed to fetch doctors");
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get("/api/departments", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      toast.error("Failed to fetch departments");
    }
  };

  const fetchAvailableSlots = async () => {
    if (!formData.doctorId || !formData.date) return;

    try {
      const response = await axios.get("/api/appointments/available", {
        params: {
          doctorId: formData.doctorId,
          date: formData.date,
          duration: formData.duration,
        },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setAvailableSlots(response.data.data.availableSlots);
    } catch (err) {
      toast.error("Failed to fetch available time slots");
      console.error("Error fetching available slots:", err);
    }
  };

  const createAppointment = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post("/api/appointments", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      toast.success("Appointment created successfully");
      setViewMode("list");
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create appointment");
      toast.error(err.response?.data?.message || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  const updateAppointment = async () => {
    if (!selectedAppointment) return;

    setLoading(true);
    setError(null);

    try {
      const response = await axios.put(
        `/api/appointments/${selectedAppointment._id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      toast.success("Appointment updated successfully");
      setViewMode("list");
      fetchAppointments();
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update appointment");
      toast.error(err.response?.data?.message || "Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  const cancelAppointment = async (id, reason) => {
    try {
      await axios.put(
        `/api/appointments/${id}/cancel`,
        { cancellationReason: reason },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Appointment cancelled successfully");
      fetchAppointments();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to cancel appointment");
    }
  };

  const sendReminder = async (id) => {
    try {
      await axios.post(
        `/api/appointments/${id}/reminder`,
        { type: "email" }, // Could also be 'sms'
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Reminder sent successfully");
    } catch (err) {
      toast.error("Failed to send reminder");
    }
  };

  // Event Handlers
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters({ ...filters, [name]: value });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Fetch available slots when doctor or date changes
    if (name === "doctorId" || name === "date") {
      fetchAvailableSlots();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (viewMode === "create") {
      createAppointment();
    } else if (viewMode === "edit") {
      updateAppointment();
    }
  };

  const handleCancelConfirm = (id) => {
    const reason = prompt("Please provide a reason for cancellation:");
    if (reason) {
      cancelAppointment(id, reason);
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: "",
      doctorId: "",
      departmentId: "",
      appointmentType: "new",
      date: "",
      startTime: "",
      endTime: "",
      duration: 30,
      reason: "",
      priority: "medium",
      notes: "",
      insurance: "",
    });
    setSelectedAppointment(null);
  };

  const switchToCreateMode = () => {
    resetForm();
    setViewMode("create");
  };

  const switchToEditMode = (appointment) => {
    setSelectedAppointment(appointment);
    setFormData({
      patientId: appointment.patientId?._id || appointment.patientId,
      doctorId: appointment.doctorId?._id || appointment.doctorId,
      departmentId: appointment.departmentId?._id || appointment.departmentId,
      appointmentType: appointment.appointmentType,
      date: format(new Date(appointment.date), "yyyy-MM-dd"),
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      duration: appointment.duration,
      reason: appointment.reason,
      priority: appointment.priority,
      notes: appointment.notes || "",
      insurance: appointment.insurance || "",
    });
    setViewMode("edit");
  };

  const switchToViewMode = (appointment) => {
    setSelectedAppointment(appointment);
    setViewMode("view");
  };

  // Render different views
  const renderList = () => (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Appointments</h1>
        <button
          onClick={switchToCreateMode}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          New Appointment
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="text-lg font-semibold mb-4">Filters</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All</option>
              <option value="scheduled">Scheduled</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
              <option value="no-show">No Show</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Doctor
            </label>
            <select
              name="doctorId"
              value={filters.doctorId}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            >
              <option value="">All Doctors</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={filters.date}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              From
            </label>
            <input
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              To
            </label>
            <input
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleFilterChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="flex items-end">
            <button
              onClick={() =>
                setFilters({
                  status: "",
                  doctorId: "",
                  patientId: "",
                  startDate: "",
                  endDate: "",
                  date: "",
                })
              }
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Reset
            </button>
            <button
              onClick={fetchAppointments}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Appointment List */}
      {loading ? (
        <div className="text-center py-4">Loading appointments...</div>
      ) : error ? (
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      ) : (
        <>
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Reason
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {appointments.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-4 text-center text-gray-500"
                    >
                      No appointments found
                    </td>
                  </tr>
                ) : (
                  appointments.map((appointment) => (

                    <tr key={appointment._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
  {appointment.date && !isNaN(new Date(appointment.date).getTime())
    ? format(new Date(appointment.date), "MMM d, yyyy")
    : "Invalid Date"}
</div>
                        <div className="text-sm text-gray-500">
                          {appointment.startTime} - {appointment.endTime}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.patientId?.name}{" "}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {appointment.doctorId?.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.doctorId?.specialization}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 max-w-xs truncate">
                          {appointment.reason}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
  <span
    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
      ${
        appointment.status === "scheduled"
          ? "bg-yellow-100 text-yellow-800"
          : ""
      }
      ${
        appointment.status === "confirmed"
          ? "bg-green-100 text-green-800"
          : ""
      }
      ${
        appointment.status === "completed"
          ? "bg-blue-100 text-blue-800"
          : ""
      }
      ${
        appointment.status === "cancelled"
          ? "bg-red-100 text-red-800"
          : ""
      }
      ${
        appointment.status === "no-show"
          ? "bg-gray-100 text-gray-800"
          : ""
      }
    `}
  >
    {appointment.status
      ? appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)
      : "Unknown"}
  </span>
</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
  <button
    onClick={() => switchToViewMode(appointment)}
    className="text-indigo-600 hover:text-indigo-900 mr-2"
  >
    View
  </button>
  {appointment.status !== "completed" && ( // <-- Fixed
      <>
        <button
          onClick={() => switchToEditMode(appointment)}
          className="text-green-600 hover:text-green-900 mr-2"
        >
          Edit
        </button>
        <button
          onClick={() => handleCancelConfirm(appointment._id)}
          className="text-red-600 hover:text-red-900 mr-2"
        >
          Cancel
        </button>
        <button
          onClick={() => sendReminder(appointment._id)}
          className="text-blue-600 hover:text-blue-900"
        >
          Remind
        </button>
      </>
    )}
</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-4">
              <nav
                className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                aria-label="Pagination"
              >
                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(prev - 1, 1))
                  }
                  disabled={currentPage === 1}
                  className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === 1
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Previous
                </button>

                {[...Array(totalPages).keys()].map((page) => (
                  <button
                    key={page + 1}
                    onClick={() => setCurrentPage(page + 1)}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                      currentPage === page + 1
                        ? "z-10 bg-indigo-50 border-indigo-500 text-indigo-600"
                        : "text-gray-500 hover:bg-gray-50"
                    }`}
                  >
                    {page + 1}
                  </button>
                ))}

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                    currentPage === totalPages
                      ? "text-gray-300"
                      : "text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  Next
                </button>
              </nav>
            </div>
          )}
        </>
      )}
    </div>
  );

  const renderForm = () => (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          {viewMode === "create"
            ? "Create New Appointment"
            : "Edit Appointment"}
        </h1>
        <button
          onClick={() => setViewMode("list")}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Back to List
        </button>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Doctor Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Doctor
              </label>
              <select
                name="doctorId"
                value={formData.doctorId}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.name} - {doctor.specialization}
                  </option>
                ))}
              </select>
            </div>

            {/* Department Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                name="departmentId"
                value={formData.departmentId}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Select Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Patient Search and Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Patient
              </label>
              <input
                type="text"
                name="patientId"
                value={formData.patientId}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Search Patient"
                required
              />
              {patients.length > 0 && (
                <ul className="mt-2 bg-white border rounded-lg shadow-md max-h-40 overflow-y-auto">
                  {patients.map((patient) => (
                    <li
                      key={patient._id}
                      onClick={() =>
                        setFormData({ ...formData, patientId: patient._id })
                      }
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {patient.firstName} {patient.lastName} - {patient.phone}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Appointment Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Appointment Type
              </label>
              <select
                name="appointmentType"
                value={formData.appointmentType}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="new">New</option>
                <option value="follow-up">Follow-Up</option>
                <option value="emergency">Emergency</option>
                <option value="routine">Routine</option>
                <option value="specialist">Specialist</option>
                <option value="Consultation">Consultation</option>
                <option value="Diagnostic">Diagnostic</option>
                <option value="Therapy">Therapy</option>
                <option value="Surgery">Surgery</option>
              </select>
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Duration (minutes)
              </label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
              </select>
            </div>

            {/* Available Time Slots */}
            {availableSlots.length > 0 && (
              <div className="col-span-1 md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Available Time Slots
                </label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {availableSlots.map((slot, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() =>
                        setFormData({
                          ...formData,
                          startTime: slot.startTime,
                          endTime: slot.endTime,
                        })
                      }
                      className={`p-2 border rounded text-center ${
                        formData.startTime === slot.startTime
                          ? "bg-blue-100 border-blue-500"
                          : "bg-white"
                      }`}
                    >
                      {slot.startTime} - {slot.endTime}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Start Time
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                End Time
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Reason */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Visit
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                rows="3"
                required
              ></textarea>
            </div>

            {/* Priority */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Priority
              </label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>

            {/* Insurance */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Insurance
              </label>
              <input
                type="text"
                name="insurance"
                value={formData.insurance}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                placeholder="Insurance details"
              />
            </div>

            {/* Notes */}
            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Additional Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleFormChange}
                className="w-full p-2 border rounded"
                rows="3"
              ></textarea>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              {viewMode === "create"
                ? "Create Appointment"
                : "Update Appointment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );

  const renderView = () => {
    if (!selectedAppointment) return null;

    return (
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Appointment Details</h1>
          <button
            onClick={() => setViewMode("list")}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
          >
            Back to List
          </button>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden">
          {/* Header Section with Status */}
          <div className="border-b p-4 flex justify-between items-center">
            <div>
              <span
                className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                ${
                  selectedAppointment.status === "scheduled"
                    ? "bg-yellow-100 text-yellow-800"
                    : ""
                }
                ${
                  selectedAppointment.status === "confirmed"
                    ? "bg-green-100 text-green-800"
                    : ""
                }
                ${
                  selectedAppointment.status === "completed"
                    ? "bg-blue-100 text-blue-800"
                    : ""
                }
                ${
                  selectedAppointment.status === "cancelled"
                    ? "bg-red-100 text-red-800"
                    : ""
                }
                ${
                  selectedAppointment.status === "no-show"
                    ? "bg-gray-100 text-gray-800"
                    : ""
                }
              `}
              >
                {selectedAppointment.status.charAt(0).toUpperCase() +
                  selectedAppointment.status.slice(1)}
              </span>
              <h2 className="text-xl font-semibold mt-1">
                Appointment on{" "}
                {format(new Date(selectedAppointment.date), "MMMM d, yyyy")}
              </h2>
              <p className="text-gray-600">
                {selectedAppointment.startTime} - {selectedAppointment.endTime}
              </p>
            </div>

            {selectedAppointment.status !== "cancelled" &&
              selectedAppointment.status !== "completed" && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => switchToEditMode(selectedAppointment)}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleCancelConfirm(selectedAppointment._id)}
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => sendReminder(selectedAppointment._id)}
                    className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-3 rounded text-sm"
                  >
                    Send Reminder
                  </button>
                </div>
              )}
          </div>

          {/* Main Content */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-3">
                  Patient Information
                </h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Name:</span>{" "}
                  {selectedAppointment.patientId?.firstName}{" "}
                  {selectedAppointment.patientId?.lastName}
                </p>
                {selectedAppointment.patientId?.email && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Email:</span>{" "}
                    {selectedAppointment.patientId.email}
                  </p>
                )}
                {selectedAppointment.patientId?.phone && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Phone:</span>{" "}
                    {selectedAppointment.patientId.phone}
                  </p>
                )}
                {selectedAppointment.patientId?.insuranceDetails && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Insurance Details:</span>{" "}
                    {selectedAppointment.patientId.insuranceDetails}
                  </p>
                )}
              </div>

              {/* Doctor Information */}
              <div>
                <h3 className="text-lg font-medium border-b pb-2 mb-3">
                  Doctor Information
                </h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Doctor:</span> Dr.{" "}
                  {selectedAppointment.doctorId?.firstName}{" "}
                  {selectedAppointment.doctorId?.lastName}
                </p>
                {selectedAppointment.doctorId?.specialization && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Specialization:</span>{" "}
                    {selectedAppointment.doctorId.specialization}
                  </p>
                )}
                {selectedAppointment.departmentId?.name && (
                  <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Department:</span>{" "}
                    {selectedAppointment.departmentId.name}
                  </p>
                )}
              </div>

              {/* Appointment Details */}
              <div className="col-span-1 md:col-span-2">
                <h3 className="text-lg font-medium border-b pb-2 mb-3">
                  Appointment Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <p className="text-gray-700">
                    <span className="font-semibold">Type:</span>{" "}
                    {selectedAppointment.appointmentType
                      .charAt(0)
                      .toUpperCase() +
                      selectedAppointment.appointmentType.slice(1)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Priority:</span>{" "}
                    {selectedAppointment.priority.charAt(0).toUpperCase() +
                      selectedAppointment.priority.slice(1)}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Duration:</span>{" "}
                    {selectedAppointment.duration} minutes
                  </p>
                  {selectedAppointment.createdAt && (
                    <p className="text-gray-700">
                      <span className="font-semibold">Created:</span>{" "}
                      {format(
                        new Date(selectedAppointment.createdAt),
                        "MMM d, yyyy HH:mm"
                      )}
                    </p>
                  )}
                </div>

                <div className="mt-4">
                  <p className="text-gray-700 mb-1">
                    <span className="font-semibold">Reason for Visit:</span>
                  </p>
                  <p className="bg-gray-50 p-3 rounded">
                    {selectedAppointment.reason}
                  </p>
                </div>

                {selectedAppointment.notes && (
                  <div className="mt-4">
                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold">Additional Notes:</span>
                    </p>
                    <p className="bg-gray-50 p-3 rounded">
                      {selectedAppointment.notes}
                    </p>
                  </div>
                )}

                {selectedAppointment.cancellationReason && (
                  <div className="mt-4">
                    <p className="text-gray-700 mb-1">
                      <span className="font-semibold text-red-600">
                        Cancellation Reason:
                      </span>
                    </p>
                    <p className="bg-red-50 p-3 rounded text-red-700">
                      {selectedAppointment.cancellationReason}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Render
  return (
    <div className="bg-gray-100 min-h-screen">
      {viewMode === "list" && renderList()}
      {(viewMode === "create" || viewMode === "edit") && renderForm()}
      {viewMode === "view" && renderView()}
    </div>
  );
};

export default Appointment;