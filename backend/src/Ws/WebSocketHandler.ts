import { ServerWebSocket } from "bun";
import { ContextVariables, WebSocketData } from "../Types";
import { subscribeToConversations, wsMessageHandler } from ".";
import { serve, Server } from "bun";
import { Hono } from "hono";

export class WebSocketHandler {
    server: Server;
  
    constructor(private app: Hono<{ Variables: ContextVariables}>) {
       this.server = serve<WebSocketData>({
        fetch: this.fetch.bind(this),
        websocket: {
          message: this.message.bind(this),
          open: this.open.bind(this),
          close: this.close.bind(this),
          drain: this.drain.bind(this),
        },
        port: 3000,
      });
      console.log(`Server running on http://localhost:${this.server.port}`);
    }
  
    async fetch(req: Request, server: Server) {
      if (req.headers.get('upgrade') === 'websocket') {
        // const webSocketData = await getWebSocketDataFromCookies(req);
  
        //DEV
        const username = req.headers.get('username');
        const userId = req.headers.get('userId');
  
        const webSocketData = {
          username: username,
          userId: userId
        }
  
        if (username !== null) {
          server.upgrade(req, {
            data: {
              username: webSocketData.username,
              userId: webSocketData.userId
            }
          })
      } else {
        return new Response('WebSocket upgrade failed', { status: 500 })
      }
      } else {
        return this.app.fetch(req);
      }
    }
  
    async message(ws: ServerWebSocket<WebSocketData>, message: string | Buffer) {
      await wsMessageHandler(ws, this.server, message);
    }
  
    async open(ws: ServerWebSocket<WebSocketData>) {
      console.log('WebSocket opened for user', ws.data.username);
      await subscribeToConversations(ws.data.userId, ws);
    }
  
    close(ws: ServerWebSocket<WebSocketData>, code: number, message: string) {
      ws.close(code, message);
      console.log('WebSocket closed', code, message);
    }
  
    drain(ws: ServerWebSocket<WebSocketData>) {
    }
  }