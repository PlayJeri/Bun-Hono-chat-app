import { Context, Next } from "hono";
import { getSignedCookie } from "hono/cookie";
import { verify } from "hono/jwt";

const secretKey = process.env.TOKEN_SECRET || "secret";
const environment = process.env.ENV;

async function checkAccessToken(c: Context, next: Next) {
  try {
    if (c.req.header("upgrade") && environment === "dev") {
      const username = c.req.header("username");
      const userId = c.req.header("userId");
      c.set("decodedPayload", { username, id: userId });
      return next();
    }
    console.log("Checking access token");
    const accessToken = await getSignedCookie(c, secretKey, "access_token");
    console.log("token is: ", accessToken);
    if (!accessToken) {
      console.log("No access token");
      return c.json({ message: "Unauthorized" });
    }

    const decodedPayload = await verify(accessToken, secretKey);

    c.set("decodedPayload", decodedPayload);
    return next();
  } catch {
    return c.json({ message: "Unauthorized" });
  }
}

export { checkAccessToken };
