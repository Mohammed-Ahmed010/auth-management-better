import express from "express";
import {
	handleUserLogin,
	handleUserRegistration,
	handleGoogleCallback,
} from "../controllers/auth";
import passport from "../auth/passport";
const authRouter = express.Router();

authRouter.post("/register", handleUserRegistration);
authRouter.post("/login", handleUserLogin);
authRouter.get(
	"/google",
	passport.authenticate("google", { scope: ["profile", "email"] })
);
authRouter.get(
	"/oauth2/redirect/google",
	passport.authenticate("google", {
		session: false,
		successRedirect: "/",
		failureRedirect: "/login",
	}),
	handleGoogleCallback
);
export default authRouter;
