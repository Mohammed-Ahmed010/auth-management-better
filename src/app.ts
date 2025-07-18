import express, { Request, Response } from "express";
import dotenv from "dotenv";
import { requireAuth } from "./middlewares/auth";
import authRouter from "./routes/auth";
import morgan from "morgan";
dotenv.config();

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use("/", authRouter);
app.get("/", (req: Request, res: Response) => {
	return res.send("home");
});
app.get("/profile", requireAuth, (req: Request, res: Response) => {
	return res.send("hiii");
});

export default app;
