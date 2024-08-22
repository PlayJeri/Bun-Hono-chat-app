import { checkAccessToken } from "../Middleware/accessToken";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { db } from "../db/database";
import { getMessagesFromDb } from "../db/wsMessages";
import { validator } from "hono/validator";
import { RegisterSchema } from "../ValidationModels/Register";
import { ChatHistoryReqSchema } from "../ValidationModels/ChatHistoryRequest";
import { conversationMember, message, user } from "../db/schema";
import { desc, eq } from "drizzle-orm";
import { createConversation } from "../Ws/messageHandlers";

const chat = new Hono<{ Variables: ContextVariables }>();

chat.use(checkAccessToken);

chat.post(
	"/history",
	validator("json", async (value, c) => {
		try {
			const parsed = ChatHistoryReqSchema.safeParse(value);
			if (!parsed.success) {
				return c.status(400);
			}

			const { conversationId, limit, offset } = parsed.data;

			const messages = await db
				.select({ message: message, username: user.username })
				.from(message)
				.leftJoin(user, eq(message.userId, user.id))
				.where(eq(message.conversationId, conversationId))
				.orderBy(desc(message.createdAt))
				.limit(limit)
				.offset(offset);

			console.log(messages);

			return c.json(messages);
		} catch (error) {
			console.error(error);
			return c.json({ message: "Internal Server Error!!" }, 500);
		}
	})
);

chat.post("/create", async (c) => {
	try {
		const { chatName } = await c.req.json();
		const newChatId = await createConversation(chatName);

		return c.json({ message: `Chat ${chatName} created successfully!` });
	} catch (error) {
		console.error(error);
		return c.json({ message: "Internal Server Error!" }, 500);
	}
});

chat.post("/join", async (c) => {
	try {
		const { chatId } = await c.req.json();
		const { id } = c.get("decodedPayload");

		console.log(chatId, id);

		if (!chatId || !id)
			return c.json({ message: "Missing user or chat id" }, 400);

		const user = await db
			.select()
			.from(conversationMember)
			.where(
				eq(conversationMember.conversationId, chatId) &&
					eq(conversationMember.userId, id)
			);
		if (user.length !== 0) {
			return c.json({ message: "User is already in chat" }, 400);
		}

		await db
			.insert(conversationMember)
			.values({ conversationId: chatId, userId: id });

		return c.status(200);
	} catch (error) {
		console.error("join error:", error);
		return c.json({ error });
	}
});

export { chat };
