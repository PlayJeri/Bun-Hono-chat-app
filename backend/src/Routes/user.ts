import { db } from "../db/database";
import { Hono } from "hono";
import { ContextVariables } from "../Types";
import { checkAccessToken } from "../Middleware/accessToken";
import { validator } from "hono/validator";
import { ChangePasswordSchema } from "../ValidationModels/ChangePassword";
import { user as userTable } from "../db/schema";
import { eq } from "drizzle-orm";

const user = new Hono<{ Variables: ContextVariables }>()
.use(checkAccessToken)

.post(
	"/change-password",
	validator("json", async (value, c) => {
		try {
			const parsed = ChangePasswordSchema.safeParse(value);
			if (!parsed.success) {
				return c.text("Invalid!", 401);
			}
			const { currentPassword, newPassword } = parsed.data;
			const userId = c.get("decodedPayload").id;

			const users = await db
				.select()
				.from(userTable)
				.where(eq(userTable.id, userId));

			if (users.length === 0) {
				return c.json({ message: "User not found" }, 400);
			}

			const dbUser = users[0];

			const isMatch = await Bun.password.verify(
				currentPassword,
				dbUser.password
			);

			if (!isMatch) {
				return c.json({ message: "Incorrect password" }, 400);
			}

			const hashedPassword = await Bun.password.hash(newPassword);

			await db
				.update(userTable)
				.set({ password: hashedPassword })
				.where(eq(userTable.id, userId));

			return c.json({ message: "Password changed" });
		} catch (error) {
			console.error(error);
			return c.json({ message: "Internal Server Error" }, 500);
		}
	})
);

export { user };
