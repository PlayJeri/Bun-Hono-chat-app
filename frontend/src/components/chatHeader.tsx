import React from "react";

type ChatInformation = {
	chatName: string;
	members: string[];
};

type ChatHeaderProps = {
	chatInfo: ChatInformation | null;
};

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chatInfo }) => {
	return (
		<header className="flex items-center justify-between p-4 bg-gray-800 border-b border-gray-700">
			<div>
				<h2 className="text-xl font-semibold text-purple-300">
					{chatInfo?.chatName}
				</h2>
				<div className="flex items-center mt-1">
					<span className="mr-2 text-sm text-gray-400">Members:</span>
					<div className="flex space-x-2 overflow-hidden">
						{chatInfo?.members.map((member, index) => (
							<div
								key={member}
								className={`inline-block h-6 w-full px-2 rounded-full text-center text-xs leading-6 ${
									index % 2 === 0 ? "bg-indigo-500" : "bg-purple-500"
								}`}
							>
								{member}
							</div>
						))}
					</div>
				</div>
			</div>
			<button className="p-2 transition-colors rounded-full size-12 hover:bg-gray-700">
				<span className="text-2xl text-slate-300">⋮</span>
			</button>
		</header>
	);
};
