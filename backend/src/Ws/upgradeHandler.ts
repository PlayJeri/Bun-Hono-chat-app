import { Server } from "bun";
import { getWebSocketDataFromCookies } from "../helpers/cookieHelper";

const environment = process.env.ENV;

export async function handleWsUpgrade(req: Request, server: Server) {
	let name: string;
	let id: number;

	if (environment == "dev") {
		const username = req.headers.get("username");
		const userId = req.headers.get("userId");

		if (!username || !userId) {
			return new Response("missing user info", { status: 400 });
		}

		name = username;
		id = parseInt(userId);
	} else {
		const { username, userId } = await getWebSocketDataFromCookies(req);
		if (!username || !userId)
			return new Response("missing user info", { status: 400 });
		name = username;
		id = userId;
	}

	if (name !== null) {
		server.upgrade(req, {
			data: {
				username: name,
				userId: id,
			},
		});
	} else {
		console.error("WS upgrade failed");
		return new Response("WebSocket upgrade failed", { status: 500 });
	}
}
