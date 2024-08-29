import { Hono } from "hono";
import { auth } from "./Routes/auth";
import { checkAccessToken } from "./Middleware/accessToken";
import { ContextVariables, DecodedPayload, WebSocketData } from "./Types";
import { friends } from "./Routes/friends";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { chat } from "./Routes/chat";
import { prettyJSON } from "hono/pretty-json";
import { websocket } from "./Ws/ws";
import { handleWsUpgrade } from "./Ws/upgradeHandler";

const app = new Hono<{ Variables: ContextVariables }>();

app.use(logger());
app.use(prettyJSON());

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(async (c, next) => {
	console.log("middleware enter");
	const start = Date.now();
	await next();
	const end = Date.now();
	console.log(`middleware end. It took ${end - start} ms`);
});

app.get("/", async (c) => {
	return c.json(c.req);
});

const routes = app
	.route("/auth", auth)
	.route("/friends", friends)
	.route("/chat", chat);

app.get("/protected", checkAccessToken, async (c) => {
	console.log("Protected route");
	const { username, id }: DecodedPayload = c.get("decodedPayload");
	console.log(c.get("jwtPayload"));
	return c.json({
		message: `Hello ${username} id: ${id}`,
	});
});

const server = Bun.serve<WebSocketData>({
	fetch: async (req, server) => {
		if (req.headers.get("upgrade") === "websocket") {
			await handleWsUpgrade(req, server);
		} else {
			return app.fetch(req);
		}
	},
	websocket: websocket,
});

export { server };
export type AppRoutes = typeof routes;
