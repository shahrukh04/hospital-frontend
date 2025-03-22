import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  TableCellsIcon,
  Squares2X2Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api"; // Import API functions

const PatientModel = () => {
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("card"); // Toggle between "card" and "table"
  const [newPatient, setNewPatient] = useState({
    name: "",
    age: "",
    gender: "",
    phone: "",
    address: "",
    insuranceDetails: {
      provider: "",
      policyNumber: "",
      coverage: "",
    },
  });
  const [editingPatientId, setEditingPatientId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all patients from the API
  const getAllPatients = async () => {
    try {
      const response = await api.getAllPatients();
      console.log("petient  ", response.data);
      setPatients(response.data);
      setFilteredPatients(response.data);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
      toast.error("Failed to fetch patients.");
    }
  };

  // ✅ Call the function to fetch patients on component mount
  useEffect(() => {
    getAllPatients();
  }, []);

  // ✅ Filter patients by search term
  const filterPatients = (searchTerm) => {
    const filtered = patients.filter(
      (patient) =>
        patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.phone.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patient.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPatients(filtered);
  };

  // ✅ Toggle the form to add or edit a patient
  const handleToggleForm = () => {
    setNewPatient({
      name: "",
      age: "",
      gender: "",
      phone: "",
      address: "",
      insuranceDetails: {
        provider: "",
        policyNumber: "",
        coverage: "",
      },
    });
    setShowForm(!showForm);
    setEditingPatientId(null);
  };

  // ✅ Handle form submission (add or edit patient)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingPatientId) {
        // Update existing patient
        await api.updatePatient(editingPatientId, newPatient);
        toast.success("Patient updated successfully!");
      } else {
        // Add new patient
        await api.addPatient(newPatient);
        toast.success("Patient added successfully!");
      }
      getAllPatients(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit patient details.");
      console.error(error);
    }
  };

  // ✅ Edit an existing patient
  const handleEditPatient = (patient) => {
    setNewPatient(patient);
    setEditingPatientId(patient._id);
    setShowForm(true);
  };

  // ✅ Delete a patient
  const handleDelete = async (id) => {
    try {
      await api.deletePatient(id);
      toast.success("Patient deleted successfully!");
      getAllPatients(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete patient.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-3 py-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Patient Management</h1>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => setViewMode("card")}
            className={`p-2 rounded-lg ${
              viewMode === "card" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            <Squares2X2Icon className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("table")}
            className={`p-2 rounded-lg ${
              viewMode === "table" ? "bg-indigo-600 text-white" : "bg-gray-200"
            }`}
          >
            <TableCellsIcon className="h-5 w-5" />
          </button>
          <button
            onClick={handleToggleForm}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Patient
          </button>
        </div>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search patients..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            filterPatients(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
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

      {viewMode === "card" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <div
              key={patient._id}
              className="bg-white rounded-xl shadow-lg p-6 relative"
            >
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleEditPatient(patient)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(patient._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold">{patient.name}</h2>
                <p className="text-sm text-gray-600">Phone: {patient.phone}</p>
                <p className="text-sm text-gray-600">Address: {patient.address}</p>
                <p className="text-sm text-gray-600">
                  Insurance: {patient.insuranceDetails?.provider || "N/A"}
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Phone</th>
                <th className="px-4 py-2 border">Address</th>
                <th className="px-4 py-2 border">Insurance</th>
                <th className="px-4 py-2 border">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.map((patient) => (
                <tr key={patient._id}>
                  <td className="px-4 py-2 border">{patient.name}</td>
                  <td className="px-4 py-2 border">{patient.phone}</td>
                  <td className="px-4 py-2 border">{patient.address}</td>
                  <td className="px-4 py-2 border">
                    {patient.insuranceDetails?.provider || "N/A"}
                  </td>
                  <td className="px-4 py-2 border">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPatient(patient)}
                        className="text-blue-600 hover:text-blue-700"
                      >
                        <PencilIcon className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(patient._id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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
              {editingPatientId ? "Edit Patient" : "Add New Patient"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium">Name</label>
                <input
                  type="text"
                  value={newPatient.name}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, name: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md shadow-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Age</label>
                <input
                  type="number"
                  value={newPatient.age}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, age: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Gender</label>
                <select
                  value={newPatient.gender}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, gender: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md shadow-sm"
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium">Phone</label>
                <input
                  type="text"
                  value={newPatient.phone}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, phone: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">Address</label>
                <input
                  type="text"
                  value={newPatient.address}
                  onChange={(e) =>
                    setNewPatient({ ...newPatient, address: e.target.value })
                  }
                  className="w-full mt-1 border rounded-md shadow-sm"
                />
              </div>
              <div>
                <label className="block text-sm font-medium">
                  Insurance Provider
                </label>
                <input
                  type="text"
                  value={newPatient.insuranceDetails.provider}
                  onChange={(e) =>
                    setNewPatient({
                      ...newPatient,
                      insuranceDetails: {
                        ...newPatient.insuranceDetails,
                        provider: e.target.value,
                      },
                    })
                  }
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
                  {editingPatientId ? "Update Patient" : "Add Patient"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientModel;