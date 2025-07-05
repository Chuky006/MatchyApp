import {register, login, logout, users, getCurrentUser} from "../controller/auth.js";
import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";


const AuthRoutes = express.Router();

//user registration route
AuthRoutes.post("/register", register)
AuthRoutes.post("/login", login)
AuthRoutes.post("/logout", logout)
AuthRoutes.get("/users/:id", users)
AuthRoutes.get("/me", authMiddleware, getCurrentUser);

export default AuthRoutes;