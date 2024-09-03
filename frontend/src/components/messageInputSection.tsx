import { useAuth } from "@/contextProviders/useAuthContext";
import { useWebSocket } from "@/contextProviders/useWsContext";
import { WebSocketMsg } from "@backend/src/Types";
import React, { useState } from "react";

type MessageInputSectionProps = {
	chatId: string | undefined;
};

export const MessageInputSection: React.FC<MessageInputSectionProps> = ({
	chatId,
}) => {
	const [message, setMessage] = useState<string>("");
	const { sendMessage } = useWebSocket();
	const { user } = useAuth();

	function handleSendMessage() {
		if (!message || !chatId || !user) return;
		const msg: WebSocketMsg = {
			type: "conversation_message",
			payload: {
				message,
				conversationId: chatId,
				senderId: user.id,
				senderUsername: user.username,
			},
		};
		sendMessage(msg);
	}

	return (
		<div className="p-4 bg-gray-800 border-t border-gray-700">
			<div className="flex items-center space-x-2">
				<input
					type="text"
					onChange={(e) => setMessage(e.target.value)}
					placeholder="Type a message"
					className="flex-1 px-4 py-2 text-gray-100 bg-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500"
				/>
				<button
					onClick={() => handleSendMessage()}
					className="p-2 text-white transition-colors bg-purple-600 rounded-full hover:bg-purple-700"
				>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						className="w-6 h-6"
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path
							strokeLinecap="round"
							strokeLinejoin="round"
							strokeWidth={2}
							d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
						/>
					</svg>
					<span className="sr-only">Send message</span>
				</button>
			</div>
		</div>
	);
};
