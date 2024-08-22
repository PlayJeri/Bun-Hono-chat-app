import { ServerWebSocket } from "bun";
import { WebSocketData } from "../Types";

export const currentUsersMap = new Map<
	number, // user ID as the key
	{ username: string; id: number; ws: ServerWebSocket<WebSocketData> }
>();
