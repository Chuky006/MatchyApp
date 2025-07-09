import { useEffect, useState } from "react";
import { useAuth } from "../context/useAuth";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios"; // use your custom axios config
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
        const res = await axiosInstance.get("/profile/mentors");
        setMentors(res.data.mentors); // assuming backend sends { mentors: [] }
      } catch (err) {
        const error = err as AxiosError;
        console.error(error);
        setError("Failed to load mentors.");
      }
    };

    fetchMentors();
  }, []);

  const handleRequest = async (mentorId: string) => {
    try {
      await axiosInstance.post("/requests", { mentorId });
      alert("Mentorship request sent!");
      navigate("/mentee/dashboard");
    } catch (err) {
      const error = err as AxiosError;
      console.error(error);
      alert("Failed to send request.");
    }
  };

  if (!user || user.role !== "mentee") {
    return <p className="text-center mt-10 text-red-500">Unauthorized</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Available Mentors</h2>
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {mentors.length === 0 ? (
        <p className="text-center">No mentors available.</p>
      ) : (
        mentors.map((mentor) => (
          <div
            key={mentor._id}
            className="bg-white p-4 mb-4 rounded shadow hover:shadow-md transition"
          >
            <h3 className="text-lg font-semibold">{mentor.name}</h3>
            <p className="text-sm text-gray-600 mb-2">{mentor.bio}</p>
            <p className="text-sm">Skills: {mentor.skills.join(", ")}</p>
            <p className="text-sm">Experience: {mentor.experience} years</p>
            <p className="text-xs text-green-600 font-medium mt-1">
              Status: {mentor.profileStatus}
            </p>
            <button
              onClick={() => handleRequest(mentor._id)}
              className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Request Mentorship
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default MenteeMentorList;
