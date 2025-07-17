import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios";
import { AxiosError } from "axios";

interface Mentor {
  _id: string;
  name: string;
  bio: string;
  skills: string[];
  experience: string;
  profileStatus: "Available" | "Unavailable" | "Pending";
}

const MenteeMentorList = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mentors, setMentors] = useState<Mentor[]>([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMentors = async () => {
      try {
        const res = await axiosInstance.get("/mentor/mentors"); // ✅ Confirm this matches your backend route
        setMentors(res.data.mentors);
      } catch (err) {
        const error = err as AxiosError;
        console.error("❌ Failed to fetch mentors:", error.response?.status, error.response?.data || error.message);
        setError("Failed to load mentors.");
      }
    };

    fetchMentors();
  }, []);

  const handleRequest = async (mentorId: string, profileStatus: string) => {
    if (profileStatus !== "Available") {
      alert("This mentor is currently unavailable.");
      return;
    }

    try {
      await axiosInstance.post("/requests", { mentorId });
      alert("✅ Mentorship request sent!");
      navigate("/mentee/dashboard");
    } catch (err) {
      const error = err as AxiosError;
      console.error("❌ Request error:", error.response?.data || error.message);
      alert("❌ Failed to send request.");
    }
  };

  if (!user || user.role !== "mentee") {
    return (
      <div className="text-center mt-10 text-red-500">
        Unauthorized. Only mentees can view this page.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-purple-50 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-xl p-6 shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-purple-700">
          Explore Available Mentors
        </h2>

        <div className="mb-4 text-right">
          <button
            onClick={() => navigate("/mentee/dashboard")}
            className="text-sm text-purple-600 underline hover:text-purple-800"
          >
            ← Back to Dashboard
          </button>
        </div>

        {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

        {mentors.length === 0 ? (
          <p className="text-center text-gray-700">No mentors available at the moment.</p>
        ) : (
          mentors.map((mentor) => (
            <div
              key={mentor._id}
              className="border p-4 mb-4 rounded shadow-sm hover:shadow-md transition bg-white"
            >
              <h3 className="text-lg font-semibold text-gray-900">{mentor.name}</h3>
              <p className="text-sm text-gray-600 mb-1">{mentor.bio}</p>
              <p className="text-sm mb-1">
                <strong>Skills:</strong> {mentor.skills.join(", ")}
              </p>
              <p className="text-sm mb-1">
                <strong>Experience:</strong> {mentor.experience} years
              </p>
              <p
                className={`text-xs font-medium mt-1 ${
                  mentor.profileStatus === "Available"
                    ? "text-green-600"
                    : "text-gray-500"
                }`}
              >
                Status: {mentor.profileStatus}
              </p>

              <button
                onClick={() => handleRequest(mentor._id, mentor.profileStatus)}
                className={`mt-3 px-4 py-2 rounded transition text-white ${
                  mentor.profileStatus === "Available"
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
                disabled={mentor.profileStatus !== "Available"}
              >
                Request Mentorship
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MenteeMentorList;

