import express from "express";
import { users, editProfile} from "../controller/profile.js";
import { authMiddleware } from "../Middleware/authMiddleware.js";

const profileRoutes = express.Router()

profileRoutes.get("/users/:id", authMiddleware, users);
profileRoutes.put("/editProfile/:id", authMiddleware, editProfile);

export default profileRoutes;