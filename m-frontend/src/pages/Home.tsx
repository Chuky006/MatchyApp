import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen flex flex-col justify-center items-center text-gray-800 bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1581093588401-b95a5d93ff06?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-white bg-opacity-90"></div>

      {/* Content */}
      <div className="relative z-10 flex flex-col justify-center items-center text-center p-6">
        {/* Animated M Logo */}
        <div className="text-7xl font-bold text-purple-700 animate-bounce mb-4 shadow-lg rounded-full w-24 h-24 flex items-center justify-center bg-white border-4 border-purple-300">
          M
        </div>

        {/* App Name */}
        <h1 className="text-5xl md:text-6xl font-extrabold text-purple-800 tracking-wide font-serif mb-2">
          MATCHY
        </h1>

        {/* Slogan */}
        <p className="mt-1 text-xl text-gray-700 italic">
          Connecting mentors and mentees for a brighter future!
        </p>

        {/* Buttons */}
        <div className="mt-8 flex space-x-4">
          <button
            onClick={() => navigate("/register")}
            className="px-6 py-3 bg-purple-700 text-white rounded-xl text-lg hover:bg-purple-800 shadow transition-all duration-300"
          >
            REGISTER
          </button>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-3 bg-white border-2 border-purple-700 text-purple-700 rounded-xl text-lg hover:bg-purple-100 shadow transition-all duration-300"
          >
            LOGIN
          </button>
        </div>
      </div>
    </div>
  );
}
