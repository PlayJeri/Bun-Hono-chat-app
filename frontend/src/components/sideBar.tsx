import { useAuth } from "@/contextProviders/useAuthContext";
import { getConversations } from "@/lib/app";
import { useEffect, useState } from "react";

type Conversation = {
	id: string;
	name: string;
	latestMessage: string;
	time: string;
	unread: number;
};

type ChatData = {
	chatName: string;
	id: string;
	latestMessage: string | null;
};

export const SideBar = () => {
	const [searchTerm, setSearchTerm] = useState("");
	const [chats, setChats] = useState<ChatData[]>([]);
	const { isLoggedIn } = useAuth();

	async function getData() {
		const res = await getConversations();
		console.log(res);
		setChats(res);
	}

	useEffect(() => {
		if (isLoggedIn) {
			getData();
		}
	}, [isLoggedIn]);

	// FOR TESTING
	const filteredChats = chats.filter((chat) =>
		chat.chatName.toLowerCase().includes(searchTerm.toLowerCase())
	);

	return (
		<div className="flex flex-col w-64 h-screen text-gray-100 bg-gray-900">
			<div className="px-2 my-4">
				<input
					type="text"
					placeholder="🔍 Search conversations"
					className="w-full p-2 text-gray-100 placeholder-gray-500 truncate bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:border-indigo-500"
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
				/>
			</div>
			<div className="flex-1 px-2 overflow-y-auto">
				{filteredChats.map((conversation) => (
					<button
						key={conversation.id}
						// className={`w-full text-left mb-1 p-2 rounded-lg hover:bg-gray-800 transition-colors ${
						// 	conversation.unread > 0 ? "bg-gray-800" : ""
						// }`}
					>
						<div className="flex items-center justify-between overflow-hidden">
							<span className="pr-2 font-semibold truncate">
								{conversation.chatName}
							</span>
							{/* <span className="text-xs text-gray-500">{conversation.time}</span> */}
						</div>
						<div className="flex items-center justify-between mt-1">
							<span className="text-sm text-gray-400 truncate">
								{conversation.latestMessage}
							</span>
							{/* {conversation.unread > 0 && (
								<span className="flex items-center justify-center w-5 h-5 text-xs text-white bg-purple-600 rounded-full">
									{conversation.unread}
								</span>
							)} */}
						</div>
					</button>
				))}
			</div>
			<div className="p-4 border-t border-gray-800">
				<button className="flex items-center w-full text-gray-400 transition-colors hover:text-gray-100">
					<span className="mr-2">⚙️</span>
					<span>Settings</span>
					<span className="ml-auto">⋮</span>
				</button>
			</div>
			<div className="p-4 border-t border-gray-800">
				<button className="flex items-center justify-center w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
					<span className="mr-2">+</span> New Chat
				</button>
			</div>
		</div>
	);
};
