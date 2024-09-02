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
	console.log(res.body);
	if (res.status === 200) {
		return await res.json();
	} else {
		console.log(res);
		throw Error("Invalid shit");
	}
}

export async function getConversations() {
	const res = await client.chat.all.$get();
	console.log(res.body);
	if (res.status === 200) {
		return await res.json();
	} else {
		console.error(res);
		throw Error("Get conversation failed");
	}
}
