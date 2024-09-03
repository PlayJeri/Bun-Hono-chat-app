import { checkAccessToken } from "../Middleware/accessToken";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { db } from "../db/database";
import { ChatHistoryReqSchema } from "../ValidationModels/ChatHistoryRequest";
import { conversation, conversationMember, message, user } from "../db/schema";
import { eq, and, sql, asc } from "drizzle-orm";
import { createConversation } from "../Ws/messageHandlers";
import { zValidator } from "@hono/zod-validator";

const chat = new Hono<{ Variables: ContextVariables }>()
	.use(checkAccessToken)
	.get("/history", zValidator("query", ChatHistoryReqSchema), async (c) => {
		try {
			const { conversationId, limit, offset } = await c.req.query();

			const messages = await db
				.select({ message: message, username: user.username })
				.from(message)
				.leftJoin(user, eq(message.userId, user.id))
				.where(eq(message.conversationId, conversationId))
				.orderBy(asc(message.createdAt))
				.limit(+limit)
				.offset(+offset);

			const transformedMessages = messages.map((msg) => ({
				message: msg.message.message,
				id: msg.message.id,
				time: msg.message.createdAt,
				sender: msg.username,
			}));

			return c.json(transformedMessages);
		} catch (error) {
			console.error(error);
			return c.json({ message: "Internal Server Error!!" }, 500);
		}
	})

	.post("/create", async (c) => {
		try {
			const { chatName } = await c.req.json();
			const newChatId = await createConversation(chatName);

			return c.json({ message: `Chat ${chatName} created successfully!` });
		} catch (error) {
			console.error(error);
			return c.json({ message: "Internal Server Error!" }, 500);
		}
	})

	.post("/join", async (c) => {
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
	})

	.get("/all", async (c) => {
		try {
			const { id } = c.get("decodedPayload");

			const chatData = await db
				.select({
					chatName: conversation.chatName,
					id: conversation.id,
					latestMessage: message.message,
				})
				.from(conversationMember)
				.innerJoin(
					conversation,
					eq(conversationMember.conversationId, conversation.id)
				)
				.leftJoin(
					message,
					and(
						eq(message.conversationId, conversation.id),
						eq(
							message.id,
							sql`(
								SELECT MAX(${message.id})
								FROM ${message}
								WHERE ${message.conversationId} = ${conversation.id}
							)`
						)
					)
				)
				.where(eq(conversationMember.userId, id));

			return c.json(chatData);
		} catch (error) {
			console.error("Error fetching chat data:", error);
			return c.json({ error });
		}
	})

	.get("/members", async (c) => {
		try {
			const chatId = await c.req.query("chatId");
			if (!chatId) {
				return c.json({ error: "Chat id is required" }, 400);
			}
			const chatMembers = await db
				.select({ username: user.username })
				.from(conversationMember)
				.where(eq(conversationMember.conversationId, chatId))
				.innerJoin(user, eq(user.id, conversationMember.userId));

			const usernames = chatMembers.map((user) => user.username);

			return c.json(usernames);
		} catch (error) {
			console.error("Error fetching chat member data", error);
			return c.json({ message: "Internal Server Error!" }, 500);
		}
	});

export { chat };
