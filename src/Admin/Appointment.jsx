import React, { useState, useEffect, useRef } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { api } from "../services/api"; // Import your existing API functions

const Appointment = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    date: "",
    time: "",
    notes: "",
  });
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all appointments from the API
  const getAllAppointments = async () => {
    try {
      const response = await api.getAllAppointments();
      setAppointments(response.data);
      setFilteredAppointments(response.data);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    }
  };

  // ✅ Call the function to fetch appointments on component mount
  useEffect(() => {
    getAllAppointments();
  }, []);

  // ✅ Filter appointments by search term
  const filterAppointments = (searchTerm) => {
    const filtered = appointments.filter(
      (appointment) =>
        appointment.patientId.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        appointment.doctorId.name
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        new Date(appointment.date).toLocaleDateString().includes(searchTerm)
    );
    setFilteredAppointments(filtered);
  };

  // ✅ Toggle the form to add a new appointment
  const handleToggleForm = () => {
    setNewAppointment({
      patientId: "",
      doctorId: "",
      date: "",
      time: "",
      notes: "",
    });
    setShowForm(!showForm);
    setEditingAppointmentId(null);
  };

  // ✅ Handle form submission (add or edit appointment)
  const handleSubmit = async (values) => {
    try {
      if (editingAppointmentId) {
        // Update existing appointment
        await api.updateAppointment(editingAppointmentId, values);
        toast.success("Appointment updated successfully!");
      } else {
        // Add new appointment
        await api.addAppointment(values);
        toast.success("Appointment added successfully!");
      }
      getAllAppointments(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit appointment details.");
      console.error(error);
    }
  };

  // ✅ Edit an existing appointment
  const handleEditAppointment = async (appointmentId) => {
    try {
      const response = await api.getAppointment(appointmentId);
      setNewAppointment(response.data);
      setEditingAppointmentId(appointmentId);
      setShowForm(true);
    } catch (error) {
      toast.error("Failed to fetch appointment details.");
      console.error(error);
    }
  };

  // ✅ Delete an appointment
  const handleDelete = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        await api.deleteAppointment(id);
        getAllAppointments(); // Refresh the list
        Swal.fire("Deleted!", "The appointment has been deleted.", "success");
      }
    } catch (error) {
      toast.error("Failed to delete appointment.");
      console.error(error);
    }
  };

  const validationSchema = Yup.object({
    patientId: Yup.string().required("Patient is required"),
    doctorId: Yup.string().required("Doctor is required"),
    date: Yup.date().required("Date is required"),
    time: Yup.string().required("Time is required"),
    notes: Yup.string(),
  });

  return (
    <div className="container mx-auto px-3 py-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        <button
          onClick={handleToggleForm}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Appointment
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search appointments..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            filterAppointments(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAppointments.map((appointment) => (
          <div
            key={appointment._id}
            className="bg-white rounded-xl shadow-lg p-6 relative"
          >
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleEditAppointment(appointment._id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <PencilIcon className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDelete(appointment._id)}
                className="text-red-600 hover:text-red-700"
              >
                <TrashIcon className="h-5 w-5" />
              </button>
            </div>
            <div>
              <h2 className="text-lg font-semibold">
                {appointment.patientId.name}
              </h2>
              <p className="text-sm text-gray-600">
                Doctor: {appointment.doctorId.name}
              </p>
              <p className="text-sm text-gray-600">
                Date: {new Date(appointment.date).toLocaleDateString()}
              </p>
              <p className="text-sm text-gray-600">Time: {appointment.time}</p>
              <p className="text-sm text-gray-600">Notes: {appointment.notes}</p>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6">
            <button
              onClick={handleToggleForm}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
            <h2 className="text-2xl font-bold mb-6">
              {editingAppointmentId ? "Edit Appointment" : "Add New Appointment"}
            </h2>
            <Formik
              initialValues={newAppointment}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium">Patient</label>
                    <Field
                      type="text"
                      name="patientId"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.patientId && touched.patientId && (
                      <div className="text-red-500 text-sm">
                        {errors.patientId}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Doctor</label>
                    <Field
                      type="text"
                      name="doctorId"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.doctorId && touched.doctorId && (
                      <div className="text-red-500 text-sm">
                        {errors.doctorId}
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Date</label>
                    <Field
                      type="date"
                      name="date"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.date && touched.date && (
                      <div className="text-red-500 text-sm">{errors.date}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Time</label>
                    <Field
                      type="time"
                      name="time"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.time && touched.time && (
                      <div className="text-red-500 text-sm">{errors.time}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Notes</label>
                    <Field
                      as="textarea"
                      name="notes"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                  </div>
                  <div className="flex justify-end space-x-3">
                    <button
                      type="button"
                      onClick={handleToggleForm}
                      className="px-4 py-2 border rounded-lg"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg"
                    >
                      {editingAppointmentId ? "Update Appointment" : "Add Appointment"}
                    </button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </div>
  );
};

export default Appointment;