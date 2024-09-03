export type ChatData = {
	chatName: string;
	id: string;
	latestMessage?: string | null;
};

export type ChatMessageHistory = {
	message: string;
	id: number;
	time: string;
	sender: string | null;
};
