import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../services/axios";
import { AxiosError } from "axios";

interface AvailabilitySlot {
  _id: string;
  day: string;
  startTime: string;
  endTime: string;
}

interface Session {
  _id: string;
  date: string;
  time: string; // format: "HH:mm-HH:mm"
  mentorId: string;
  menteeId: string;
}

const BookMentor = () => {
  const { mentorId } = useParams<{ mentorId: string }>();
  const navigate = useNavigate();

  const [availability, setAvailability] = useState<AvailabilitySlot[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [availRes, sessionRes] = await Promise.all([
          axiosInstance.get(`/availability/${mentorId}`),
          axiosInstance.get(`/sessions?mentorId=${mentorId}`),
        ]);
        setAvailability(availRes.data.availability || []);
        setSessions(sessionRes.data.sessions || []);
      } catch (err) {
        const error = err as AxiosError;
        console.error("Error loading booking data:", error.message);
        setError("❌ Failed to load availability or sessions.");
      }
    };

    if (mentorId) {
      fetchData();
    }
  }, [mentorId]);

  const isSlotBooked = (date: string, timeRange: string) => {
    return sessions.some((s) => s.date === date && s.time === timeRange);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      setError("❌ Please select both date and time.");
      return;
    }

    if (isSlotBooked(selectedDate, selectedTime)) {
      setError("❌ This time slot is already booked. Please choose another.");
      return;
    }

    try {
      await axiosInstance.post("/sessions", {
        mentorId,
        date: selectedDate,
        time: selectedTime,
      });

      alert("✅ Session booked successfully!");
      navigate("/mentee/dashboard");
    } catch (err) {
      const error = err as AxiosError;
      console.error("Booking failed:", error.message);
      setError("❌ Failed to book session. Please try again.");
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Book a Session</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Select Date:</label>
          <input
            type="date"
            className="border p-2 rounded w-full"
            value={selectedDate}
            onChange={(e) => {
              setSelectedDate(e.target.value);
              setSelectedTime("");
              setError("");
            }}
          />
        </div>

        <div>
          <label className="block font-medium">Select Time:</label>
          <select
            className="border p-2 rounded w-full"
            value={selectedTime}
            onChange={(e) => setSelectedTime(e.target.value)}
            disabled={!selectedDate}
          >
            <option value="">-- Select Time Slot --</option>
            {availability
              .filter(
                (slot) =>
                  !isSlotBooked(selectedDate, `${slot.startTime}-${slot.endTime}`)
              )
              .map((slot) => (
                <option
                  key={slot._id}
                  value={`${slot.startTime}-${slot.endTime}`}
                >
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </option>
              ))}
          </select>
        </div>

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Book Session
        </button>
      </form>

      <div className="mt-8">
        <h2 className="text-lg font-semibold mb-2">Already Booked Sessions:</h2>
        <ul className="list-disc list-inside">
          {sessions.length === 0 ? (
            <p>No sessions booked yet.</p>
          ) : (
            sessions.map((s) => (
              <li key={s._id}>
                {s.date} - {s.time}
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
};

export default BookMentor;