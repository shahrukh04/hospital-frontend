import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";

import {
  PlusIcon,
  PencilSquareIcon,
  TrashIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  BuildingOfficeIcon,
  UserGroupIcon,
  CurrencyDollarIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";

const Department = () => {
  const [departments, setDepartments] = useState([]);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    description: "",
    head: { name: "", contactNumber: "" },
    location: { building: "", floor: "", roomNumbers: [] },
    staffCount: 0,
    specialties: [],
    active: true,
    budget: { allocated: 0, spent: 0 },
  });
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filterActive, setFilterActive] = useState("all");

  useEffect(() => {
    loadDepartments();
  }, []);

  const loadDepartments = async () => {
    try {
      const response = await api.getAllDepartments();
      setDepartments(response.data);
    } catch (error) {
      console.error("Error loading departments:", error);
    }
  };

  const showSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingDepartment) {
        await api.updateDepartment(editingDepartment._id, newDepartment);
        setEditingDepartment(null);
        showSuccess("Department updated successfully!");
      } else {
        await api.addDepartment(newDepartment);
        showSuccess("Department added successfully!");
      }
      setNewDepartment({
        name: "",
        description: "",
        head: { name: "", contactNumber: "" },
        location: { building: "", floor: "", roomNumbers: [] },
        staffCount: 0,
        specialties: [],
        active: true,
        budget: { allocated: 0, spent: 0 },
      });
      setIsModalOpen(false);
      loadDepartments();
    } catch (error) {
      console.error("Error saving department:", error);
    }
  };

  const handleEdit = (department) => {
    setEditingDepartment(department);
    setNewDepartment(department);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteDepartment(id);
      showSuccess("Department deleted successfully!");
      loadDepartments();
    } catch (error) {
      console.error("Error deleting department:", error);
    }
  };

  const filteredDepartments = departments
    .filter(
      (department) =>
        department.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterActive === "all" ||
          (filterActive === "active" && department.active) ||
          (filterActive === "inactive" && !department.active))
    )
    .sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  return (
    <div className="min-h-full bg-gray-50 py-8">
      <div className="max-w-1xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage your hospital's departments
            </p>
          </div>
          <button
            onClick={() => {
              setEditingDepartment(null);
              setNewDepartment({
                name: "",
                description: "",
                head: { name: "", contactNumber: "" },
                location: { building: "", floor: "", roomNumbers: [] },
                staffCount: 0,
                specialties: [],
                active: true,
                budget: { allocated: 0, spent: 0 },
              });
              setIsModalOpen(true);
            }}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Department
          </button>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search departments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            />
          </div>

          <div className="relative">
            <select
              value={filterActive}
              onChange={(e) => setFilterActive(e.target.value)}
              className="appearance-none block w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
            >
              <option value="all">All Departments</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
            <FunnelIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow-xl">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gradient-to-r from-blue-50 to-blue-100">
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Dep.Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Head Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Head contect Number
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Staff Count
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDepartments.map((department) => (
                <tr
                  key={department._id}
                  className="transition-all hover:bg-blue-50"
                >
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm font-semibold text-gray-900">
                      {department.name}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {department.head?.name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {department.head?.contactNumber || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      {department.staffCount}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap">
                    <div className="text-sm text-gray-600">
                      ${department.budget?.allocated || 0}
                    </div>
                  </td>
                  <td className="px-6 py-5 whitespace-nowrap text-right">
                    <button
                      onClick={() => handleEdit(department)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <PencilSquareIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleDelete(department._id)}
                      className="text-red-500 hover:text-red-700 ml-4"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="fixed inset-0 z-50 backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen px-4">
              <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg">
                <form onSubmit={handleSubmit}>
                  <h3 className="text-lg font-semibold mb-4">
                    {editingDepartment ? "Edit Department" : "Add Department"}
                  </h3>
                  <div className="space-y-4">
                    {/* Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={newDepartment.name}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            name: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        required
                      />
                    </div>

                    {/* Description Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={newDepartment.description}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            description: e.target.value,
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        rows="3"
                      />
                    </div>

                    {/* Head Name Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Head Name
                      </label>
                      <input
                        type="text"
                        value={newDepartment.head?.name || ""}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            head: {
                              ...newDepartment.head,
                              name: e.target.value,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Head Contact Number Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Head Contact Number
                      </label>
                      <input
                        type="text"
                        value={newDepartment.head?.contactNumber || ""}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            head: {
                              ...newDepartment.head,
                              contactNumber: e.target.value,
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      />
                    </div>

                    {/* Staff Count Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Staff Count
                      </label>
                      <input
                        type="number"
                        value={newDepartment.staffCount}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            staffCount: parseInt(e.target.value, 10),
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        min="0"
                      />
                    </div>

                    {/* Budget Allocated Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget Allocated
                      </label>
                      <input
                        type="number"
                        value={newDepartment.budget?.allocated || ""}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            budget: {
                              ...newDepartment.budget,
                              allocated: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        min="0"
                      />
                    </div>

                    {/* Budget Spent Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Budget Spent
                      </label>
                      <input
                        type="number"
                        value={newDepartment.budget?.spent || ""}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            budget: {
                              ...newDepartment.budget,
                              spent: parseFloat(e.target.value),
                            },
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                        min="0"
                      />
                    </div>

                    {/* Active Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Active
                      </label>
                      <select
                        value={newDepartment.active}
                        onChange={(e) =>
                          setNewDepartment({
                            ...newDepartment,
                            active: e.target.value === "true",
                          })
                        }
                        className="w-full border border-gray-300 rounded-lg px-4 py-2"
                      >
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-end">
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-4 py-2 bg-gray-200 rounded-lg mr-2"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
                    >
                      {editingDepartment ? "Update" : "Add"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Department;
