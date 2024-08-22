import {
	ConversationMessagePayload,
	SubscribeToConversationPayload,
	WebSocketData,
	WebSocketMsg,
} from "../Types";
import { ServerWebSocket, WebSocketHandler } from "bun";
import { subscribeToConversations } from "./messageHandlers";
import { server } from "..";

export const websocket: WebSocketHandler<WebSocketData> = {
	open(ws) {
		console.log("WebSocket connection opened");
		ws.send("Welcome to the WebSocket server!");
		subscribeToConversations(ws);
	},
	message(ws, message) {
		wsMessageHandler(ws, message);
	},
	close(ws) {
		console.log("WebSocket connection closed");
	},
};

function wsMessageHandler(
	ws: ServerWebSocket<WebSocketData>,
	message: string | Buffer
) {
	if (typeof message === "string") {
		const msg: WebSocketMsg = JSON.parse(message);

		switch (msg.type) {
			case "conversation_message":
				const { conversationId, message } =
					msg.payload as ConversationMessagePayload;

				server.publish(conversationId, message);
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
