import { useNavigate } from "react-router-dom";
import axios from "../services/axios"; 

const Topbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("/auth/logout"); 
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="flex justify-between items-center bg-purple-700 text-white px-6 py-3 shadow-md font-sans">
      <h1
        onClick={() => navigate("/")}
        className="text-2xl font-bold tracking-wide cursor-pointer"
      >
        MATCHY
      </h1>
      <button
        onClick={handleLogout}
        className="bg-white text-purple-700 px-4 py-2 rounded hover:bg-purple-100 transition font-semibold shadow"
      >
        Logout
      </button>
    </div>
  );
};

export default Topbar;