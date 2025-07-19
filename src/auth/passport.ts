import passport from "passport";
import { Strategy as GitHubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";
import prisma from "../db/client";

dotenv.config();

passport.serializeUser((user: any, done) => {
	done(null, user.id);
});

passport.deserializeUser(async (userId: string, done) => {
	try {
		const user = await prisma.user.findUnique({ where: { id: userId } });
		done(null, user);
	} catch (err) {
		done(err, null);
	}
});

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
			callbackURL: "/oauth2/redirect/google",
		},
		async function verify(
			accessToken: any,
			refreshToken: any,
			profile: any,
			done: any
		) {
			try {
				let user = await prisma.user.findFirst({
					where: {
						oauthAccounts: {
							some: {
								provider: "google",
								providerId: profile.id,
							},
						},
					},
				});
				if (!user) {
					user = await prisma.user.create({
						data: {
							email: profile.emails?.[0]?.value || "",
							name: profile.displayname,
							oauthAccounts: {
								create: {
									provider: "google",
									providerId: profile.id,
								},
							},
						},
					});
				}
				done(null, user);
			} catch (err) {
				done(err, null);
			}
		}
	)
);

export default passport;
