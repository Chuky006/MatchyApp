import { useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";

const MentorDashboard = () => {
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

        // If profile is missing key fields, redirect to /mentor/profile
        if (!profile || !profile.bio || profile.skills.length === 0 || !profile.experience) {
          console.log("🔁 Redirecting: Incomplete mentor profile");
          navigate("/mentor/profile");
        } else {
          setLoading(false);
        }
      } catch (err) {
        const error = err as AxiosError;
        console.error("⚠️ Profile check failed:", error);
        navigate("/mentor/profile");
      }
    };

    if (user?.role === "mentor") {
      checkProfile();
    } else {
      setLoading(false);
    }
  }, [user, navigate]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold text-center mb-4">
        Welcome, Mentor {user?.name}
      </h1>
      <p className="text-center">This is your mentor dashboard.</p>
    </div>
  );
};

export default MentorDashboard;