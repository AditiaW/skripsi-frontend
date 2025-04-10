import { LogOut } from "lucide-react";
// import axiosInstance from "@/api/axiosInstance";
import useAuthStore from "@/store/authStore";
import { useNavigate } from "react-router-dom"; // Use navigate for redirection

const Dashboard = () => {
  const navigate = useNavigate(); // Initialize navigation hook
  const handleLogout = async () => {
    try {
      // await axiosInstance.post("/logout");
      useAuthStore.getState().logout(); // Hapus token dari Local Storage dan state
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Logout failed. Please try again.");
      throw error;
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white font-semibold px-4 py-2 rounded-lg shadow"
        aria-label="Logout"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </button>
    </div>
  );
};

export default Dashboard;
