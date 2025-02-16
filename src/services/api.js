// api.js
import axios from "axios";

// Determine the API base URL based on environment
export const API_BASE_URL = import.meta.env.VITE_NODE_ENV === 'production'
  ? "https://hospital-backend-vmq5.onrender.com"
  : "http://localhost:5000";

const API_URL = `${API_BASE_URL}/api/auth`;
const BASE_URL = `${API_BASE_URL}/api`;

// Auth endpoints
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

// API endpoints
export const api = {
  // Medicine Endpoints
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

