import { ChatHeader } from "./chatHeader";
import { MessageSection } from "./messageSection";
import { MessageInputSection } from "./messageInputSection";
import { ChatData, ChatMessage } from "@/types";
import { getChatHistory, getChatMembers } from "@/lib/app";
import { useEffect, useState } from "react";
import { useWebSocket } from "@/contextProviders/useWsContext";

type ChatSectionProps = {
	chatData: ChatData | null;
};

export const ChatSection: React.FC<ChatSectionProps> = ({ chatData }) => {
	const [members, setMembers] = useState<string[]>([]);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const { ws } = useWebSocket();

	if (ws !== undefined) {
		ws.onmessage = (event) => {
			const { message, id, createdAt, senderUsername } = JSON.parse(event.data);
			const newMessage: ChatMessage = {
				message,
				id,
				sender: senderUsername,
				time: createdAt,
			};
			setMessages((prevMessages) => [...prevMessages, newMessage]);
		};
	}

	useEffect(() => {
		async function fetchMembers() {
			if (chatData !== null) {
				const members = await getChatMembers(chatData.id);
				setMembers(members);
			}
		}

		async function fetchChatHistory() {
			if (chatData !== null) {
				const history = await getChatHistory(chatData.id);
				setMessages(history);
			}
		}

		fetchMembers();
		fetchChatHistory();
	}, [chatData]);

	const chatHeaderInfo = { chatName: chatData?.chatName ?? "", members };

	return (
		<>
			{/* Chat info */}
			<ChatHeader chatInfo={chatHeaderInfo} />

			{/* Message section */}
			<MessageSection messages={messages} />

			{/* Message input */}
			<MessageInputSection chatId={chatData?.id} />
		</>
	);
};
