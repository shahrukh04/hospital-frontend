import axios from "axios";

// const API_URL = "http://localhost:5000/api/auth";
const API_URL = "https://hospital-backend-vmq5.onrender.com/api/auth";

export const registerUser = async (userData) => {
  const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
  });

  return response.json();
};
export const loginUser = async (userData) => {
    return await axios.post(`${API_URL}/login`, userData);
};

const BASE_URL = "https://hospital-backend-vmq5.onrender.com/api";
// Medicine Endpoints
export const api = {
  getAllMedicines: () => axios.get(`${BASE_URL}/medicines`),
  getMedicine: (id) => axios.get(`${BASE_URL}/medicines/${id}`),
  addMedicine: (medicine) => axios.post(`${BASE_URL}/medicines`, medicine),
  updateMedicine: (id, medicine) => axios.put(`${BASE_URL}/medicines/${id}`, medicine),
  deleteMedicine: (id) => axios.delete(`${BASE_URL}/medicines/${id}`),
// Doctor Endpoints
  getAllDoctors: () => axios.get(`${BASE_URL}/doctors`),
  getDoctor: (id) => axios.get(`${BASE_URL}/doctors/${id}`),
  addDoctor: (doctor) => axios.post(`${BASE_URL}/doctors`, doctor),
  updateDoctor: (id, doctor) => axios.put(`${BASE_URL}/doctors/${id}`, doctor),
  deleteDoctor: (id) => axios.delete(`${BASE_URL}/doctors/${id}`),
// Prescription Endpoints
  getAllPrescriptions: () => axios.get(`${BASE_URL}/prescriptions`),
  getPrescription: (id) => axios.get(`${BASE_URL}/prescriptions/${id}`),
  addPrescription: (prescription) => axios.post(`${BASE_URL}/prescriptions`, prescription),
  updatePrescription: (id, prescription) => axios.put(`${BASE_URL}/prescriptions/${id}`, prescription),
  deletePrescription: (id) => axios.delete(`${BASE_URL}/prescriptions/${id}`),
// Stats Endpoints
  getMonthlyStats: () => axios.get(`${BASE_URL}/stats/monthly`),
  getDistributionData: () => axios.get(`${BASE_URL}/stats/distribution`),
};

