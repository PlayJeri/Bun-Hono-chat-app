import { checkAccessToken } from "../Middleware/accessToken";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { db } from "../db/database";

const friends = new Hono<{ Variables: ContextVariables }>();


friends.use(checkAccessToken);

friends.get('/', async (c) => {
    const userId = c.get('decodedPayload').id;
    return c.json({ message: "Hello Friends" });
})

friends.post('/add', async (c) => {
    try {
        const { friendId } = await c.req.json();
        const userId = c.get('decodedPayload').id;

        const query = db.query("SELECT id FROM users WHERE id = $id;");
        const user = query.get(friendId);

        if (!user) {
            return c.json({ message: "User not found" }, 400);
        }

        const insert = db.query("INSERT INTO friends (user_id, friend_id) VALUES($userId, $friendId);");
        insert.run(userId, friendId);

        return c.json({ message: "Added" });
    } catch (error) {
        return c.json({ message: "Internal Server Error" }, 500);
    }
})

export { friends };
