import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET: any = process.env.JWT_SECRET;

export function signJWT(payload: object): string {
	return jwt.sign(payload, JWT_SECRET);
}

export function verifyJWT<T>(token: string): T | null {
	try {
		return jwt.verify(token, JWT_SECRET) as T;
	} catch (err) {
		return null;
	}
}
