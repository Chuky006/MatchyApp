import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";

import connectDb from "./config/mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import mentorRoutes from "./routes/mentorRoute.js";
import errorHandler from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

//CORS
const allowedOrigins = [
  "https://matchy-app.vercel.app",
  "https://matchy-koadan134-ochukos-projects-dc4d2fef.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error("❌ Blocked CORS origin:", origin);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "Accept",
      "Origin",
    ],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

//API Routes
app.use("/api/auth", AuthRoutes);
console.log("🔐 AuthRoutes mounted at /api/auth");

app.use("/api/profile", profileRoutes);
console.log("👤 ProfileRoutes mounted at /api/profile");

app.use("/api/requests", mentorshipRoutes);
console.log("🤝 MentorshipRoutes mounted at /api/requests");

app.use("/api/availability", availabilityRoutes);
console.log("🕒 AvailabilityRoutes mounted at /api/availability");

app.use("/api/sessions", sessionRoutes);
console.log("📅 SessionRoutes mounted at /api/sessions");

app.use("/api/admin", adminRoutes);
console.log("🛠 AdminRoutes mounted at /api/admin");

app.use("/api/mentor", mentorRoutes);
console.log("🎓 MentorRoutes mounted at /api/mentor");

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Matchy Backend!" });
});

app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

//Global Error Handler
app.use(errorHandler);

//Connect DB and Start Server
connectDb();
app.listen(port, () => {
  console.log("🚀 Triggering redeploy for profile route");
  console.log(`✅ Server running on port ${port}`);
});