import { useAuth } from "@/contextProviders/useAuthContext";
import { ChatMessageHistory } from "@/types";
import React from "react";

type MessageSectionProps = {
	messages: ChatMessageHistory[];
};

export const MessageSection: React.FC<MessageSectionProps> = ({ messages }) => {
	const { user } = useAuth();
	return (
		<div className="flex-1 p-4 space-y-4 overflow-y-auto">
			{messages.map((message) => (
				<div
					key={message.id}
					className={`max-w-md p-3 rounded-lg ${
						message.id !== user?.id ? "ml-auto bg-purple-900" : "bg-indigo-900"
					}`}
				>
					<p className="text-sm text-slate-300">{message.message}</p>
					<span
						className={`block mt-1 text-xs ${
							message.id === user?.id ? "text-gray-400" : "text-indigo-300"
						}`}
					>
						{message.sender} - {message.time}
					</span>
				</div>
			))}
		</div>
	);
};
