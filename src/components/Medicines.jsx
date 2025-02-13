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
  CurrencyDollarIcon,
  ArchiveBoxIcon,
  ClockIcon,
  TagIcon,
  InformationCircleIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
  BeakerIcon,
  TableCellsIcon,
  Square2StackIcon,
  Squares2X2Icon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { FaTrash, FaEdit } from "react-icons/fa";
const Medicines = () => {
  const [medicines, setMedicines] = useState([]);
  const [newMedicine, setNewMedicine] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    expiryDate: "",
    manufacturer: "",
  });
  const [editingMedicine, setEditingMedicine] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filterCategory, setFilterCategory] = useState("all");
  const [viewMode, setViewMode] = useState("card");
 
  const categories = [
    {
      value: "tablets",
      label: "Tablets",
      icon: <TableCellsIcon className="h-5 w-5" />,
    },
    {
      value: "syrups",
      label: "Syrups",
      icon: <BeakerIcon className="h-5 w-5" />,
    },
    {
      value: "injections",
      label: "Injections",
      icon: <ArrowPathIcon className="h-5 w-5" />,
    },
    {
      value: "capsules",
      label: "Capsules",
      icon: <Square2StackIcon className="h-5 w-5" />,
    },
  ];
 
  const getStockStatusColor = (stock) => {
    if (stock <= 0) return "text-red-600 bg-red-100";
    if (stock < 10) return "text-yellow-600 bg-yellow-100";
    return "text-green-600 bg-green-100";
  };
 
  const getStockIcon = (stock) => {
    if (stock <= 0) return <ExclamationCircleIcon className="h-5 w-5" />;
    if (stock < 10) return <InformationCircleIcon className="h-5 w-5" />;
    return <CheckCircleIcon className="h-5 w-5" />;
  };
 
  useEffect(() => {
    loadMedicines();
  }, []);
 
  const loadMedicines = async () => {
    try {
      const response = await api.getAllMedicines();
      setMedicines(response.data);
    } catch (error) {
      console.error("Error loading medicines:", error);
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
      if (editingMedicine) {
        await api.updateMedicine(editingMedicine._id, newMedicine);
        setEditingMedicine(null);
        showSuccess("Medicine updated successfully!");
      } else {
        await api.addMedicine(newMedicine);
        showSuccess("Medicine added successfully!");
      }
      setNewMedicine({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        expiryDate: "",
        manufacturer: "",
      });
      setIsModalOpen(false);
      loadMedicines();
    } catch (error) {
      console.error("Error saving medicine:", error);
    }
  };
 
  const handleEdit = (medicine) => {
    setEditingMedicine(medicine);
    setNewMedicine({
      name: medicine.name,
      description: medicine.description,
      price: medicine.price,
      stock: medicine.stock,
      category: medicine.category,
      expiryDate: medicine.expiryDate,
      manufacturer: medicine.manufacturer,
    });
    setIsModalOpen(true);
  };
 
  const handleDelete = async (id) => {
    try {
      await api.deleteMedicine(id);
      showSuccess("Medicine delete successfully!");
      loadMedicines();
    } catch (error) {
      console.error("Error deleting medicine:", error);
    }
  };
 
  const filteredMedicines = medicines
    .filter(
      (medicine) =>
        medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (filterCategory === "all" || medicine.category === filterCategory)
    )
    .sort((a, b) => {
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });
 
  return (
    <div className="min-h-full bg-gray-50 py-8 ">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Medicines Inventory
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your medicine stock and inventory
              </p>
            </div>
            <button
              onClick={() => {
                setEditingMedicine(null);
                setNewMedicine({
                  name: "",
                  description: "",
                  price: "",
                  stock: "",
                  category: "",
                  expiryDate: "",
                  manufacturer: "",
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New Medicine
            </button>
          </div>
 
          {/* Search and Filter Section */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search medicines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>
 
            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                  className="appearance-none block w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
                <FunnelIcon className="h-5 w-5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
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
        </div>
 
        {/* Medicines Grid */}
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
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Price
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Stock
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
                  {filteredMedicines.map((medicine) => (
                    <tr
                      key={medicine._id}
                      className="transition-all hover:bg-blue-50"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">
                                {medicine.name.charAt(0)}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {medicine.name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {medicine.category}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="px-4 py-2 inline-flex text-sm leading-5 font-bold">
                          $ {medicine.price}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {medicine.stock} in stock
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="relative group">
                              <button
                                onClick={() => handleEdit(medicine)}
                                className="text-blue-500 hover:text-blue-700"
                              >
                                <FaEdit className="mr-2 text-xl" />
                              </button>
                              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-sm text-white bg-blue-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Edit
                              </span>
                            </div>
                            <div className="relative group">
                              <button
                                onClick={() => handleDelete(medicine._id)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <FaTrash className="mr-2 text-xl" />
                              </button>
                              <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-sm text-white bg-red-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                Delete
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMedicines.map((medicine) => (
              <div
                key={medicine._id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                          {medicine.name}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <div className="relative group">
                            <button
                              onClick={() => handleEdit(medicine)}
                              className="text-blue-500 hover:text-blue-700"
                            >
                              <FaEdit className="mr-2 text-xl" />
                            </button>
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-sm text-white bg-blue-800 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Edit
                            </span>
                          </div>
                          <div className="relative group">
                            <button
                              onClick={() => handleDelete(medicine._id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <FaTrash className="mr-2 text-xl" />
                            </button>
                            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full text-sm text-white bg-red-600 px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                              Delete
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full bg-blue-50 text-blue-700">
                        {medicine.category}
                      </span>
                    </div>
                  </div>
 
                  <div className="space-y-4">
                    {/* Description */}
                    <p className="text-sm text-gray-600 flex items-center justify-between">
                      <span className="line-clamp-1">
                        {medicine.description}
                      </span>
                      <span className="ml-2 whitespace-nowrap">
                        Stock: {medicine.stock}
                      </span>
                    </p>
                    {/* Price and Expiry */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xl font-bold text-blue-600">
                        ${medicine.price}
                      </span>
                      <span className="text-sm text-gray-500">
                        Exp:{" "}
                        {new Date(medicine.expiryDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        {/* Modal */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50  backdrop-blur-sm">
            <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 transition-opacity"
                aria-hidden="true"
              >
                <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
              </div>
 
              <div className="inline-block align-bottom bg-white rounded-2xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-100">
  <form onSubmit={handleSubmit} className="p-6">
    {/* Header */}
    <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
      <h3 className="text-2xl font-semibold text-gray-800">
        {editingMedicine ? "Edit Medicine" : "Add New Medicine"}
      </h3>
      <button
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="text-gray-400 hover:text-gray-500 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-full"
      >
        <XMarkIcon className="h-6 w-6" />
      </button>
    </div>
 
    <div className="space-y-5">
      {/* Name Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Medicine Name
        </label>
        <input
          type="text"
          value={newMedicine.name}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              name: e.target.value,
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
          placeholder="Enter medicine name"
          required
        />
      </div>
 
      {/* Description Field */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          value={newMedicine.description}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              description: e.target.value,
            })
          }
          rows="3"
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
          placeholder="Enter medicine description"
          required
        />
      </div>
 
      {/* Price and Stock in Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Price
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <CurrencyDollarIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={newMedicine.price}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  price: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
              placeholder="0.00"
              required
            />
          </div>
        </div>
 
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Stock
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <ArchiveBoxIcon className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="number"
              value={newMedicine.stock}
              onChange={(e) =>
                setNewMedicine({
                  ...newMedicine,
                  stock: e.target.value,
                })
              }
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
              placeholder="0"
              required
            />
          </div>
        </div>
      </div>
 
      {/* Category Dropdown */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Category
        </label>
        <select
          value={newMedicine.category}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              category: e.target.value,
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm bg-white"
          required
        >
          <option value="">Select category</option>
          {categories.map((category) => (
            <option key={category.value} value={category.value}>
              {category.label}
            </option>
          ))}
        </select>
      </div>
 
      {/* Expiry Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Expiry Date
        </label>
        <input
          type="date"
          value={newMedicine.expiryDate}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              expiryDate: e.target.value,
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
          required
        />
      </div>
 
      {/* Manufacturer */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Manufacturer
        </label>
        <input
          type="text"
          value={newMedicine.manufacturer}
          onChange={(e) =>
            setNewMedicine({
              ...newMedicine,
              manufacturer: e.target.value,
            })
          }
          className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
          placeholder="Enter manufacturer name"
          required
        />
      </div>
    </div>
 
    {/* Action Buttons */}
    <div className="mt-8 flex justify-end space-x-3">
      <button
        type="button"
        onClick={() => setIsModalOpen(false)}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      >
        Cancel
      </button>
      <button
        type="submit"
        className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-200 ease-in-out"
      >
        {editingMedicine ? "Update Medicine" : "Add Medicine"}
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
 
export default Medicines;
 
 