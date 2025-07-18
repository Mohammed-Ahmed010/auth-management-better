import prisma from "./client";

async function test() {
	try {
		const ss = await prisma.$connect();
		console.log("database connected");
	} catch (err) {
		console.log("database not connected");
	}
}

test();
