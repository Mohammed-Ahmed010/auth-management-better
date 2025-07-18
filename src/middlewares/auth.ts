import { Request, Response, NextFunction } from "express";
import { verifyJWT } from "../auth/jwt";

export function requireAuth(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res.status(401).json({ error: "Unauthorized" });
	}
	const token = authHeader.split(" ")[1];
	const payload = verifyJWT<{ userId: string }>(token);
	if (!payload) {
		return res.status(401).json({ error: "Unoauthorized" });
	}
	// @ts-ignore
	req.userId = payload.userId;
	next();
}
