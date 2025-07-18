import { useEffect, useState } from "react";
import axios from "../services/axios";
import { useAuth } from "../context/useAuth";
import Topbar from "../components/Topbar";
import Sidebar from "../components/Sidebar";
import { useMentorProfileCheck } from "../hooks/useProfileCheck";
import { useNavigate } from "react-router-dom";

interface Request {
  _id: string;
  mentee: { name: string };
  status: string;
}

interface Session {
  _id: string;
  mentee: { name: string };
  scheduledDate: string;
  feedbackFromMentee?: string;
  feedbackFromMentor?: string;
}

interface User {
  _id: string;
  name: string;
  role: string;
  email: string;
}

const MentorDashboard = () => {
  const { user } = useAuth() as { user: User | null };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});
  const [tab, setTab] = useState<"requests" | "sessions" | "feedback">("requests");
  const [availability, setAvailability] = useState<"Available" | "Unavailable">("Available");

  useMentorProfileCheck();

  useEffect(() => {
    const fetchMentorProfile = async () => {
      try {
        const res = await axios.get(`/mentor/${user?._id}`);
        setAvailability(res.data.profileStatus || "Available");
      } catch (err) {
        console.error("Failed to fetch mentor profile", err);
      }
    };

    const fetchData = async () => {
      if (user?.role === "mentor") {
        try {
          const [reqRes, sessRes] = await Promise.all([
            axios.get("/requests/received"),
            axios.get("/sessions"),
          ]);
          setRequests(reqRes.data.requests);
          setSessions(sessRes.data.sessions);
        } catch (err) {
          console.error("Error loading dashboard data", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchMentorProfile();
    fetchData();
  }, [user]);

  const toggleAvailability = async () => {
    const newStatus = availability === "Available" ? "Unavailable" : "Available";
    try {
      const res = await axios.put("/mentor/status", {
        userId: user?._id,
        newStatus,
      });
      setAvailability(res.data.profileStatus);
    } catch {
      alert("Failed to update availability.");
    }
  };

  const handleFeedbackSubmit = async (sessionId: string) => {
    try {
      await axios.put(`/sessions/${sessionId}/mentor-feedback`, {
        feedback: feedbackMap[sessionId],
      });
      location.reload();
    } catch {
      alert("Failed to submit feedback.");
    }
  };

  const updateRequestStatus = async (requestId: string, status: string) => {
    try {
      await axios.put(`/requests/${requestId}`, { status });
      setRequests((prev) =>
        prev.map((r) => (r._id === requestId ? { ...r, status } : r))
      );
    } catch {
      console.error("Failed to update request");
      alert("Error updating request status.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar
        links={[
          { label: "Requests", path: "#", onClick: () => setTab("requests") },
          { label: "Sessions", path: "#", onClick: () => setTab("sessions") },
          { label: "Mentee Feedback", path: "#", onClick: () => setTab("feedback") },
        ]}
      />
      <div className="flex-1 ml-64">
        <Topbar />
        <div className="max-w-5xl mx-auto mt-12 p-8 bg-white shadow rounded-lg">
          <h1 className="text-3xl font-bold text-purple-700 text-center mb-6">
            Welcome, Mentor {user?.name}
          </h1>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => navigate("/mentor/profile")}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              View Profile
            </button>
            <button
              onClick={() => navigate("/profile/edit")}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-700 transition"
            >
              Edit Profile
            </button>
          </div>

          {/* Availability */}
          <div className="mb-6 flex justify-center items-center gap-4">
            <span className="text-gray-700 font-medium">Status:</span>
            <span className={`px-3 py-1 rounded-full text-white bg-purple-600`}>
              {availability}
            </span>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={availability === "Available"}
                onChange={toggleAvailability}
              />
              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-purple-500 transition-all"></div>
              <div className="absolute left-1 top-0.5 bg-white w-5 h-5 rounded-full transition-all peer-checked:translate-x-full"></div>
            </label>
          </div>

          {/* Tabs */}
          {tab === "requests" && (
            <section className="mt-6">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">Mentorship Requests</h2>
              {requests.length === 0 ? (
                <p className="text-gray-500 text-center">No requests received yet.</p>
              ) : (
                <ul className="space-y-3">
                  {requests.map((req) => (
                    <li
                      key={req._id}
                      className="p-4 bg-gray-50 border rounded flex justify-between items-center"
                    >
                      <div>
                        <strong>{req.mentee.name}</strong> – Status:{" "}
                        <span className="text-sm text-purple-700 font-semibold capitalize">
                          {req.status}
                        </span>
                      </div>
                      {req.status === "pending" && (
                        <div className="space-x-2">
                          <button
                            onClick={() => updateRequestStatus(req._id, "accepted")}
                            className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => updateRequestStatus(req._id, "declined")}
                            className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                          >
                            Decline
                          </button>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "sessions" && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">Booked Sessions</h2>
              {sessions.length === 0 ? (
                <p className="text-gray-500 text-center">No sessions booked yet.</p>
              ) : (
                <ul className="space-y-4">
                  {sessions.map((session) => (
                    <li key={session._id} className="p-4 bg-gray-50 border rounded">
                      <div className="text-sm text-gray-800">
                        <strong>Mentee:</strong> {session.mentee.name} <br />
                        <strong>Date:</strong>{" "}
                        {new Date(session.scheduledDate).toLocaleString()}
                      </div>

                      {!session.feedbackFromMentor && (
                        <form
                          onSubmit={(e) => {
                            e.preventDefault();
                            handleFeedbackSubmit(session._id);
                          }}
                          className="mt-3 flex flex-col gap-2"
                        >
                          <textarea
                            placeholder="Write feedback..."
                            className="w-full border rounded p-2"
                            value={feedbackMap[session._id] || ""}
                            onChange={(e) =>
                              setFeedbackMap((prev) => ({
                                ...prev,
                                [session._id]: e.target.value,
                              }))
                            }
                          />
                          <button
                            type="submit"
                            className="self-end bg-purple-700 text-white px-4 py-1 rounded hover:bg-purple-800 transition"
                          >
                            Submit Feedback
                          </button>
                        </form>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          {tab === "feedback" && (
            <section className="mt-8">
              <h2 className="text-xl font-semibold text-purple-700 mb-3">Mentee Feedback</h2>
              {sessions.filter((s) => s.feedbackFromMentee).length === 0 ? (
                <p className="text-gray-500 text-center">No feedback received yet.</p>
              ) : (
                <ul className="space-y-3">
                  {sessions
                    .filter((s) => s.feedbackFromMentee)
                    .map((s) => (
                      <li key={s._id} className="p-4 bg-gray-50 border rounded">
                        <strong>{s.mentee.name}</strong>:{" "}
                        <span className="italic text-gray-700">
                          {s.feedbackFromMentee}
                        </span>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          )}

          <div className="mt-10 flex justify-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm text-purple-600 underline hover:text-purple-800"
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MentorDashboard;
