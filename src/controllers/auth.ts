import { signJWT, verifyJWT } from "../auth/jwt";
import { hashPassword, verifyPassword } from "../auth/password";
import prisma from "../db/client";
import { Request, Response } from "express";
import { userRegistration, userLogin } from "../types/auth";

export async function handleUserRegistration(req: Request, res: Response) {
	const credentials: userRegistration = req.body;
	const email = credentials.email;
	const password = credentials.password;
	const name = credentials.name;
	if (!email || !password) {
		return res
			.status(400)
			.json({ error: "Email and password are required" });
	}
	try {
		const existingUser = await prisma.user.findUnique({ where: { email } });
		console.log("existing     " + existingUser);

		if (existingUser) {
			return res.status(409).json({ error: "user already exist" });
		}
		const hashed = await hashPassword(password);
		const user = await prisma.user.create({
			data: {
				email,
				password: hashed,
				name,
			},
		});

		const token = signJWT({ userId: user.id });
		return res.status(201).json({ token });
	} catch (err) {
		res.status(500).json({ error: "Registration failed" });
	}
}

export async function handleUserLogin(req: Request, res: Response) {
	const credentials: userLogin = req.body;
	const email = credentials.email;
	const password = credentials.password;
	if (!email || !password) {
		return res
			.status(400)
			.json({ error: "Email and password are required" });
	}
	try {
		const user = await prisma.user.findUnique({ where: { email } });
		if (!user || !user.password) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		const valid = await verifyPassword(password, user.password);
		if (!valid) {
			return res.status(401).json({ error: "Invalid credentials" });
		}
		const token = signJWT({ userId: user.id });
		return res.status(201).json({ token });
	} catch (err) {
		res.status(500).json({ error: "login failed" });
	}
}
