import { checkAccessToken } from "../Middleware/accessToken";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { db } from "../db/database";
import { getMessagesFromDb } from "../db/wsMessages";

const chat = new Hono<{ Variables: ContextVariables }>();

chat.use(checkAccessToken);

interface HistoryBody {
    conversationId: string;
    limit: number;
    offset: number;
}

chat.post("/history", async (c) => {
    try {
        const body = await c.req.json<HistoryBody>();

        const messages = await getMessagesFromDb(body.conversationId, body.limit);
        console.log(messages);

        return c.json(messages);
    } catch (error) {
        console.error(error);
        return c.json({ message: "Internal Server Error!!" }, 500);
    }
})

export { chat };
