import { Hono } from "hono";
import { auth } from "./Routes/auth";
import { checkAccessToken } from "./Middleware/accessToken";
import { ContextVariables, DecodedPayload } from "./Types";
import { friends } from "./Routes/friends";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { WebSocketHandler } from "./Ws/WebSocketHandler";
import { chat } from "./Routes/chat";

import { createBunWebSocket } from "hono/bun";
import { ws } from "./Routes/ws";

import { websocket } from "./Routes/ws";

const app = new Hono<{ Variables: ContextVariables }>();

app.use(logger());

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
  return c.text("Hello");
});

app.route("/auth", auth);
app.route("/friends", friends);
app.route("/chat", chat);

app.route("/ws", ws);

app.get("/protected", checkAccessToken, async (c) => {
  console.log("Protected route");
  const { username, id }: DecodedPayload = c.get("decodedPayload");
  console.log(c.get("jwtPayload"));
  return c.json({
    message: `Hello ${username} id: ${id}`,
  });
});

Bun.serve({
  fetch: app.fetch,
  websocket,
});

// new WebSocketHandler(app);
