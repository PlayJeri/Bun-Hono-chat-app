import { hc } from "hono/client";
import { ApiRoutes } from "@backend/src/index";

const client = hc<ApiRoutes>("http://localhost:3000");

const auth = client.auth;

const res = await client.friend_id;
