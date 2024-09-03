import { useAuth } from "@/contextProviders/useAuthContext";
import { ChatMessage } from "@/types";
import React from "react";
import { formatTime } from "@/helpers/timeFormat";

type MessageSectionProps = {
	messages: ChatMessage[];
};

export const MessageSection: React.FC<MessageSectionProps> = ({ messages }) => {
	const { user } = useAuth();
	return (
		<div className="flex-1 p-4 space-y-4 overflow-y-auto">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`max-w-md p-3 rounded-lg ${
						message.sender !== user?.username
							? "ml-auto bg-purple-900"
							: "bg-indigo-900"
					}`}
				>
					<p className="text-sm text-slate-300">{message.message}</p>
					<span
						className={`block mt-1 text-xs ${
							message.sender === user?.username
								? "text-gray-400"
								: "text-indigo-300"
						}`}
					>
						{message.sender} - {formatTime(message.time)}
					</span>
				</div>
			))}
		</div>
	);
};
