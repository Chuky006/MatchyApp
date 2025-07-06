import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

// import routes
import AuthRoutes from "./routes/AuthRoutes.js";
import ProfileRoutes from "./routes/profileRoutes.js";
// import other routes here...

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors());

// Routes
app.use("/api/auth", AuthRoutes);
app.use("/api/profile", ProfileRoutes);
// more app.use() for other routes like sessions, requests, etc.

export default app;