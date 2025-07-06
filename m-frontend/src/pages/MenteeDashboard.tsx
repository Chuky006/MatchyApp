import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { useAuth } from "../context/useAuth";
import Topbar from "../components/Topbar";

interface Request {
  _id: string;
  mentor: { name: string };
  status: string;
}

interface Session {
  _id: string;
  mentor: { name: string };
  scheduledDate: string;
  feedbackFromMentor?: string;
  feedbackFromMentee?: string;
}

const MenteeDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"requests" | "sessions">("requests");

  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  // Check profile completeness
  useEffect(() => {
    const checkProfile = async () => {
      try {
        const res = await axios.get("/api/profile/me", {
          withCredentials: true,
        });

        const profile = res.data?.profile;

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

  // Load data based on tab
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === "requests") {
          const res = await axios.get("/api/requests/sent", { withCredentials: true });
          setRequests(res.data.requests);
        } else if (tab === "sessions") {
          const res = await axios.get("/api/sessions", { withCredentials: true });
          setSessions(res.data.sessions);
        }
      } catch (err) {
        console.error("❌ Fetch failed", err);
        setError("Failed to load data.");
      }
    };

    if (!loading) fetchData();
  }, [tab, loading]);

  const handleFeedbackSubmit = async (sessionId: string) => {
    try {
      await axios.put(
        `/api/sessions/${sessionId}/mentee-feedback`,
        { feedback: feedbackMap[sessionId] },
        { withCredentials: true }
      );
      alert("✅ Feedback submitted!");
      location.reload(); // or re-fetch sessions
    } catch (err) {
      alert("❌ Failed to submit feedback.");
    }
  };

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <>
      <Topbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome, Mentee {user?.name}
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${tab === "requests" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("requests")}
          >
            My Requests
          </button>
          <button
            className={`px-4 py-2 rounded ${tab === "sessions" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
            onClick={() => setTab("sessions")}
          >
            My Sessions
          </button>
        </div>

        {error && <p className="text-red-500 text-center">{error}</p>}

        {tab === "requests" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Mentorship Requests</h2>
            {requests.length === 0 ? (
              <p>No requests found.</p>
            ) : (
              <ul>
                {requests.map((r) => (
                  <li key={r._id} className="border-b py-2">
                    Mentor: {r.mentor.name} — Status: {r.status}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {tab === "sessions" && (
          <div>
            <h2 className="text-xl font-semibold mb-2">Upcoming or Completed Sessions</h2>
            {sessions.length === 0 ? (
              <p>No sessions found.</p>
            ) : (
              <ul className="space-y-4">
                {sessions.map((s) => (
                  <li key={s._id} className="border p-3 rounded shadow-sm">
                    <div>
                      With: <strong>{s.mentor.name}</strong> <br />
                      Date: {new Date(s.scheduledDate).toLocaleString()}
                    </div>

                    {s.feedbackFromMentor && (
                      <p className="text-sm text-gray-600 mt-1">
                        Mentor Feedback: <em>{s.feedbackFromMentor}</em>
                      </p>
                    )}

                    {!s.feedbackFromMentee && (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          handleFeedbackSubmit(s._id);
                        }}
                        className="mt-2 space-y-2"
                      >
                        <input
                          type="text"
                          placeholder="Write your feedback"
                          value={feedbackMap[s._id] || ""}
                          onChange={(e) =>
                            setFeedbackMap((prev) => ({
                              ...prev,
                              [s._id]: e.target.value,
                            }))
                          }
                          className="w-full border p-2 rounded"
                        />
                        <button
                          type="submit"
                          className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                        >
                          Submit Feedback
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </>
  );
};

export default MenteeDashboard;