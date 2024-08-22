import { db } from "./database";
import { ChatMessage } from "./types";
import { message as messageTable } from "./schema";

export async function addMsgToDb(
	conversationId: string,
	userId: number,
	message: string
) {
	try {
		await db
			.insert(messageTable)
			.values({ conversationId, userId, message })
			.returning();
	} catch (error) {
		console.error("Add message to db error", error);
		throw error;
	}
}

export async function getMessagesFromDb(
	conversationId: string,
	limit: number
): Promise<ChatMessage[]> {
	try {
		const query = await db.query(`
            SELECT messages.*, users.username as username
            FROM messages
            JOIN users on messages.user_id = users.id
            WHERE conversation_id = $conversationId
            ORDER BY messages.id DESC
            LIMIT $limit;
        `);
		const messages = (await query.all({
			$conversationId: conversationId,
			$limit: limit,
		})) as ChatMessage[];

		console.log(messages);

		return messages;
	} catch (error) {
		console.error("Get messages from db error", error);
		throw error;
	}
}

export async function getReceiverId(username: string): Promise<number> {
	try {
		const query = await db.query(`
            SELECT id FROM users
            WHERE username = $username;
        `);
		const user = (await query.get({ $username: username })) as { id: number };

		return user.id;
	} catch (error) {
		console.error("Get receiver id error", error);
		throw error;
	}
}
