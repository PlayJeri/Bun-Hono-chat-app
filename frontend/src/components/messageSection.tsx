import React from "react";

const myId = 3;

export type Message = {
	id: number;
	text: string;
	sender: string;
	time: string;
};

type MessageSectionProps = {
	messages: Message[];
};

export const MessageSection: React.FC<MessageSectionProps> = ({ messages }) => {
	return (
		<div className="flex-1 p-4 space-y-4 overflow-y-auto">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`max-w-md p-3 rounded-lg ${
						message.id !== myId ? "ml-auto bg-purple-900" : "bg-indigo-900"
					}`}
				>
					<p className="text-sm text-slate-300">{message.text}</p>
					<span
						className={`block mt-1 text-xs ${
							message.id === myId ? "text-gray-400" : "text-indigo-300"
						}`}
					>
						{message.sender} - {message.time}
					</span>
				</div>
			))}
		</div>
	);
};
