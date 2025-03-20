import React, { useState, useEffect } from "react";
import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaEdit, FaTrash } from "react-icons/fa";
import {
  PlusIcon,
  XMarkIcon,
  MagnifyingGlassIcon,
  UserIcon,
} from "@heroicons/react/24/outline";

import { api } from "../services/api"; // Import your existing API functions

const Staff = () => {
  const [staff, setStaff] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [attendanceForm, setAttendanceForm] = useState({ date: "", status: "" });
  const [selectedStaffId, setSelectedStaffId] = useState(null);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [newStaff, setNewStaff] = useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    department: "",
    address: "",
    dateOfBirth: "",
  });
  const [editingStaffId, setEditingStaffId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ✅ Fetch all staff from the API
  const getAllStaff = async () => {
    try {
      const response = await api.getAllStaff();
      setStaff(response.data);
      setFilteredStaff(response.data);
    } catch (error) {
      console.error("Failed to fetch staff:", error);
      toast.error("Failed to fetch staff.");
    }
  };

  // ✅ Fetch attendance for a specific staff member
  const fetchAttendance = async (staffId) => {
    try {
      const response = await api.getStaffAttendance(staffId);
      setAttendance(response.data);
      setSelectedStaffId(staffId);
    } catch (error) {
      toast.error("Failed to fetch attendance.");
      console.error(error);
    }
  };

  // ✅ Add or update attendance for a staff member
  const handleAddAttendance = async () => {
    debugger;
    try {
      if (!attendanceForm.date || !attendanceForm.status) {
        toast.error("Please fill in both the date and status fields.");
        return;
      }
  
      const { date, status } = attendanceForm;
  
      // Check if attendance already exists for this date
      const existingAttendance = attendance.find(
        (record) =>
          new Date(record.date).toDateString() === new Date(date).toDateString()
      );
  
      if (existingAttendance) {
        // Ask if user wants to update the existing record
        const result = await Swal.fire({
          title: "Attendance already exists",
          text: `Attendance for ${new Date(date).toLocaleDateString()} already exists as "${existingAttendance.status}". Do you want to update it?`,
          icon: "warning",
          showCancelButton: true,
          confirmButtonText: "Yes, update it",
          cancelButtonText: "No, cancel",
        });
  
        if (result.isConfirmed) {
          // Update the existing record
          await api.updateAttendance(
            selectedStaffId,
            existingAttendance._id,
            status
          );
          toast.success("Attendance updated successfully!");
        }
      } else {
        // Add new attendance record
        await api.addStaffAttendance({ staffId: selectedStaffId, date, status });
        toast.success("Attendance added successfully!");
      }
  
      fetchAttendance(selectedStaffId); // Refresh attendance
      setAttendanceForm({ date: "", status: "" }); // Reset the form
    } catch (error) {
      toast.error("Failed to add/update attendance.");
      console.error(error);
    }
  };

  // Update attendance for a specific staff member
// Update attendance for a specific staff member
// const updateAttendance = async (req, res) => {
//   try {
//     const { staffId, attendanceId } = req.params;
//     const { status } = req.body;

//     // Find the staff member by ID
//     const staff = await Staff.findById(staffId);
//     if (!staff) {
//       return res.status(404).json({ message: "Staff member not found" });
//     }

//     // Find the specific attendance record by ID
//     const attendanceRecord = staff.attendance.id(attendanceId);
//     if (!attendanceRecord) {
//       return res.status(404).json({ message: "Attendance record not found" });
//     }

//     // Update the status of the attendance record
//     attendanceRecord.status = status;
//     await staff.save();

//     res.status(200).json({
//       message: "Attendance updated successfully",
//       attendance: staff.attendance,
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Failed to update attendance", error });
//   }
// };
  // ✅ Delete an attendance record
  const handleDeleteAttendance = async (attendanceId) => {
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
        await api.deleteAttendance(selectedStaffId, attendanceId);
        toast.success("Attendance deleted successfully!");
        fetchAttendance(selectedStaffId); // Refresh attendance
      }
    } catch (error) {
      toast.error("Failed to delete attendance.");
      console.error(error);
    }
  };

  // ✅ Handle form submission (add or edit staff)
  const handleSubmit = async (values) => {
    try {
      
      if (editingStaffId) {
        // Update existing staff
        await api.updateStaffMember(editingStaffId, values);
        toast.success("Staff updated successfully!");
      } else {
        // Add new staff
        await api.addStaff(values);
        toast.success("Staff added successfully!");
      }
      getAllStaff(); // Refresh the list
      setShowForm(false);
    } catch (error) {
      toast.error("Failed to submit staff details.");
      console.error(error);
    }
  };

  // ✅ Edit an existing staff member
  const handleEditStaff = async (staffId) => {
  
    try {
      const response = await api.getStaff(staffId);
      setNewStaff(response.data);
      setEditingStaffId(staffId);
      setShowForm(true);
    } catch (error) {
      toast.error("Failed to fetch staff details.");
      console.error(error);
    }
  };

  // ✅ Delete a staff member
  const handleDeleteStaff = async (staffId) => {
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
        await api.deleteStaff(staffId);
        toast.success("Staff deleted successfully!");
        getAllStaff(); // Refresh the list
      }
    } catch (error) {
      toast.error("Failed to delete staff.");
      console.error(error);
    }
  };

  // ✅ Filter staff by search term
  const filterStaff = (searchTerm) => {
    const filtered = staff.filter(
      (member) =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.phone.includes(searchTerm)
    );
    setFilteredStaff(filtered);
  };

  // ✅ Toggle the form to add a new staff member
  const handleToggleForm = () => {
    setNewStaff({
      name: "",
      role: "",
      phone: "",
      email: "",
      department: "",
      address: "",
      dateOfBirth: "",
    });
    setShowForm(!showForm);
    setEditingStaffId(null);
  };

  // ✅ Validation schema for staff form
  const validationSchema = Yup.object({
    name: Yup.string()
      .min(3, "Name must be at least 3 characters")
      .required("Name is required"),
    role: Yup.string().required("Role is required"),
    phone: Yup.string()
      .matches(/^\d+$/, "Phone must be a valid number")
      .required("Phone is required"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    department: Yup.string().required("Department is required"),
    address: Yup.string().required("Address is required"),
    dateOfBirth: Yup.date().required("Date of Birth is required"),
  });

  // ✅ Fetch all staff on component mount
  useEffect(() => {
    getAllStaff();
  }, []);

  return (
    <div className="container mx-auto px-3 py-6">
      <ToastContainer />

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Staff Management</h1>
        <button
          onClick={handleToggleForm}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Staff
        </button>
      </div>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search staff..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            filterStaff(e.target.value);
          }}
          className="w-full pl-10 pr-4 py-3 border rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-400"
        />
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((member) => (
          <div
            key={member._id}
            className="bg-white rounded-xl shadow-lg p-6 relative"
          >
            <div className="absolute top-4 right-4 flex space-x-2">
              <button
                onClick={() => handleEditStaff(member._id)}
                className="text-blue-600 hover:text-blue-700"
              >
                <FaEdit className="h-5 w-5" />
              </button>
              <button
                onClick={() => handleDeleteStaff(member._id)}
                className="text-red-600 hover:text-red-700"
              >
                <FaTrash className="h-5 w-5" />
              </button>
            </div>
            <div className="flex items-center space-x-4">
              <div className="h-14 w-14 rounded-full bg-indigo-100 flex items-center justify-center">
                <UserIcon className="h-7 w-7 text-indigo-600" />
              </div>
              <div>
                <h2 className="text-lg font-semibold">{member.name}</h2>
                <p className="text-sm text-gray-600">{member.role}</p>
                <p className="text-sm text-gray-600">{member.phone}</p>
                <button
                  onClick={() => fetchAttendance(member._id)}
                  className="text-green-600 hover:text-green-700 mt-2"
                >
                  View Attendance
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedStaffId && (
        <div className="mt-6 bg-gray-50 p-6 rounded-xl border">
          <h2 className="text-xl font-bold mb-4">Attendance Records</h2>
          {attendance.length > 0 ? (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {attendance
                    .sort((a, b) => new Date(b.date) - new Date(a.date))
                    .map((record) => (
                      <tr key={record._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              record.status === "Present"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <button
                            className="text-indigo-600 hover:text-indigo-900 mr-3"
                            onClick={() =>
                              setAttendanceForm({
                                date: record.date.substring(0, 10),
                                status: record.status,
                              })
                            }
                          >
                            <FaEdit className="h-4 w-4 inline" /> Edit
                          </button>
                          <button
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteAttendance(record._id)}
                          >
                            <FaTrash className="h-4 w-4 inline" /> Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-6 bg-white rounded-lg shadow">
              <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">
                No attendance records found
              </p>
            </div>
          )}

          <div className="mt-6 p-4 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">Add/Update Attendance</h3>
            <div className="flex flex-wrap gap-3 items-end">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={attendanceForm.date}
                  onChange={(e) =>
                    setAttendanceForm({ ...attendanceForm, date: e.target.value })
                  }
                  className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={attendanceForm.status}
                  onChange={(e) =>
                    setAttendanceForm({ ...attendanceForm, status: e.target.value })
                  }
                  className="border rounded-md p-2 focus:ring-2 focus:ring-indigo-400"
                >
                  <option value="">Select Status</option>
                  <option value="Present">Present</option>
                  <option value="Absent">Absent</option>
                  <option value="Late">Late</option>
                  <option value="On Leave">On Leave</option>
                </select>
              </div>
              <button
                onClick={handleAddAttendance}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
              >
                {attendanceForm.date &&
                attendance.some(
                  (record) =>
                    new Date(record.date).toDateString() ===
                    new Date(attendanceForm.date).toDateString()
                )
                  ? "Update"
                  : "Add"}
              </button>
            </div>
          </div>
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
              {editingStaffId ? "Edit Staff" : "Add New Staff"}
            </h2>
            <Formik
              initialValues={newStaff}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
              enableReinitialize
            >
              {({ errors, touched }) => (
                <Form className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium">Name</label>
                    <Field
                      type="text"
                      name="name"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.name && touched.name && (
                      <div className="text-red-500 text-sm">{errors.name}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Role</label>
                    <Field
                      type="text"
                      name="role"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.role && touched.role && (
                      <div className="text-red-500 text-sm">{errors.role}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Phone</label>
                    <Field
                      type="text"
                      name="phone"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.phone && touched.phone && (
                      <div className="text-red-500 text-sm">{errors.phone}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.email && touched.email && (
                      <div className="text-red-500 text-sm">{errors.email}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Department</label>
                    <Field
                      type="text"
                      name="department"
                      className="w-full mt-1 border rounded-md shadow-sm"
                    />
                    {errors.department && touched.department && (
                      <div className="text-red-500 text-sm">{errors.department}</div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium">Address</label>
                    <Field
                      type="text"
                      name="address"
                      className="w-full mt-1 border rounded-md shadow-sm"
                      />
                      {errors.address && touched.address && (
                        <div className="text-red-500 text-sm">{errors.address}</div>
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Date of Birth</label>
                      <Field
                        type="date"
                        name="dateOfBirth"
                        className="w-full mt-1 border rounded-md shadow-sm"
                      />
                      {errors.dateOfBirth && touched.dateOfBirth && (
                        <div className="text-red-500 text-sm">{errors.dateOfBirth}</div>
                      )}
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
                        {editingStaffId ? "Update Staff" : "Add Staff"}
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
  
  export default Staff;