import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { RegisterSchema } from "../ValidationModels/Register";
import { db } from "../db/database";
import { DbUser } from "../db/types";
import { setCookie, setSignedCookie } from "hono/cookie";
import { sign } from "hono/jwt";
import { DecodedPayload } from "../Types";
import { validator } from "hono/validator";
import { user } from "../db/schema";
import { eq, sql } from "drizzle-orm";

const secretKey = process.env.TOKEN_SECRET || "secret";

const auth = new Hono()
	.post(
		"/register",
		validator("json", async (value, c) => {
			try {
				const parsed = RegisterSchema.safeParse(value);
				if (!parsed.success) {
					return c.status(400);
				}

				const { username, password } = parsed.data;

				const users = await db
					.select()
					.from(user)
					.where(eq(user.username, username));

				if (users.length !== 0) {
					return c.json({ message: "Username already exists" }, 400);
				}

				const hashedPassword = await Bun.password.hash(password);

				await db
					.insert(user)
					.values({ username: username, password: hashedPassword });

				return c.json({ message: `Registered! ${username}` }, 201);
			} catch (error) {
				return c.text("Internal Server Error", 500);
			}
		})
	)

	.post("/login", async (c) => {
		try {
			const { username, password } = await c.req.json();
			console.log(username, password);
			if (!username || !password) {
				return c.json({ message: "Missing username or password" }, 400);
			}

			const users = await db
				.select()
				.from(user)
				.where(eq(sql`lower(${user.username})`, username.toLowerCase()));

			if (users.length === 0) {
				return c.json({ message: "Invalid username or password" }, 400);
			}

			const dbUser = users[0];

			const validPassword = await Bun.password.verify(
				password,
				dbUser.password
			);
			if (!validPassword) {
				return c.json({ message: "Invalid username or password" }, 400);
			}

			const payload: DecodedPayload = {
				id: dbUser.id,
				username: dbUser.username,
			};

			const token = await sign(payload, secretKey);

			await setSignedCookie(c, "access_token", token, secretKey, {
				path: "/",
				domain: "localhost",
				secure: true,
				httpOnly: true,
				sameSite: "Strict",
				maxAge: 60 * 60 * 24,
				expires: new Date(Date.now() + 60 * 60 * 24 * 1000),
			});

			await setCookie(c, "username", dbUser.username);

			return c.json({ username: dbUser.username, id: dbUser.id }, 200);
		} catch (error) {
			console.log(error);
			return c.text("Internal Server Error", 500);
		}
	});

export { auth };
