import { useNavigate } from "react-router-dom";
import axios from "axios";

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/api/auth/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center bg-blue-600 text-white px-6 py-3 shadow-md">
      <h1 className="text-xl font-bold">Matchy</h1>
      <button
        onClick={handleLogout}
        className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded text-white"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;