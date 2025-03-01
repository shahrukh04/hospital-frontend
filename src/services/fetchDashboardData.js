import { api } from "../services/api";

export const fetchDashboardData = async () => {
    try {
        const [medicinesRes, doctorsRes, prescriptionsRes] = await Promise.all([
            api.getAllMedicines(),
            api.getAllDoctors(),
            api.getAllPrescriptions(),
        ]);

        const medicines = medicinesRes.data;
        const doctors = doctorsRes.data;
        const prescriptions = prescriptionsRes.data;

        console.log("Fetched Medicines Data:", medicines);  // Debug log

        // Correct low stock logic (use `stock`)
        const lowStockMedicines = medicines
            .filter(med => Number(med.stock) < 10)  // Corrected
            .filter(med => med.name && !isNaN(Number(med.stock)));  // Ensure valid stock

        return {
            medicinesCount: medicines.length,
            doctorsCount: doctors.length,
            prescriptionsCount: prescriptions.length,
            lowStockMedicines,
        };
    } catch (error) {
        console.error("Error fetching dashboard data:", error);
        return {
            medicinesCount: 0,
            doctorsCount: 0,
            prescriptionsCount: 0,
            lowStockMedicines: [],
        };
    }
};
