import {
	ConversationMessagePayload,
	SubscribeToConversationPayload,
	WebSocketData,
	WebSocketMsg,
} from "../Types";
import { ServerWebSocket, WebSocketHandler } from "bun";
import { insertMsgToDb, subscribeToConversations } from "./messageHandlers";
import { server } from "..";
import { currentUsersMap } from "./currentUsers";

export const websocket: WebSocketHandler<WebSocketData> = {
	open(ws) {
		console.log("WebSocket connection opened");
		const { userId, username } = ws.data;
		subscribeToConversations(ws);
		currentUsersMap.set(userId, { username, id: userId, ws });
	},
	message(ws, message) {
		wsMessageHandler(ws, message);
	},
	close(ws) {
		const { userId } = ws.data;
		currentUsersMap.delete(userId);
		console.log("WebSocket connection closed");
	},
};

async function wsMessageHandler(
	ws: ServerWebSocket<WebSocketData>,
	message: string | Buffer
) {
	if (typeof message === "string") {
		const msg: WebSocketMsg = JSON.parse(message);

		switch (msg.type) {
			case "conversation_message":
				const { conversationId, message, senderId, senderUsername } =
					msg.payload as ConversationMessagePayload;

				const inserted = await insertMsgToDb(conversationId, senderId, message);
				const newMessage = { ...inserted, senderUsername };
				server.publish(conversationId, JSON.stringify(newMessage));
				break;
			case "subscribe_to_conversation":
				const subPayload = msg.payload as SubscribeToConversationPayload;
				ws.subscribe(subPayload.chatName);
				break;
			default:
				console.error("Invalid message type");
				return new Error("Invalid message type.");
		}
	}
}
