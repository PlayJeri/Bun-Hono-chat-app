import { checkAccessToken } from "../Middleware/accessToken";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { db } from "../db/database";
import { contact, user } from "../db/schema";
import { eq } from "drizzle-orm";

const friends = new Hono<{ Variables: ContextVariables }>();

friends.use(checkAccessToken);

friends.get("/", async (c) => {
  const userId = c.get("decodedPayload").id;
  return c.json({ message: "Hello Friends" });
});

friends.post("/add", async (c) => {
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

    db.insert(contact).values({ userId, friendId });

    return c.json({ message: "Added" });
  } catch (error) {
    return c.json({ message: "Internal Server Error" }, 500);
  }
});

export { friends };
