import { useEffect, useState } from "react";
import axios from "axios";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
}

interface Request {
  _id: string;
  mentee: { name: string };
  mentor: { name: string };
  status: string;
}

const AdminDashboard = () => {
  const [tab, setTab] = useState<"users" | "requests" | "assign">("users");
  const [users, setUsers] = useState<User[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [mentorId, setMentorId] = useState("");
  const [menteeId, setMenteeId] = useState("");

  const mentors = users.filter((u) => u.role === "mentor");
  const mentees = users.filter((u) => u.role === "mentee");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/api/admin/users", { withCredentials: true });
        setUsers(res.data.users);
      } catch {
        setError("Failed to load users");
      }
    };

    const fetchRequests = async () => {
      try {
        const res = await axios.get("/api/admin/requests", { withCredentials: true });
        setRequests(res.data.requests);
      } catch {
        setError("Failed to load requests");
      }
    };

    setError("");
    setSuccess("");

    if (tab === "users" || tab === "assign") fetchUsers();
    if (tab === "requests") fetchRequests();
  }, [tab]);

  const handleAssign = async () => {
    if (!mentorId || !menteeId) {
      setError("Please select both a mentor and a mentee");
      return;
    }

    try {
      await axios.post(
        "/api/admin/assign",
        { mentorId, menteeId },
        { withCredentials: true }
      );
      setSuccess("Mentor assigned successfully");
      setError("");
      setMentorId("");
      setMenteeId("");
    } catch {
      setError("Failed to assign mentor");
    }
  };

  return (
    <div className="max-w-5xl mx-auto mt-8 p-6 bg-white shadow rounded">
      <h1 className="text-2xl font-bold mb-4 text-center">Admin Dashboard</h1>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => setTab("users")}
          className={`px-4 py-2 rounded ${tab === "users" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Users
        </button>
        <button
          onClick={() => setTab("requests")}
          className={`px-4 py-2 rounded ${tab === "requests" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Requests
        </button>
        <button
          onClick={() => setTab("assign")}
          className={`px-4 py-2 rounded ${tab === "assign" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
        >
          Assign Mentors
        </button>
      </div>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      {success && <p className="text-green-600 text-center mb-4">{success}</p>}

      {tab === "users" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">All Users</h2>
          {users.length === 0 ? (
            <p>No users found.</p>
          ) : (
            <ul>
              {users.map((user) => (
                <li key={user._id} className="border-b py-2">
                  {user.name} ({user.role}) - {user.email}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "requests" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Mentorship Requests</h2>
          {requests.length === 0 ? (
            <p>No requests found.</p>
          ) : (
            <ul>
              {requests.map((req) => (
                <li key={req._id} className="border-b py-2">
                  Mentee: {req.mentee.name} → Mentor: {req.mentor.name} - Status: {req.status}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {tab === "assign" && (
        <div>
          <h2 className="text-xl font-semibold mb-2">Assign Mentors to Mentees</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <select
              value={mentorId}
              onChange={(e) => setMentorId(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Mentor</option>
              {mentors.map((mentor) => (
                <option key={mentor._id} value={mentor._id}>
                  {mentor.name}
                </option>
              ))}
            </select>

            <select
              value={menteeId}
              onChange={(e) => setMenteeId(e.target.value)}
              className="border p-2 rounded"
            >
              <option value="">Select Mentee</option>
              {mentees.map((mentee) => (
                <option key={mentee._id} value={mentee._id}>
                  {mentee.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAssign}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Assign Mentor
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;