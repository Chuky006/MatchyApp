import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-b from-white to-blue-50 text-gray-800">
      {/* Animated M Logo */}
      <div className="text-7xl font-bold text-blue-600 animate-bounce mb-4 shadow-lg rounded-full w-24 h-24 flex items-center justify-center bg-white border border-blue-200">
        M
      </div>

      {/* App Name */}
      <h1 className="text-5xl md:text-6xl font-extrabold text-center text-blue-700 tracking-wide font-serif">
        MATCHY
      </h1>

      {/* Slogan */}
      <p className="mt-3 text-lg text-center italic text-gray-600">
        Connecting mentors and mentees for a brighter future!
      </p>

      {/* Buttons */}
      <div className="mt-8 flex space-x-4">
        <button
          onClick={() => navigate("/register")}
          className="px-6 py-3 bg-blue-600 text-white rounded-xl text-lg hover:bg-blue-700 shadow transition-all duration-300"
        >
          REGISTER
        </button>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-3 bg-white border border-blue-600 text-blue-600 rounded-xl text-lg hover:bg-blue-100 shadow transition-all duration-300"
        >
          LOGIN
        </button>
      </div>
    </div>
  );
}