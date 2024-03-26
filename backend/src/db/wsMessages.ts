import { db } from "./database";
import { ChatMessage } from "./types";

export async function addMsgToDb(conversationId: string, userId: number, message: string) {
    try {
        const insert = await db.query(`
            INSERT INTO messages (conversation_id, user_id, message, timestamp)
            VALUES ($conversationId, $userId, $message, $currentTime);
        `)
        const currentTime = new Date().toISOString();
        await insert.run({ $conversationId: conversationId, $userId: userId, $message: message, $currentTime: currentTime });
    } catch (error) {
        console.error("Add message to db error", error);
    }
}


export async function getMessagesFromDb(conversationId: string, limit: number): Promise<ChatMessage[]> {
    try {
        const query = await db.query(`
            SELECT * FROM messages
            WHERE conversation_id = $conversationId
            ORDER BY id DESC
            LIMIT $limit;
        `);
        const messages = await query.all({ $conversationId: conversationId, $limit: limit }) as ChatMessage[];
        
        console.log(messages);

        return messages;
    } catch (error) {
        console.error("Get messages from db error", error);
        throw error;
    }
}