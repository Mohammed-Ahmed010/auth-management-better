import { RateLimiterRedis } from "rate-limiter-flexible";
import Redis from "ioredis";
import { Request, Response, NextFunction } from "express";

const redisClient = new Redis(process.env.REDIS_URL!);

const rateLimiter = new RateLimiterRedis({
	storeClient: redisClient,
	keyPrefix: "rlflx",
	points: 10, // 10 requests
	duration: 60, // per 60 seconds per IP
});

export function rateLimit(req: Request, res: Response, next: NextFunction) {
	rateLimiter
		.consume(req.ip || "")
		.then(() => {
			next();
		})
		.catch(() => {
			res.status(429).json({ error: "Too many requests" });
		});
}
