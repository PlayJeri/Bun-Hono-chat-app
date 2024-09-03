export type ChatData = {
	chatName: string;
	id: string;
	latestMessage?: string | null;
};

export type ChatMessage = {
	message: string;
	id: number;
	time: string;
	sender: string | null;
};
