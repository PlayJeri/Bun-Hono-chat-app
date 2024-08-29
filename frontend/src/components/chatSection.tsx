import { ChatHeader } from "./chatHeader";
import { Message, MessageSection } from "./messageSection";
import { MessageInputSection } from "./messageInputSection";

// Mock data
const chatInfo = {
	chatName: "Team Chat",
	members: ["Alice", "Bob", "Charlie", "David"],
};

const messages: Message[] = [
	{ id: 1, sender: "Alice", text: "Hello everyone!", time: "10:00 AM" },
	{ id: 2, sender: "Bob", text: "Hi Alice!", time: "10:05 AM" },
	{ id: 3, sender: "Charlie", text: "Good morning!", time: "10:10 AM" },
	{ id: 4, sender: "David", text: "Hey folks!", time: "10:15 AM" },
];

export const ChatSection = () => {
	return (
		<>
			{/* Chat info */}
			<ChatHeader chatInfo={chatInfo} />

			{/* Message section */}
			<MessageSection messages={messages} />

			{/* Message input */}
			<MessageInputSection />
		</>
	);
};
