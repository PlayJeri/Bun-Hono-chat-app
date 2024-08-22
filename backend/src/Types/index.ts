type ContextVariables = {
	decodedPayload: DecodedPayload;
	request: Request;
};

type DecodedPayload = {
	id: number;
	username: string;
};

type WebSocketData = {
	username: string;
	userId: number;
};

type WebSocketMsg = {
	type: MessageType;
	payload: MessagePayloads;
};

type MessageType =
	| "conversation_message"
	| "conversation_message_like"
	| "subscribe_to_conversation";

type MessagePayloads =
	| ConversationMessagePayload
	| LikeMessagePayload
	| SubscribeToConversationPayload;

type ConversationMessagePayload = {
	message: string;
	conversationId: string;
};

type SubscribeToConversationPayload = {
	conversationId: string;
	chatName: string;
};

type LikeMessagePayload = {
	messageId: string;
};

export {
	DecodedPayload,
	ContextVariables,
	WebSocketData,
	WebSocketMsg,
	MessagePayloads,
	MessageType,
	ConversationMessagePayload,
	SubscribeToConversationPayload,
};
