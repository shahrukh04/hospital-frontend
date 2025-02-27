import React, { useState, useEffect } from "react";
import { api } from "../services/api";
import { toast } from 'react-toastify';
import AdComponent from "./AdComponent";

const PrescriptionForm = () => {
  const [doctors, setDoctors] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [prescriptions, setPrescriptions] = useState([]);
  const [formData, setFormData] = useState({
    doctorId: "",
    doctorName: "",
    patientName: "",
    patientAge: "",
    medicines: [
      {
        medicineId: "",
        medicineName: "",
        dosage: "",
        frequency: "",
        duration: "",
      },
    ],
    instructions: "",
  });

  useEffect(() => {
    loadDoctorsAndMedicines();
  }, []);

  const loadDoctorsAndMedicines = async () => {
    try {
      const doctorsResponse = await api.getAllDoctors();
      setDoctors(doctorsResponse.data);

      const medicinesResponse = await api.getAllMedicines();
      setMedicines(medicinesResponse.data);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "doctorId") {
      const selectedDoctor = doctors.find((doctor) => doctor._id === value);
      setFormData({
        ...formData,
        doctorId: value,
        doctorName: selectedDoctor?.name || "",
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleMedicineChange = (index, e) => {
    const { name, value } = e.target;
    const newMedicines = formData.medicines.map((medicine, i) => {
      if (i === index) {
        if (name === "medicineId") {
          const selectedMedicine = medicines.find((med) => med._id === value);
          return {
            ...medicine,
            medicineId: value,
            medicineName: selectedMedicine?.name || "",
          };
        }
        return { ...medicine, [name]: value };
      }
      return medicine;
    });
    setFormData({ ...formData, medicines: newMedicines });
  };

  const addMedicine = () => {
    setFormData({
      ...formData,
      medicines: [
        ...formData.medicines,
        {
          medicineId: "",
          medicineName: "",
          dosage: "",
          frequency: "",
          duration: "",
        },
      ],
    });
  };

  const removeMedicine = (index) => {
    const newMedicines = formData.medicines.filter((_, i) => i !== index);
    setFormData({ ...formData, medicines: newMedicines });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedDoctor = doctors.find(
        (doctor) => doctor._id === formData.doctorId
      );

      const medicinesWithDetails = formData.medicines.map((medicine) => {
        const medicineDetails = medicines.find(
          (med) => med._id === medicine.medicineId
        );
        return {
          ...medicine,
          medicineName: medicineDetails?.name,
          medicineDetails: medicineDetails,
        };
      });

      const prescriptionData = {
        ...formData,
        doctorName: selectedDoctor?.name,
        doctorSpecialization: selectedDoctor?.specialization,
        medicines: medicinesWithDetails,
      };

      await api.addPrescription(prescriptionData);

      setFormData({
        doctorId: "",
        doctorName: "",
        patientName: "",
        patientAge: "",
        medicines: [
          {
            medicineId: "",
            medicineName: "",
            dosage: "",
            frequency: "",
            duration: "",
          },
        ],
        instructions: "",
      });

      toast.success("Prescription created successfully!");
    } catch (error) {
      console.error("Error creating prescription:", error);
      toast.error("Error creating prescription");
    }
  };

  const refreshList = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/prescriptions');
      
      if (!response.ok) {
        throw new Error('Failed to fetch prescriptions');
      }

      const data = await response.json();
      setPrescriptions(data);
      toast.success('List refreshed successfully');
    } catch (error) {
      console.error('Error refreshing list:', error);
      toast.error('Failed to refresh list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Form Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Create New Prescription
          </h2>
          <p className="mt-2 text-center text-gray-600">
            Fill in the details below to generate a new prescription
          </p>
        </div>

        {/* Main Form */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Doctor and Patient Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                  required
                >
                  <option value="">Choose a doctor</option>
                  {doctors.map(doctor => (
                    <option key={doctor._id} value={doctor._id}>
                      {doctor.name} - {doctor.specialization}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Patient Age
                  </label>
                  <input
                    type="number"
                    name="patientAge"
                    value={formData.patientAge}
                    onChange={handleInputChange}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Medicines Section */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium text-gray-900">Prescribed Medicines</h3>
                <button
                  type="button"
                  onClick={addMedicine}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  Add Medicine
                </button>
              </div>

              {formData.medicines.map((medicine, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4 relative hover:shadow-md transition-all duration-200">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <select
                        name="medicineId"
                        value={medicine.medicineId}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      >
                        <option value="">Select Medicine</option>
                        {medicines.map(med => (
                          <option key={med._id} value={med._id}>
                            {med.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <input
                        type="text"
                        name="dosage"
                        placeholder="Dosage"
                        value={medicine.dosage}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        name="frequency"
                        placeholder="Frequency"
                        value={medicine.frequency}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        name="duration"
                        placeholder="Duration"
                        value={medicine.duration}
                        onChange={(e) => handleMedicineChange(index, e)}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                      />
                      {index > 0 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(index)}
                          className="absolute -right-2 -top-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 focus:outline-none shadow-sm transition-all duration-200"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Instructions Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Instructions
              </label>
              <textarea
                name="instructions"
                value={formData.instructions}
                onChange={handleInputChange}
                rows={4}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-all duration-200"
                placeholder="Enter any special instructions or notes..."
              />
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200"
              >
                Create Prescription
              </button>
            </div>
<AdComponent/>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PrescriptionForm;