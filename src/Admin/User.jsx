import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import Swal from "sweetalert2";
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  TableCellsIcon,
  Squares2X2Icon,
  UserIcon,
  UserGroupIcon,
  AcademicCapIcon,
  UserCircleIcon,
  BeakerIcon,
  ArchiveBoxIcon,
  BriefcaseIcon,
  PhoneIcon,
  EnvelopeIcon,
  KeyIcon,
  IdentificationIcon,
} from "@heroicons/react/24/outline";
import { FaTrash, FaEdit } from "react-icons/fa";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    username: "",
    phone: "",
  });
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState({
    key: "name",
    direction: "asc",
  });
  const [filterRole, setFilterRole] = useState("all");
  const [viewMode, setViewMode] = useState("card");

  const roleIcons = {
    admin: <UserCircleIcon className="h-5 w-5" />,
    doctor: <AcademicCapIcon className="h-5 w-5" />,
    patient: <UserIcon className="h-5 w-5" />,
    reception: <BriefcaseIcon className="h-5 w-5" />,
    nurse: <UserGroupIcon className="h-5 w-5" />,
    lab_technician: <BeakerIcon className="h-5 w-5" />,
    pharmacist: <ArchiveBoxIcon className="h-5 w-5" />,
  };

  const getRoleColor = (role) => {
    switch (role) {
      case "admin":
        return "text-purple-600 bg-purple-100";
      case "doctor":
        return "text-blue-600 bg-blue-100";
      case "patient":
        return "text-green-600 bg-green-100";
      case "reception":
        return "text-yellow-600 bg-yellow-100";
      case "nurse":
        return "text-pink-600 bg-pink-100";
      case "lab_technician":
        return "text-indigo-600 bg-indigo-100";
      case "pharmacist":
        return "text-orange-600 bg-orange-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getRoleIcon = (role) => {
    return roleIcons[role] || <UserIcon className="h-5 w-5" />;
  };

  useEffect(() => {
    loadRoles();
    loadUsers();
  }, []);

  // Load all available roles from the API
  const loadRoles = async () => {
    try {
      const response = await api.getAllUserRoles();
      const formattedRoles = response.data.map((role) => ({
        value: role.id || role.name.toLowerCase(),
        label: role.name || role.label,
        icon: roleIcons[role.name.toLowerCase()] || <UserIcon className="h-5 w-5" />,
      }));
      setRoles(formattedRoles);
    } catch (error) {
      console.error("Error loading roles:", error);
      // Fallback to default roles if API fails
      setRoles([
        {
          value: "admin",
          label: "Administrator",
          icon: <UserCircleIcon className="h-5 w-5" />,
        },
        {
          value: "doctor",
          label: "Doctor",
          icon: <AcademicCapIcon className="h-5 w-5" />,
        },
        {
          value: "patient",
          label: "Patient",
          icon: <UserIcon className="h-5 w-5" />,
        },
        {
          value: "reception",
          label: "Receptionist",
          icon: <BriefcaseIcon className="h-5 w-5" />,
        },
        {
          value: "nurse",
          label: "Nurse",
          icon: <UserGroupIcon className="h-5 w-5" />,
        },
        {
          value: "lab_technician",
          label: "Lab Technician",
          icon: <BeakerIcon className="h-5 w-5" />,
        },
        {
          value: "pharmacist",
          label: "Pharmacist",
          icon: <ArchiveBoxIcon className="h-5 w-5" />,
        },
      ]);
    }
  };

  // Load users from the API
  const loadUsers = async () => {
    try {
      let allUsers = [];
      if (roles.length > 0) {
        for (const role of roles) {
          try {
            const response = await api.getUsersWithRole(role.value);
            const usersWithRole = response.data.map((user) => ({
              ...user,
              role: role.value,
            }));
            allUsers = [...allUsers, ...usersWithRole];
          } catch (error) {
            console.error(`Error loading users with role ${role.value}:`, error);
          }
        }
      }
      setUsers(allUsers);
    } catch (error) {
      console.error("Error loading users:", error);
    }
  };

  // Show success message
  const showSuccess = (message) => {
    Swal.fire({
      icon: "success",
      title: "Success!",
      text: message,
      timer: 1500,
      showConfirmButton: false,
    });
  };

  // Show error message
  const showError = (message) => {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: message,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        // Update user profile
        await api.updateUserProfile({
          ...newUser,
          id: editingUser._id,
        });
        showSuccess("User updated successfully!");
      } else {
        // Add new user (assuming an endpoint exists)
        await api.addUser(newUser); // You need to implement this in your API service
        showSuccess("User added successfully!");
      }
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "patient",
        username: "",
        phone: "",
      });
      setIsModalOpen(false);
      loadUsers();
    } catch (error) {
      console.error("Error saving user:", error);
      showError(error.response?.data?.message || "An error occurred");
    }
  };

  // Handle editing a user
  const handleEdit = (user) => {
    setEditingUser(user);
    setNewUser({
      name: user.name,
      email: user.email,
      password: "", // Don't show password, but require new one for update
      role: user.role,
      username: user.username,
      phone: user.phone || "",
    });
    setIsModalOpen(true);
  };

  // Handle deleting a user
  const handleDelete = async (id) => {
    try {
      Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await api.deleteUser(id); // You need to implement this in your API service
          showSuccess("User deleted successfully!");
          loadUsers();
        }
      });
    } catch (error) {
      console.error("Error deleting user:", error);
      showError("Failed to delete user");
    }
  };

  // Filter and sort users
  const filteredUsers = users
    .filter(
      (user) =>
        (user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.username?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => filterRole === "all" || user.role === filterRole)
    .sort((a, b) => {
      if (!a[sortConfig.key] || !b[sortConfig.key]) return 0;
      if (sortConfig.direction === "asc") {
        return a[sortConfig.key] > b[sortConfig.key] ? 1 : -1;
      }
      return a[sortConfig.key] < b[sortConfig.key] ? 1 : -1;
    });

  return (
    <div className="min-h-full bg-gray-50 py-8">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
              <p className="mt-1 text-sm text-gray-500">Manage system users and permissions</p>
            </div>
            <button
              onClick={() => {
                setEditingUser(null);
                setNewUser({
                  name: "",
                  email: "",
                  password: "",
                  role: "patient",
                  username: "",
                  phone: "",
                });
                setIsModalOpen(true);
              }}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add New User
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
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
              />
            </div>

            <div className="flex gap-4">
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="appearance-none block w-full pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                >
                  <option value="all">All Roles</option>
                  {roles.map((role) => (
                    <option key={role.value} value={role.value}>
                      {role.label}
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

        {/* Users Grid */}
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
                      User
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Role
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider"
                    >
                      Status
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
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id || user.id}
                      className="transition-all hover:bg-blue-50"
                    >
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0">
                            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                              <span className="text-blue-600 font-semibold text-lg">
                                {user.name?.charAt(0) || "U"}
                              </span>
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">
                              {user.name || "Unknown"}
                            </div>
                            <div className="text-sm text-gray-500">
                              @{user.username || "username"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className={`px-4 py-2 inline-flex text-sm leading-5 font-semibold rounded-full ${getRoleColor(user.role)}`}>
                          {user.role || "unknown"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <span className="text-sm text-gray-900">
                          {user.email || "No email provided"}
                        </span>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap">
                        <div className="text-sm text-gray-600">
                          {user.isActive !== undefined ? (
                            user.isActive ? (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                                Active
                              </span>
                            ) : (
                              <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                                Inactive
                              </span>
                            )
                          ) : (
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                              Unknown
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5 whitespace-nowrap text-right">
                        <div className="flex justify-end space-x-3">
                          <div className="flex items-center space-x-2">
                            <div className="relative group">
                              <button
                                onClick={() => handleEdit(user)}
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
                                onClick={() => handleDelete(user._id || user.id)}
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
            {filteredUsers.map((user) => (
              <div
                key={user._id || user.id}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold text-gray-900">
                          {user.name || "Unknown"}
                        </h2>
                        <div className="flex items-center space-x-2">
                          <div className="relative group">
                            <button
                              onClick={() => handleEdit(user)}
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
                              onClick={() => handleDelete(user._id || user.id)}
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
                      <span className={`inline-block px-3 py-1 mt-2 text-sm font-medium rounded-full ${getRoleColor(user.role)}`}>
                        {user.role || "unknown"}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {/* Username & Email */}
                    <div>
                      <p className="text-sm text-gray-600 flex items-center">
                        <span className="flex items-center">
                          <UserIcon className="h-4 w-4 mr-2 text-gray-400" />
                          @{user.username || "username"}
                        </span>
                      </p>
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <span className="flex items-center">
                          <EnvelopeIcon className="h-4 w-4 mr-2 text-gray-400" />
                          {user.email || "No email provided"}
                        </span>
                      </p>
                    </div>
                    
                    {/* Status & Last Login */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${
                        user.isActive !== undefined ? (
                          user.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        ) : "bg-gray-100 text-gray-800"
                      }`}>
                        {user.isActive !== undefined ? (user.isActive ? "Active" : "Inactive") : "Unknown"}
                      </span>
                      <span className="text-sm text-gray-500">
                        {user.lastLogin ? `Last login: ${new Date(user.lastLogin).toLocaleDateString()}` : "No login data"}
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
          <div className="fixed inset-0 z-50 backdrop-blur-sm">
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
                      {editingUser ? "Edit User" : "Add New User"}
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
                        Full Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <IdentificationIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={newUser.name}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              name: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
                          placeholder="Enter full name"
                          required
                        />
                      </div>
                    </div>

                    {/* Username Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <UserIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="text"
                          value={newUser.username}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              username: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
                          placeholder="Enter username"
                          required
                        />
                      </div>
                    </div>

                    {/* Email Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="email"
                          value={newUser.email}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              email: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
                          placeholder="Enter email address"
                          required
                        />
                      </div>
                    </div>

                    {/* Password Field */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        {editingUser ? "New Password (leave blank to keep current)" : "Password"}
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <KeyIcon className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="password"
                          value={newUser.password}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              password: e.target.value,
                            })
                          }
                          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
                          placeholder={editingUser ? "Enter new password" : "Enter password"}
                          required={!editingUser}
                        />
                      </div>
                    </div>

                    {/* Phone and Role in Grid */}
                    <div className="grid grid-cols-2 gap-4">
                      {/* Phone Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <PhoneIcon className="h-5 w-5 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            value={newUser.phone}
                            onChange={(e) =>
                              setNewUser({
                                ...newUser,
                                phone: e.target.value,
                              })
                            }
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200 ease-in-out text-gray-700 text-sm"
                            placeholder="Enter phone number"
                          />
                        </div>
                      </div>

                      {/* Role Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          User Role
                        </label>
                        <select
                          value={newUser.role}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              role: e.target.value,
                            })
                          }
                          className="w-full pl-4 pr-10 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-gray-700 text-sm"
                          required
                        >
                          {roles.map((role) => (
                            <option key={role.value} value={role.value}>
                              {role.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        className="w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
                      >
                        {editingUser ? "Update User" : "Add User"}
                      </button>
                    </div>
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

export default Users;