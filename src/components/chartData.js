// src/components/chartData.js

export const monthlyStats = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Prescriptions",
        data: [30, 45, 28, 55, 43, 65],
        borderColor: "#4F46E5",
        backgroundColor: "rgba(79, 70, 229, 0.5)",
      },
    ],
  };
  
  export const distributionData = {
    labels: ["Cardiology", "Neurology", "Pediatrics", "General Medicine"],
    datasets: [
      {
        label: "Specializations",
        data: [20, 25, 15, 40],
        backgroundColor: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
      },
    ],
  };
  