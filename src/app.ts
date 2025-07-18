import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { requireAuth } from "./middlewares/auth";
import authRouter from "./routes/auth";
import morgan from "morgan";
import session from "express-session";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(
	session({
		// store,
		secret: process.env.JWT_SECRET!,
		resave: false,
		saveUninitialized: false,
		cookie: { secure: false, httpOnly: true, maxAge: 1000 * 60 * 60 * 24 }, // 1 day
	})
);
app.use("/", authRouter);
app.get("/", (req: Request, res: Response) => {
	return res.send("home");
});
app.get("/profile", requireAuth, (req: Request, res: Response) => {
	return res.send("hiii");
});

export default app;
