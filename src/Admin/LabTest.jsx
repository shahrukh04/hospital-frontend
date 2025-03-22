import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { api } from "../services/api"; // Import API functions

const LabTest = () => {
  const [labTests, setLabTests] = useState([]);
  const [filteredLabTests, setFilteredLabTests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newLabTest, setNewLabTest] = useState({
    patient: "",
    testType: "",
    urgency: "routine",
    instructions: "",
    clinicalInfo: "",
    status: "ordered",
    results: "",
    notes: "",
    performedBy: "",
    attachments: [],
    referenceRanges: "",
  });
  const [editingLabTestId, setEditingLabTestId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all lab tests from the API
  const getAllLabTests = async () => {
    try {
      const response = await api.getAllLabTests();
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        setLabTests(response.data.data);
        setFilteredLabTests(response.data.data);
      } else {
        console.error("Unexpected API response format:", response.data);
        setLabTests([]);
        setFilteredLabTests([]);
        toast.error("Failed to load lab tests. Unexpected data format.");
      }
    } catch (error) {
      console.error("Failed to fetch lab tests:", error);
      setLabTests([]);
      setFilteredLabTests([]);
      toast.error("Failed to fetch lab tests.");
    }
  };

  // ✅ Call the function to fetch lab tests on component mount
  useEffect(() => {
    getAllLabTests();
  }, []);

  // ✅ Filter lab tests by search term
  const filterLabTests = (searchTerm) => {
    if (!Array.isArray(labTests)) {
      setFilteredLabTests([]);
      return;
    }

    const filtered = labTests.filter(
      (test) =>
        test.patient?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.testType?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.status?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredLabTests(filtered);
  };

  // ✅ Toggle the form to add or edit a lab test
  const handleToggleForm = () => {
    setNewLabTest({
      patient: "",
      testType: "",
      urgency: "routine",
      instructions: "",
      clinicalInfo: "",
      status: "ordered",
      results: "",
      notes: "",
      performedBy: "",
      attachments: [],
      referenceRanges: "",
    });
    setShowForm(!showForm);
    setEditingLabTestId(null);
  };

  // ✅ Handle form submission (add or edit lab test)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingLabTestId) {
        // Update existing lab test
        await api.updateLabTestStatus(editingLabTestId, newLabTest);
        toast.success("Lab test updated successfully!");
      } else {
        // Add new lab test
        await api.orderLabTest(newLabTest);
        toast.success("Lab test ordered successfully!");
      }
      getAllLabTests(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit lab test details.");
      console.error(error);
    }
  };

  // ✅ Edit an existing lab test
  const handleEditLabTest = (labTest) => {
    setNewLabTest(labTest);
    setEditingLabTestId(labTest._id);
    setShowForm(true);
  };

  // ✅ Delete a lab test
  const handleDelete = async (id) => {
    try {
      await api.deleteLabTest(id);
      toast.success("Lab test deleted successfully!");
      getAllLabTests(); // Refresh the list
    } catch (error) {
      toast.error("Failed to delete lab test.");
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto px-3 py-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Lab Test Management</h1>
        <button
          onClick={handleToggleForm}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Lab Test
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search lab tests..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            filterLabTests(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.isArray(filteredLabTests) && filteredLabTests.length > 0 ? (
          filteredLabTests.map((test) => (
            <div
              key={test._id}
              className="bg-white rounded-xl shadow-lg p-6 relative"
            >
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => handleEditLabTest(test)}
                  className="text-blue-600 hover:text-blue-700"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleDelete(test._id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </div>
              <div>
                <h2 className="text-lg font-semibold">
                  Patient: {test.patient?.name || "Unknown"}
                </h2>
                <p className="text-sm text-gray-600">Test Type: {test.testType || "N/A"}</p>
                <p className="text-sm text-gray-600">Urgency: {test.urgency || "N/A"}</p>
                <p className="text-sm text-gray-600">Status: {test.status || "Pending"}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500">No lab tests found.</p>
          </div>
        )}
      </div>

      {showForm && (
  <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 relative mx-4 overflow-y-auto max-h-screen">
      {/* Close Button */}
      <button
        onClick={handleToggleForm}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition-colors"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>

      {/* Form Title */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        {editingLabTestId ? "Edit Lab Test" : "Add New Lab Test"}
      </h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Patient ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Patient ID
          </label>
          <input
            type="text"
            value={newLabTest.patient}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, patient: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="Enter Patient ID"
            required
          />
        </div>

        {/* Test Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Test Type
          </label>
          <input
            type="text"
            value={newLabTest.testType}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, testType: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="Enter Test Type"
            required
          />
        </div>

        {/* Urgency */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Urgency
          </label>
          <select
            value={newLabTest.urgency}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, urgency: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            required
          >
            <option value="routine">Routine</option>
            <option value="urgent">Urgent</option>
            <option value="stat">Stat</option>
          </select>
        </div>

        {/* Instructions */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Instructions
          </label>
          <textarea
            value={newLabTest.instructions}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, instructions: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            rows="3"
            placeholder="Enter Instructions"
          />
        </div>

        {/* Clinical Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Clinical Info
          </label>
          <textarea
            value={newLabTest.clinicalInfo}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, clinicalInfo: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            rows="3"
            placeholder="Enter Clinical Info"
          />
        </div>

        {/* Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Status
          </label>
          <select
            value={newLabTest.status}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, status: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            required
          >
            <option value="ordered">Ordered</option>
            <option value="sample_collected">Sample Collected</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {/* Results */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Results
          </label>
          <textarea
            value={newLabTest.results}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, results: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            rows="3"
            placeholder="Enter Results"
          />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            value={newLabTest.notes}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, notes: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            rows="3"
            placeholder="Enter Notes"
          />
        </div>

        {/* Performed By */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Performed By
          </label>
          <input
            type="text"
            value={newLabTest.performedBy}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, performedBy: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="Enter Performed By"
          />
        </div>

        {/* Reference Ranges */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Reference Ranges
          </label>
          <input
            type="text"
            value={newLabTest.referenceRanges}
            onChange={(e) =>
              setNewLabTest({ ...newLabTest, referenceRanges: e.target.value })
            }
            className="w-full mt-1 border border-gray-300 rounded-lg shadow-sm p-2.5 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
            placeholder="Enter Reference Ranges"
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={handleToggleForm}
            className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-5 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            {editingLabTestId ? "Update Lab Test" : "Add Lab Test"}
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </div>
  );
};

export default LabTest;