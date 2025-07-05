import express from 'express';
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import connectDb from "./config/mongodb.js";
import AuthRoutes from "./routes/AuthRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import cookieParser from "cookie-parser";
import mentorshipRoutes from "./routes/mentorshipRoutes.js";
import availabilityRoutes from "./routes/availabilityRoutes.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";






dotenv.config();

const port = process.env.PORT
const app = express();

app.use(express.json());
app.use(cookieParser())

app.use("/api/auth", AuthRoutes)
app.use("/api/profile", profileRoutes)
//connecting to database

app.use("/api/requests", mentorshipRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/admin", adminRoutes);


//test API
app.get("/", (req, res) =>{
    res.json({message:"Welcome to Matchy Backend!"})
})

connectDb();

app.listen(port, ()=>{
    console.log("Server is running");
})