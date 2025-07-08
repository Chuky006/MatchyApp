import { useEffect, useState } from "react";
import { AxiosError } from "axios";
import axios from "../services/axios";
import { useAuth } from "../context/useAuth";
import Topbar from "../components/Topbar";
import { useMenteeProfileCheck } from "../hooks/useProfileCheck";

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
  const [tab, setTab] = useState<"requests" | "sessions">("requests");

  const [requests, setRequests] = useState<Request[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [error, setError] = useState("");
  const [feedbackMap, setFeedbackMap] = useState<Record<string, string>>({});

  useMenteeProfileCheck(); //Ensures profile is complete before proceeding

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (tab === "requests") {
          const res = await axios.get("/requests/sent");
          setRequests(res.data.requests);
        } else if (tab === "sessions") {
          const res = await axios.get("/sessions");
          setSessions(res.data.sessions);
        }
      } catch (err) {
        const axiosError = err as AxiosError;
        console.error("❌ Fetch failed", axiosError);
        setError("Failed to load data.");
      }
    };

    fetchData();
  }, [tab]);

  const handleFeedbackSubmit = async (sessionId: string) => {
    try {
      await axios.put(`/sessions/${sessionId}/mentee-feedback`, {
        feedback: feedbackMap[sessionId],
      });
      alert("✅ Feedback submitted!");
      location.reload();
    } catch (err) {
      const axiosError = err as AxiosError;
      console.error("❌ Feedback submission failed", axiosError);
      alert("❌ Failed to submit feedback.");
    }
  };

  return (
    <>
      <Topbar />
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white shadow rounded">
        <h1 className="text-2xl font-bold text-center mb-6">
          Welcome, Mentee {user?.name}
        </h1>

        <div className="flex justify-center gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded ${
              tab === "requests" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTab("requests")}
          >
            My Requests
          </button>
          <button
            className={`px-4 py-2 rounded ${
              tab === "sessions" ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
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
            <h2 className="text-xl font-semibold mb-2">
              Upcoming or Completed Sessions
            </h2>
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