import {register, login, logout, users} from "../controller/auth.js";
import express from "express";

const AuthRoutes = express.Router();

//user registration route
AuthRoutes.post("/register", register)
AuthRoutes.post("/login", login)
AuthRoutes.post("/logout", logout)
AuthRoutes.get("/users/:id", users)

export default AuthRoutes;