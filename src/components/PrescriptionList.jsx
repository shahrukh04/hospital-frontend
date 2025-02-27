import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import {
  MdOutlineDescription,
  MdPerson,
  MdLocalHospital,
  MdMedication,
  MdAccessTime,
  MdDelete,
  MdSearch,
  MdInfo,
  MdVaccines,
  MdHealthAndSafety,
  MdMedicalServices,
  MdOutlineWarning,
  MdViewList,
  MdViewModule,
} from "react-icons/md";
import {
  FaUser,
  FaTrashAlt,
  FaTrash ,
  FaUserMd,
  FaPills,
  FaInfoCircle,
  FaClock,
} from "react-icons/fa";
import AdComponent from "./AdComponent";
 
const PrescriptionList = () => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("table"); // 'table' or 'card'
 
  useEffect(() => {
    loadPrescriptions();
  }, []);
 
  const loadPrescriptions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getAllPrescriptions();
      setPrescriptions(response?.data || []);
    } catch (error) {
      console.error("Error loading prescriptions:", error);
      setError("Failed to load prescriptions");
    } finally {
      setLoading(false);
    }
  };
 
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this prescription?")) {
      try {
        await api.deletePrescription(id);
        loadPrescriptions();
      } catch (error) {
        console.error("Error deleting prescription:", error);
        setError("Failed to delete prescription");
      }
    }
  };
 
  const getMedicineIcon = (type) => {
    switch (type?.toLowerCase()) {
      case "tablet":
        return <MdMedication className="h-5 w-5 text-blue-500" />;
      case "syrup":
        return <MdMedicalServices className="h-5 w-5 text-green-500" />;
      case "injection":
        return <MdVaccines className="h-5 w-5 text-red-500" />;
      case "capsule":
        return <MdHealthAndSafety className="h-5 w-5 text-purple-500" />;
      default:
        return <MdMedication className="h-5 w-5 text-gray-500" />;
    }
  };
 
  const filteredPrescriptions = prescriptions.filter((prescription) => {
    return (
      prescription.patientName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      prescription.doctorName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });
 
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              <MdOutlineDescription className="h-8 w-8 text-indigo-600 mr-3" />
              Prescriptions
            </h1>
            <p className="mt-2 text-sm text-gray-600">
              Manage and view patient prescriptions
            </p>
          </div>
        </div>
 
        {/* Search & View Toggle Buttons */}
        <div className="mb-8 flex items-center space-x-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <MdSearch className="h-6 w-6 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by patient or doctor name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200"
            />
          </div>
 
          {/* View Toggle Buttons */}
          <div className="flex space-x-2">
            <button
              onClick={() => setViewMode("table")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${
                viewMode === "table"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <MdViewList className="h-6 w-6" />
              <span>Table</span>
            </button>
            <button
              onClick={() => setViewMode("card")}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-md transition-all duration-200 ${
                viewMode === "card"
                  ? "bg-gradient-to-r from-indigo-500 to-blue-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              <MdViewModule className="h-6 w-6" />
              <span>Cards</span>
            </button>
          </div>
        </div>
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
            <MdOutlineWarning className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}
 
        {/* Prescriptions */}
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
                      Patient Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Doctor Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Medicines
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Instructions
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Date
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
                  {filteredPrescriptions.map((prescription) => (
                    <tr
                      key={prescription._id}
                      className="transition-all hover:bg-blue-50"
                    >
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {prescription.patientName || "N/A"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {prescription.doctorName || "N/A"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {prescription.medicines
                          ?.map(
                            (medicine) =>
                              medicine.medicineName || "Not specified"
                          )
                          .join(", ")}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {prescription.instructions ||
                          "No specific instructions"}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-900">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          {/* <button
                            onClick={() =>
                              handleEditPrescription(prescription._id)
                            }
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <FaEdit className="mr-2 h-4 w-4" />
                            Edit
                          </button> */}
                          <button
                            onClick={() => handleDelete(prescription._id)}
                            className="inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg text-red-600 hover:text-red-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
 
                          >
                            <FaTrash className="mr-2 h-4 w-4" />
                            {/* Delete */}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
 
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredPrescriptions.map((prescription) => (
              <div
                key={prescription._id}
                className="bg-white rounded-2xl shadow-md border border-gray-200 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  {/* Patient Info */}
                  <div className="flex justify-between items-center mb-5">
                    <div className="flex items-center">
                      <div className="h-12 w-12 rounded-full bg-blue-100 flex items-center justify-center">
                        <FaUser className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {prescription.patientName || "N/A"}
                        </h3>
                        <p className="text-sm text-gray-500">
                          Age: {prescription.patientAge || "N/A"}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDelete(prescription._id)}
                      className="p-2 text-gray-600 hover:text-red-600 rounded-full bg-gray-100 hover:bg-red-100 transition-colors duration-200"
                    >
                      <FaTrashAlt className="h-5 w-5" />
                    </button>
                  </div>
 
                  {/* Doctor Info */}
                  <div className="mb-5 p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaUserMd className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">
                        Doctor Information
                      </h4>
                    </div>
                    <div className="ml-7 text-sm text-gray-600">
                      <p>
                        <strong>Name:</strong>{" "}
                        {prescription.doctorName || "Not specified"}
                      </p>
                      <p>
                        <strong>Specialization:</strong>{" "}
                        {prescription.doctorSpecialization || "Not specified"}
                      </p>
                    </div>
                  </div>
 
                  {/* Medicines */}
                  <div className="mb-5">
                    <div className="flex items-center mb-3">
                      <FaPills className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">
                        Prescribed Medicines
                      </h4>
                    </div>
                    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                      <table className="min-w-full divide-y divide-gray-200 text-sm">
                        <thead className="bg-gray-100">
                          <tr>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                              Medicine
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                              Dosage
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                              Frequency
                            </th>
                            <th className="px-4 py-3 text-left font-medium text-gray-500 uppercase">
                              Duration
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {prescription.medicines?.map((medicine, index) => (
                            <tr key={index} className="hover:bg-gray-50">
                              <td className="px-4 py-3 flex items-center">
                                {getMedicineIcon(medicine.type)}
                                <span className="ml-2">
                                  {medicine.medicineName ||
                                    medicine.medicineId?.name ||
                                    "Not specified"}
                                </span>
                              </td>
                              <td className="px-4 py-3">
                                {medicine.dosage || "N/A"}
                              </td>
                              <td className="px-4 py-3">
                                {medicine.frequency || "N/A"}
                              </td>
                              <td className="px-4 py-3">
                                {medicine.duration || "N/A"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
 
                  {/* Instructions */}
                  <div className="mb-4 p-4 bg-gray-100 rounded-lg">
                    <div className="flex items-center mb-2">
                      <FaInfoCircle className="h-5 w-5 text-blue-600 mr-2" />
                      <h4 className="font-medium text-gray-900">
                        Instructions
                      </h4>
                    </div>
                    <p className="text-sm text-gray-600">
                      {prescription.instructions || "No specific instructions"}
                    </p>
                  </div>
 
                  {/* Date and ID */}
                  <div className="mt-6 pt-4 border-t border-gray-200 text-xs text-gray-500 flex justify-between items-center">
                    <div className="flex items-center">
                      <FaClock className="h-4 w-4 mr-1" />
                      {new Date(prescription.createdAt).toLocaleDateString()}
                    </div>
                    <div>ID: {prescription._id}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
 
        {/* Empty State */}
        {(!prescriptions || prescriptions.length === 0) && (
          <div className="text-center py-12">
            <MdOutlineDescription className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No Prescriptions
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              No prescriptions found.
            </p>
          </div>
        )}
      </div>
<AdComponent/>
    </div>
  );
};
 
export default PrescriptionList;
 
 