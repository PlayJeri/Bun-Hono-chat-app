import { hc } from "hono/client";
import { AppRoutes } from "@backend/src/index";

const client = hc<AppRoutes>("http://localhost:3000", {
	fetch: (req: RequestInfo | URL, init?: RequestInit) =>
		fetch(req, {
			...init,
			credentials: "include",
		}),
});

export async function logInUser(username: string, password: string) {
	const res = await client.auth.login.$post({ json: { username, password } });
	if (res.status === 200) {
		return await res.json();
	} else {
		console.log(res);
		throw Error("Invalid shit");
	}
}

export async function getConversations() {
	const res = await client.chat.all.$get();
	if (res.status === 200) {
		return await res.json();
	} else {
		console.error(res);
		throw Error("Get conversation failed");
	}
}

export async function getChatMembers(chatId: string) {
	const res = await client.chat.members.$get({ query: { chatId: chatId } });
	if (res.status !== 200) throw Error("Get chat members error");
	return await res.json();
}

export async function getChatHistory(chatId: string) {
	const res = await client.chat.history.$get({
		query: { conversationId: chatId },
	});
	if (res.status !== 200) throw Error("Get chat history error");
	return await res.json();
}
