import { Hono } from "hono";
import { createBunWebSocket } from "hono/bun";
import { getWebSocketDataFromCookies } from "../helpers/cookieHelper";
import { checkAccessToken } from "../Middleware/accessToken";
import { getSignedCookie } from "hono/cookie";
import { createWSMessageEvent, WSContext, WSMessageReceive } from "hono/ws";
import { ContextVariables, DecodedPayload, WebSocketMsg } from "../Types";

const { upgradeWebSocket, websocket } = createBunWebSocket();

const ws = new Hono<{ Variables: ContextVariables }>();
const environment = process.env.ENV;

ws.get(
  "/",
  checkAccessToken,
  upgradeWebSocket((c) => {
    return {
      onMessage(event, ws) {
        // const { username }: DecodedPayload = c.get("decodedPayload");

        wsMessageHandler(event, ws);
      },
      onClose: () => {
        console.log("Connection closed");
      },
    };
  })
);

function wsMessageHandler(
  message: MessageEvent<WSMessageReceive>,
  ws: WSContext
) {
  if (typeof message.data === "string") {
    const msg: WebSocketMsg = JSON.parse(message.data);

    switch (msg.type) {
      case "message":
        console.log(msg.payload);
        ws.send(JSON.stringify(msg.payload));
        return;
    }
  }
}

export { ws, websocket };
