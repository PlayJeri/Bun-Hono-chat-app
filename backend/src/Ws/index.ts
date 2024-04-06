import { Server, ServerWebSocket } from "bun";
import { db } from "../db/database";
import { WebSocketData, WebSocketMsg } from "../Types";
import { addMsgToDb, getReceiverId } from "../db/wsMessages";

export async function getConversationID(id1: number, id2: number): Promise<string | null> {
    try {
        const query = await db.query(`
            SELECT id FROM conversations
            WHERE ($id1 = user1_id AND $id2 = user2_id)
            OR ($id1 = user2_id AND $id2 = user1_id);
        `)
        const result = await query.get({ $id1: id1, $id2: id2 }) as { id: string };

        if (result) {
            return result.id;
        }

        return null;
        
    } catch (error) {
        console.error(error);
        return null;
    }
};


export async function createConversation(id1: number, id2: number): Promise<string> {
    try {
        const uuid = crypto.randomUUID();

        const insert = await db.query(`
            INSERT INTO conversations (id, user1_id, user2_id)
            VALUES ($uuid, $id1, $id2)
            RETURNING id;
        `)
        await insert.run({ $uuid: uuid, $id1: id1, $id2: id2 });

        return uuid;
        
    } catch (error) {
        console.error(error);
        throw new Error("Create conversation error");
    }
}

export async function subscribeToConversations(id: number, ws: ServerWebSocket<WebSocketData>) {
    try {
        const query = await db.query(`
            SELECT id FROM conversations
            WHERE user1_id = $id OR user2_id = $id;
        `);
        const conversations = await query.all({ $id: id }) as {id: string}[];

        conversations.forEach((conversation) => {
            console.log(ws.data.username, "subscribing to conversation", conversation.id);
            ws.subscribe(conversation.id);
        });
    } catch (error) {
        console.error("Subscribe to conversations error", error);
    }
}


export async function wsMessageHandler(ws: ServerWebSocket<WebSocketData>, server: Server, message: string | Buffer) {
    if (typeof message === 'string') {
        const msg = JSON.parse(message) as WebSocketMsg;

        switch (msg.type) {
            case 'message':
                const { recipient, message } = msg.payload as { recipient: string, message: string };
                await wsConversationMessageHandler(ws, server, recipient, message);
                break;
        }
    }
}

export async function wsConversationMessageHandler(ws: ServerWebSocket<WebSocketData>, server: Server, recipientUsername: string, message: string) {
    const receiverId = await getReceiverId(recipientUsername);
    let conversation = await getConversationID(ws.data.userId, receiverId);

    if (conversation === null) {
        console.log("Creating conversation");
        conversation = await createConversation(ws.data.userId, receiverId);
    }

    server.publish(conversation, message);
    await addMsgToDb(conversation, ws.data.userId, message);
}