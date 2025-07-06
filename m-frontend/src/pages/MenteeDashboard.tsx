import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";

const MenteeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await axios.get("/api/profile/me", {
          withCredentials: true,
        });

        const profile = res.data?.profile;

        // Redirect if essential profile fields are missing
        if (!profile || !profile.bio || profile.goals.length === 0) {
          console.log("🔁 Redirecting mentee: incomplete profile");
          navigate("/mentee/profile");
        } else {
          setLoading(false);
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("⚠️ Mentee profile check failed:", error);
        navigate("/mentee/profile");
      }
    };

    if (user?.role === "mentee") {
      checkProfile();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-4">
        Welcome, Mentee {user?.name}
      </h1>
      <p className="text-center text-gray-600">
        This is your mentee dashboard. You can view available mentors and book sessions.
      </p>
    </div>
  );
};

export default MenteeDashboard;