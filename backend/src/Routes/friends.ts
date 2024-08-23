import { checkAccessToken } from "../Middleware/accessToken";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { db } from "../db/database";
import { contact, user } from "../db/schema";
import { eq } from "drizzle-orm";
import { currentUsersMap } from "../Ws/currentUsers";

const friends = new Hono<{ Variables: ContextVariables }>()
.use(checkAccessToken)

.get("/online", async (c) => {
	try {
		const userId = c.get("decodedPayload").id;
		const onlineContacts: { username: string; id: number }[] = [];

		const dbContacts = await db
			.select({ friendId: contact.friendId })
			.from(contact)
			.where(eq(contact.userId, userId));

		dbContacts.forEach((contact) => {
			const user = currentUsersMap.get(contact.friendId);
			console.log(currentUsersMap.keys());
			console.log(user);
			if (user != undefined) {
				onlineContacts.push({ username: user.username, id: user.id });
			}
		});

		return c.json(onlineContacts);
	} catch (error) {
		console.error("Get online friends error: ", error);
		return c.json({ message: "Internal server error" }, 500);
	}
})

.post("/add", async (c) => {
	try {
		const { friendId } = await c.req.json();
		const userId = c.get("decodedPayload").id;

		if (userId == friendId) {
			return c.json({ message: "Invalid request" }, 400);
		}

		const users = await db.select().from(user).where(eq(user.id, friendId));

		if (users.length === 0) {
			return c.json({ message: "User not found" }, 400);
		}

		const dbUser = users[0];

		const res = await db
			.insert(contact)
			.values({ userId, friendId })
			.returning();
		console.log(res);
		console.log(userId, friendId);

		return c.json({ message: "Added" });
	} catch (error) {
		return c.json({ message: "Internal Server Error" }, 500);
	}
});

export { friends };
