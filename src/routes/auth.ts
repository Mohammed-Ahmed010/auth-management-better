import express, { Request, Response } from "express";
import { handleUserLogin, handleUserRegistration } from "../controllers/auth";
const authRouter = express.Router();

authRouter.post("/register", handleUserRegistration);
authRouter.post("/login", handleUserLogin);

export default authRouter;
