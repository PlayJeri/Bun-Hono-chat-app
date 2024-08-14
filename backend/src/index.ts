import { Hono } from "hono";
import { auth } from "./Routes/auth";
import { checkAccessToken } from "./Middleware/accessToken";
import { ContextVariables } from "./Types";
import { friends } from "./Routes/friends";
import { cors } from "hono/cors";
import { WebSocketHandler } from "./Ws/WebSocketHandler";
import { chat } from "./Routes/chat";

const app = new Hono<{ Variables: ContextVariables }>();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/auth", auth);
app.route("/friends", friends);
app.route("/chat", chat);

app.get("/protected", checkAccessToken, async (c) => {
  console.log("Protected route");
  const decodedPayload = c.get("decodedPayload");
  return c.json({
    message: `Hello ${decodedPayload.username} id: ${decodedPayload.id}`,
  });
});

new WebSocketHandler(app);
