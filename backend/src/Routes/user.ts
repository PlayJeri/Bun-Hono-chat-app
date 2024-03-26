import { db } from '../db/database';
import { Hono } from 'hono';
import { ContextVariables } from '../Types';
import { checkAccessToken } from '../Middleware/accessToken';
import { zValidator } from '@hono/zod-validator';
import { ChangePasswordSchema } from '../ValidationModels/ChangePassword';
import { DbUser } from '../db/types';

const user = new Hono<{ Variables: ContextVariables }>();

user.use(checkAccessToken);


user.post(
    '/change-password',
    zValidator(
        'json', 
        ChangePasswordSchema
    ), 
    async (c) => {
        try {
            const { currentPassword, newPassword } = c.req.valid('json');
            const userId = c.get('decodedPayload').id;

            const query = db.query("SELECT password FROM users WHERE id = $id;");
            const user = query.get(userId) as DbUser | null;

            if (!user) {
                return c.json({ message: "User not found" }, 400);
            }

            const isMatch = await Bun.password.verify(currentPassword, user.password);

            if (!isMatch) {
                return c.json({ message: "Incorrect password" }, 400);
            }

            const hashedPassword = await Bun.password.hash(newPassword);

            const update = db.query("UPDATE users SET password = $password WHERE id = $id;");
            update.run(hashedPassword, userId);

            return c.json({ message: "Password changed" });
        } catch (error) {
            console.error(error);
            return c.json({ message: "Internal Server Error" }, 500);
        }
});
