import React, { useState, useRef, useEffect } from "react";
import { Formik, Field, Form } from "formik";
// import { FaEdit, FaTrashAlt } from "react-icons/fa";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import { Tooltip } from "primereact/tooltip";
import { FaEdit, FaTrash } from "react-icons/fa";

import "react-toastify/dist/ReactToastify.css";
import {
  ChevronDownIcon,
  FunnelIcon,
  XMarkIcon,
  PlusIcon,
  PencilIcon,
  EnvelopeIcon, // Changed from MailIcon
  TableCellsIcon, // Changed from ViewListIcon
  Squares2X2Icon, // Changed from ViewGridIcon
  MagnifyingGlassIcon, // Changed from SearchIcon
  UserIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { api } from "../services/api"; // Import your existing API functions

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");
  const [selectedSpecialization, setSelectedSpecialization] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [specializationSearchTerm, setSpecializationSearchTerm] = useState("");
  const [newDoctor, setNewDoctor] = useState({
    name: "",
    specialization: "",
    email: "",
  });
  const [editingDoctorId, setEditingDoctorId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [viewMode, setViewMode] = useState("card"); // 'card' or 'table'
  // ✅ Fetch all doctors from the API
  const getAllDoctors = async () => {
    try {
      const response = await api.getAllDoctors();
      setDoctors(response.data);
      setFilteredDoctors(response.data);
    } catch (error) {
      console.error("Failed to fetch doctors:", error);
    }
  };

  // ✅ Call the function to fetch doctors on component mount
  useEffect(() => {
    getAllDoctors();
  }, []);

  // ✅ Handle search input change
  // const handleSearchChange = (e) => {
  //   const term = e.target.value.toLowerCase();
  //   setSearchTerm(term);

  //   filterDoctors(term, selectedSpecialization);
  // };

  // ✅ Handle specialization filter change
  const handleSpecializationChange = (specialization) => {
    setSelectedSpecialization(specialization);
    filterDoctors(searchTerm, specialization);
  };

  // ✅ Filter doctors by search term and specialization
  const filterDoctors = (searchTerm, specialization) => {
    let filtered = doctors;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (doctor) =>
          doctor.name.toLowerCase().includes(searchTerm) ||
          doctor.specialization.toLowerCase().includes(searchTerm) ||
          doctor.email.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by specialization
    if (specialization) {
      filtered = filtered.filter(
        (doctor) => doctor.specialization === specialization
      );
    }

    setFilteredDoctors(filtered);
  };

  // ✅ Toggle the form to add a new doctor
  const handleToggleForm = () => {
    setNewDoctor({ name: "", specialization: "", email: "" });
    setShowForm(!showForm);
    setEditingDoctorId(null);
  };

  // ✅ Handle form submission (add or edit doctor)
  const handleSubmit = async (values) => {
    const { _id, ...doctorDataWithoutId } = values; // Exclude _id for new doctor submission

    try {
      if (editingDoctorId) {
        // Update existing doctor
        await api.updateDoctor(editingDoctorId, doctorDataWithoutId);
        toast.success("Doctor updated successfully!");
        getAllDoctors(); // Refresh the list
      } else {
        // Add new doctor

        await api.addDoctor(doctorDataWithoutId);
        toast.success("Doctor added successfully!");
        getAllDoctors(); // Refresh the list
      }

      // Reset the form and close it
      setNewDoctor({ name: "", specialization: "", email: "" });
      setEditingDoctorId(null);
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit doctor details.");
      console.error(error);
    }
  };

  // ✅ Edit an existing doctor
  const handleEditDoctor = async (doctorId) => {
    try {
      // Get the doctor details from the API
      const response = await api.getDoctor(doctorId);

      // Set the form values for editing
      setNewDoctor(response.data);
      setEditingDoctorId(doctorId);
      setShowForm(true);
    } catch (error) {
      toast.error("Failed to fetch doctor details.");
      console.error(error);
    }
  };

  // ✅ Delete a doctor
  const handleDelete = async (id) => {
    try {
      // First show the confirmation dialog
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
        showLoaderOnConfirm: true,
        preConfirm: async () => {
          try {
            await api.deleteDoctor(id);
            return true;
          } catch (error) {
            Swal.showValidationMessage(`Delete failed: ${error.message}`);
            return false;
          }
        },
        allowOutsideClick: () => !Swal.isLoading(),
      });

      if (result.isConfirmed) {
        await getAllDoctors(); // Refresh the list
        Swal.fire({
          title: "Deleted!",
          text: "The doctor has been deleted successfully.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error("Delete operation failed:", error);
      toast.error("Failed to delete doctor.");
      Swal.fire({
        title: "Error!",
        text: "Failed to delete the doctor.",
        icon: "error",
        confirmButtonColor: "#3085d6",
      });
    }
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    specialization: Yup.string()
      .required("Specialization is required")
      .min(3, "Specialization must be at least 3 characters"),
    email: Yup.string()
      .email("Invalid email address")
      .required("Email is required"),
  });

  const handleSort = (column) => {
    const direction =
      sortColumn === column && sortDirection === "asc" ? "desc" : "asc";

    const sortedDoctors = [...filteredDoctors].sort((a, b) => {
      if (a[column] < b[column]) return direction === "asc" ? -1 : 1;
      if (a[column] > b[column]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setFilteredDoctors(sortedDoctors);
    setSortColumn(column);
    setSortDirection(direction);
  };

  // ✅ Get unique specializations for the filter dropdown
  const getSpecializations = () => {
    const specializations = doctors.map((doctor) => doctor.specialization);
    return [...new Set(specializations)]; // Remove duplicates
  };

  const filteredSpecializations = getSpecializations().filter(
    (specialization) =>
      specialization
        .toLowerCase()
        .includes(specializationSearchTerm.toLowerCase())
  );

  // ✅ Handle click outside to close the dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // ✅ Handle specialization dropdown selection
  const handleSelectSpecialization = (specialization) => {
    setSelectedSpecialization(specialization); // Set selected specialization
    setSpecializationSearchTerm(""); // Clear the search term when selecting a specialization
    filterDoctors(searchTerm, specialization); // Filter doctors based on selected specialization
    setDropdownOpen(false); // Close the dropdown after selection
  };

  // ✅ Render the UI
  return (
    <div className="container mx-auto px-3 py-6 ">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Doctor Inventory</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage your Doctor stock and inventory
          </p>
        </div>

        <button
          onClick={handleToggleForm}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Doctor
        </button>
      </div>

      {/* Search and Filter Section */}
      <div className="flex flex-wrap items-center gap-4 mb-6">
        <div className="flex-1 min-w-[240px]">
          <div className="relative">
            <input
              type="text"
              placeholder="Search doctors..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                filterDoctors(e.target.value, selectedSpecialization);
              }}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            />
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
          </div>
        </div>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`flex items-center space-x-2 px-4 py-3 rounded-xl border ${
              isFilterOpen || selectedSpecialization
                ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <FunnelIcon className="h-5 w-5" />
            <span className="font-medium">
              {selectedSpecialization || "All Specializations"}
            </span>
            <ChevronDownIcon className="h-5 w-5" />
          </button>

          {/* Dropdown Content */}
          {isFilterOpen && (
            <div className="absolute z-50 mt-2 w-72 rounded-xl bg-white shadow-xl border border-gray-100">
              <div className="p-3">
                <input
                  type="text"
                  placeholder="Search specializations..."
                  value={specializationSearchTerm}
                  onChange={(e) => setSpecializationSearchTerm(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                />
              </div>
              <div className="max-h-60 overflow-y-auto px-2 pb-2">
                <button
                  onClick={() => {
                    handleSpecializationChange("");
                    setIsFilterOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-sm rounded-lg hover:bg-gray-50"
                >
                  All Specializations
                </button>
                {filteredSpecializations.map((spec, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      handleSpecializationChange(spec);
                      setIsFilterOpen(false);
                    }}
                    className={`w-full text-left px-4 py-2 text-sm rounded-lg ${
                      selectedSpecialization === spec
                        ? "bg-indigo-50 text-indigo-600"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    {spec}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* View Toggle Buttons */}
          <div className="bg-gray-100 p-1 rounded-lg flex space-x-1">
            <button
              onClick={() => setViewMode("table")}
              className={`px-4 py-2 rounded-md flex items-center ${
                viewMode === "table"
                  ? "bg-white shadow-md text-indigo-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <TableCellsIcon className="h-5 w-5 mr-2" />
              Table
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`px-4 py-2 rounded-md flex items-center ${
                viewMode === "card"
                  ? "bg-white shadow-md text-indigo-600"
                  : "text-gray-600 hover:bg-gray-200"
              }`}
            >
              <Squares2X2Icon className="h-5 w-5 mr-2" />
              Cards
            </button>
          </div>
        </div>
      </div>

      {/* Content Section */}
      {viewMode === "table" ? (
        <div>
          <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Specialization
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Email
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider"
                  >
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDoctors.map((doctor) => (
                  <tr
                    key={doctor._id}
                    className="transition-all hover:bg-blue-50"
                  >
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <span className="text-blue-600 font-semibold text-lg">
                              {doctor.name.charAt(0)}
                            </span>
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">
                            {doctor.name}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <span className="px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        {doctor.specialization}
                      </span>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap">
                      <div className="text-sm text-gray-600">
                        {doctor.email}
                      </div>
                    </td>
                    <td className="px-6 py-5 whitespace-nowrap flex justify-end space-x-3">
                      {/* Edit Button */}
                      <Tooltip target=".edit-btn-card" position="bottom" />
                      <button
                        className="edit-btn-card inline-flex items-center px-3 py-2
              text-sm font-medium rounded-lg text-blue-600 hover:text-blue-700
              transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        onClick={() => handleEditDoctor(doctor._id)}
                        data-pr-tooltip="Edit "
                      >
                        <FaEdit className="h-4 w-4 color-blue " />
                      </button>

                      {/* Delete Button */}
                      <Tooltip target=".delete-btn-card" position="bottom" />
                      <button
                        className="delete-btn-card inline-flex items-center px-3 py-2
              text-sm font-medium rounded-lg text-red-600 hover:text-red-700
              transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        onClick={() => handleDelete(doctor._id)}
                        data-pr-tooltip="Delete "
                      >
                        <FaTrash className="h-4 w-4 col-blue" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDoctors.map((doctor) => (
            <div
              key={doctor._id}
              className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-200 overflow-hidden"
            >
              <div className="p-6 bg-white rounded-lg shadow-md border relative">
                {/* Edit & Delete Buttons (Top-Right Corner) */}
                <div className="absolute top-4 right-4 flex space-x-2">
                  <Tooltip target=".edit-btn-card" position="top" />
                  <button
                    className="edit-btn-card inline-flex items-center p-2 rounded-lg text-blue-600 hover:text-blue-700
      transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    onClick={() => handleEditDoctor(doctor._id)}
                    data-pr-tooltip="Edit "
                  >
                    <FaEdit className="h-5 w-5" />
                  </button>

                  <Tooltip target=".delete-btn-card" position="top" />
                  <button
                    className="delete-btn-card inline-flex items-center p-2 rounded-lg text-red-600 hover:text-red-700
      transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    onClick={() => handleDelete(doctor._id)}
                    data-pr-tooltip="Delete "
                  >
                    <FaTrash className="h-5 w-5" />
                  </button>
                </div>

                {/* Doctor Info */}
                <div className="flex items-center space-x-4">
                  {/* Profile Icon */}
                  <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                    <UserIcon className="h-7 w-7 text-indigo-600" />
                  </div>

                  <div>
                    {/* Doctor Name */}
                    <h2 className="text-lg font-semibold text-gray-900">
                      {doctor.name}
                    </h2>

                    {/* Specialization Badge */}
                    <span className="mt-1 inline-block px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800">
                      {doctor.specialization}
                    </span>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="mt-4 text-sm text-gray-600">
                  <p className="flex items-center">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                    {doctor.email}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Doctor Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl mx-auto mt-6 relative w-full m-4">
            <div className="p-6">
              <button
                onClick={handleToggleForm}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                {editingDoctorId ? "Edit Doctor" : "Add New Doctor"}
              </h2>
              <Formik
                initialValues={newDoctor}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
                enableReinitialize
              >
                {({ errors, touched }) => (
                  <Form className="space-y-6">
                    {/* Name Field */}
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        id="name"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.name && touched.name ? (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.name}
                        </div>
                      ) : null}
                    </div>

                    {/* Specialization Field */}
                    <div>
                      <label
                        htmlFor="specialization"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Specialization
                      </label>
                      <Field
                        type="text"
                        name="specialization"
                        id="specialization"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.specialization && touched.specialization ? (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.specialization}
                        </div>
                      ) : null}
                    </div>

                    {/* Email Field */}
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Email
                      </label>
                      <Field
                        type="email"
                        name="email"
                        id="email"
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                      />
                      {errors.email && touched.email ? (
                        <div className="text-red-500 text-sm mt-1">
                          {errors.email}
                        </div>
                      ) : null}
                    </div>

                    {/* Form Buttons */}
                    <div className="flex justify-end space-x-3 mt-6">
                      <button
                        type="button"
                        onClick={handleToggleForm}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                      >
                        {editingDoctorId ? "Update Doctor" : "Add Doctor"}
                      </button>
                    </div>
                  </Form>
                )}
              </Formik>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Doctors;
