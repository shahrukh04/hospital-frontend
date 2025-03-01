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

// Helper function to create authenticated API calls
const createAuthRequest = (token) => {
  const authAxios = axios.create({
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  // Add response interceptor for error handling
  authAxios.interceptors.response.use(
    response => response,
    error => {
      if (error.response && error.response.status === 401) {
        // Handle unauthorized access (token expired, etc.)
        localStorage.removeItem('token');
        window.location.href = '/login?expired=true';
      }
      return Promise.reject(error);
    }
  );

  return authAxios;
};

// API endpoints
export const api = {
  // Medicine Endpoints
  getAllMedicines: () => axios.get(`${BASE_URL}/medicines`),
  getMedicine: (id) => axios.get(`${BASE_URL}/medicines/${id}`),
  addMedicine: (medicine) => axios.post(`${BASE_URL}/medicines`, medicine),
  updateMedicine: (id, medicine) => axios.put(`${BASE_URL}/medicines/${id}`, medicine),
  deleteMedicine: (id) => axios.delete(`${BASE_URL}/medicines/${id}`),
  getLowStockMedicines: () => axios.get(`${BASE_URL}/medicines/low-stock`),
  getMedicinesByCategory: (category) => axios.get(`${BASE_URL}/medicines/category/${category}`),
  getMedicineInventoryHistory: (id) => axios.get(`${BASE_URL}/medicines/${id}/history`),
  reorderMedicine: (id, quantity) => axios.post(`${BASE_URL}/medicines/${id}/reorder`, { quantity }),

  // Doctor Endpoints
  getAllDoctors: () => axios.get(`${BASE_URL}/doctors`),
  getDoctor: (id) => axios.get(`${BASE_URL}/doctors/${id}`),
  addDoctor: (doctor) => axios.post(`${BASE_URL}/doctors`, doctor),
  updateDoctor: (id, doctor) => axios.put(`${BASE_URL}/doctors/${id}`, doctor),
  deleteDoctor: (id) => axios.delete(`${BASE_URL}/doctors/${id}`),
  getDoctorsBySpecialization: (specialization) => axios.get(`${BASE_URL}/doctors/specialization/${specialization}`),
  getDoctorSchedule: (id) => axios.get(`${BASE_URL}/doctors/${id}/schedule`),
  updateDoctorSchedule: (id, schedule) => axios.put(`${BASE_URL}/doctors/${id}/schedule`, schedule),
  getDoctorPerformanceMetrics: (id) => axios.get(`${BASE_URL}/doctors/${id}/performance`),

  // Prescription Endpoints
  getAllPrescriptions: () => axios.get(`${BASE_URL}/prescriptions`),
  getPrescription: (id) => axios.get(`${BASE_URL}/prescriptions/${id}`),
  addPrescription: (prescription) => axios.post(`${BASE_URL}/prescriptions`, prescription),
  updatePrescription: (id, prescription) => axios.put(`${BASE_URL}/prescriptions/${id}`, prescription),
  deletePrescription: (id) => axios.delete(`${BASE_URL}/prescriptions/${id}`),
  getPrescriptionsByPatient: (patientId) => axios.get(`${BASE_URL}/prescriptions/patient/${patientId}`),
  getPrescriptionsByDoctor: (doctorId) => axios.get(`${BASE_URL}/prescriptions/doctor/${doctorId}`),
  getPrescriptionHistory: (patientId) => axios.get(`${BASE_URL}/prescriptions/history/${patientId}`),

  // Patient Endpoints
  getAllPatients: () => axios.get(`${BASE_URL}/patients`),
  getPatient: (id) => axios.get(`${BASE_URL}/patients/${id}`),
  addPatient: (patient) => axios.post(`${BASE_URL}/patients`, patient),
  updatePatient: (id, patient) => axios.put(`${BASE_URL}/patients/${id}`, patient),
  deletePatient: (id) => axios.delete(`${BASE_URL}/patients/${id}`),
  getPatientMedicalHistory: (id) => axios.get(`${BASE_URL}/patients/${id}/medical-history`),
  getPatientVisitHistory: (id) => axios.get(`${BASE_URL}/patients/${id}/visits`),
  getPatientInsuranceDetails: (id) => axios.get(`${BASE_URL}/patients/${id}/insurance`),
  updatePatientInsurance: (id, insurance) => axios.put(`${BASE_URL}/patients/${id}/insurance`, insurance),
  getCriticalPatients: () => axios.get(`${BASE_URL}/patients/critical`),

  // Appointment Endpoints
  getAllAppointments: () => axios.get(`${BASE_URL}/appointments`),
  getAppointment: (id) => axios.get(`${BASE_URL}/appointments/${id}`),
  addAppointment: (appointment) => axios.post(`${BASE_URL}/appointments`, appointment),
  updateAppointment: (id, appointment) => axios.put(`${BASE_URL}/appointments/${id}`, appointment),
  deleteAppointment: (id) => axios.delete(`${BASE_URL}/appointments/${id}`),
  getAppointmentsByDate: (date) => axios.get(`${BASE_URL}/appointments/date/${date}`),
  getAppointmentsByDoctor: (doctorId) => axios.get(`${BASE_URL}/appointments/doctor/${doctorId}`),
  getAppointmentsByPatient: (patientId) => axios.get(`${BASE_URL}/appointments/patient/${patientId}`),
  getTodaysAppointments: () => axios.get(`${BASE_URL}/appointments/today`),
  rescheduleAppointment: (id, newDate, newTime) =>
  axios.put(`${BASE_URL}/appointments/${id}/reschedule`, { date: newDate, time: newTime }),

  // Billing and Payments Endpoints
  getAllBills: () => axios.get(`${BASE_URL}/billing`),
  getBill: (id) => axios.get(`${BASE_URL}/billing/${id}`),
  createBill: (bill) => axios.post(`${BASE_URL}/billing`, bill),
  updateBill: (id, bill) => axios.put(`${BASE_URL}/billing/${id}`, bill),
  deleteBill: (id) => axios.delete(`${BASE_URL}/billing/${id}`),
  getPatientBills: (patientId) => axios.get(`${BASE_URL}/billing/patient/${patientId}`),
  processPayment: (billId, paymentDetails) => axios.post(`${BASE_URL}/billing/${billId}/payment`, paymentDetails),
  generateInvoice: (billId) => axios.get(`${BASE_URL}/billing/${billId}/invoice`, { responseType: 'blob' }),
  getPaymentHistory: (patientId) => axios.get(`${BASE_URL}/billing/patient/${patientId}/payment-history`),

  // Hospital Resources Endpoints
  getAllRooms: () => axios.get(`${BASE_URL}/resources/rooms`),
  getAvailableRooms: () => axios.get(`${BASE_URL}/resources/rooms/available`),
  getBedOccupancy: () => axios.get(`${BASE_URL}/resources/beds/occupancy`),
  getAllEquipment: () => axios.get(`${BASE_URL}/resources/equipment`),
  getEquipmentStatus: (equipmentId) => axios.get(`${BASE_URL}/resources/equipment/${equipmentId}/status`),
  updateEquipmentStatus: (equipmentId, status) =>
    axios.put(`${BASE_URL}/resources/equipment/${equipmentId}/status`, { status }),
  scheduleEquipmentMaintenance: (equipmentId, date) =>
    axios.post(`${BASE_URL}/resources/equipment/${equipmentId}/maintenance`, { date }),

  // Staff Management Endpoints
  getAllStaff: () => axios.get(`${BASE_URL}/staff`),
  getStaffMember: (id) => axios.get(`${BASE_URL}/staff/${id}`),
  addStaffMember: (staff) => axios.post(`${BASE_URL}/staff`, staff),
  updateStaffMember: (id, staff) => axios.put(`${BASE_URL}/staff/${id}`, staff),
  deleteStaffMember: (id) => axios.delete(`${BASE_URL}/staff/${id}`),
  getStaffAttendance: (month, year) => axios.get(`${BASE_URL}/staff/attendance/${year}/${month}`),
  recordStaffAttendance: (staffId, date, status) =>
    axios.post(`${BASE_URL}/staff/${staffId}/attendance`, { date, status }),
  getStaffSchedule: (staffId) => axios.get(`${BASE_URL}/staff/${staffId}/schedule`),
  updateStaffSchedule: (staffId, schedule) => axios.put(`${BASE_URL}/staff/${staffId}/schedule`, schedule),

  // Lab and Testing Endpoints
  getAllLabTests: () => axios.get(`${BASE_URL}/lab/tests`),
  getLabTest: (id) => axios.get(`${BASE_URL}/lab/tests/${id}`),
  orderLabTest: (patientId, testDetails) => axios.post(`${BASE_URL}/lab/tests/order`, { patientId, ...testDetails }),
  updateLabTestStatus: (testId, status, results) =>
    axios.put(`${BASE_URL}/lab/tests/${testId}/status`, { status, results }),
  getPatientLabResults: (patientId) => axios.get(`${BASE_URL}/lab/results/patient/${patientId}`),

  // Analytics and Reports Endpoints
  getMonthlyStats: () => axios.get(`${BASE_URL}/stats/monthly`),
  getDistributionData: () => axios.get(`${BASE_URL}/stats/distribution`),
  getDemographicsData: () => axios.get(`${BASE_URL}/stats/demographics`),
  getFinancialData: () => axios.get(`${BASE_URL}/stats/financial`),
  getPerformanceMetrics: () => axios.get(`${BASE_URL}/stats/performance`),
  generateCustomReport: (reportParams) => axios.post(`${BASE_URL}/reports/custom`, reportParams),
  generateMonthlyReport: (month, year) => axios.get(`${BASE_URL}/reports/monthly/${year}/${month}`),
  getAggregatedStats: (timeframe) => axios.get(`${BASE_URL}/stats/aggregated/${timeframe}`),

  // Emergency Management Endpoints
  getAllEmergencies: () => axios.get(`${BASE_URL}/emergency/alerts`),
  reportEmergency: (emergencyDetails) => axios.post(`${BASE_URL}/emergency/report`, emergencyDetails),
  updateEmergencyStatus: (emergencyId, status) =>
    axios.put(`${BASE_URL}/emergency/${emergencyId}/status`, { status }),
  getActiveEmergencies: () => axios.get(`${BASE_URL}/emergency/active`),

  // Telemedicine Endpoints
  getAllVirtualConsultations: () => axios.get(`${BASE_URL}/telemedicine/consultations`),
  scheduleVirtualConsultation: (consultationDetails) =>
    axios.post(`${BASE_URL}/telemedicine/schedule`, consultationDetails),
  getConsultationDetails: (consultationId) => axios.get(`${BASE_URL}/telemedicine/consultations/${consultationId}`),
  updateConsultationStatus: (consultationId, status) =>
    axios.put(`${BASE_URL}/telemedicine/consultations/${consultationId}/status`, { status }),
  getVirtualConsultationHistory: (patientId) =>
    axios.get(`${BASE_URL}/telemedicine/history/patient/${patientId}`),

  // User Management and Settings
  getCurrentUser: () => axios.get(`${BASE_URL}/users/me`),
  updateUserProfile: (userData) => axios.put(`${BASE_URL}/users/profile`, userData),
  changePassword: (passwordData) => axios.put(`${BASE_URL}/users/password`, passwordData),
  getUserPreferences: () => axios.get(`${BASE_URL}/users/preferences`),
  updateUserPreferences: (preferences) => axios.put(`${BASE_URL}/users/preferences`, preferences),
  getUserPermissions: () => axios.get(`${BASE_URL}/users/permissions`),
  getAllUserRoles: () => axios.get(`${BASE_URL}/admin/roles`),
  getUsersWithRole: (roleId) => axios.get(`${BASE_URL}/admin/users/role/${roleId}`),
  assignUserRole: (userId, roleId) => axios.put(`${BASE_URL}/admin/users/${userId}/role`, { roleId }),

  // Notifications and Messaging
  getAllNotifications: () => axios.get(`${BASE_URL}/notifications`),
  markNotificationAsRead: (notificationId) => axios.put(`${BASE_URL}/notifications/${notificationId}/read`),
  deleteNotification: (notificationId) => axios.delete(`${BASE_URL}/notifications/${notificationId}`),
  sendMessage: (receiverId, message) => axios.post(`${BASE_URL}/messages/send`, { receiverId, message }),
  getConversations: () => axios.get(`${BASE_URL}/messages/conversations`),
  getConversationMessages: (conversationId) => axios.get(`${BASE_URL}/messages/conversation/${conversationId}`),

  // Mobile App Integration
  getPatientMobileProfile: (patientId) => axios.get(`${BASE_URL}/mobile/patients/${patientId}/profile`),
  updatePatientMobileSettings: (patientId, settings) =>
    axios.put(`${BASE_URL}/mobile/patients/${patientId}/settings`, settings),
  sendPushNotification: (userId, notification) => axios.post(`${BASE_URL}/mobile/notifications`,
    { userId, notification }),
  registerDeviceToken: (userId, deviceToken) =>
    axios.post(`${BASE_URL}/mobile/devices/register`, { userId, deviceToken }),
};

export const createAuthenticatedAPI = (token) => {
  const authRequest = createAuthRequest(token);

  return {
    ...api,
    get: (url) => authRequest.get(url),
    post: (url, data) => authRequest.post(url, data),
    put: (url, data) => authRequest.put(url, data),
    delete: (url) => authRequest.delete(url),
    // Other methods as needed
    // Override specific API methods that need authentication
    getCurrentUser: () => authRequest.get(`${BASE_URL}/users/me`),
    // ...other overrides
  };
};