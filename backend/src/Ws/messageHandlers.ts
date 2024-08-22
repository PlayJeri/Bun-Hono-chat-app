import { ServerWebSocket } from "bun";
import { eq } from "drizzle-orm";
import { db } from "../db/database";
import { WebSocketData } from "../Types";
import { conversation, conversationMember } from "../db/schema";

export async function createConversation(chatName: string): Promise<string> {
	try {
		const uuid = crypto.randomUUID();

		await db.insert(conversation).values({ id: uuid, chatName });

		return uuid;
	} catch (error) {
		console.error("Create conversation error: ", error);
		throw new Error("Create conversation error");
	}
}

export async function subscribeToConversations(
	ws: ServerWebSocket<WebSocketData>
) {
	try {
		const conversations = await db
			.select()
			.from(conversationMember)
			.where(eq(conversationMember.userId, ws.data.userId));

		conversations.forEach((conversation) => {
			console.log(
				ws.data.username,
				"subscribing to conversation",
				conversation.conversationId
			);
			ws.subscribe(conversation.conversationId);
		});
	} catch (error) {
		console.error("Subscribe to conversations error", error);
	}
}
