import { Context, Next } from 'hono';
import { getSignedCookie } from 'hono/cookie';
import { verify } from 'hono/jwt';

const secretKey = process.env.TOKEN_SECRET || 'secret';

async function checkAccessToken(c: Context, next: Next) {
    try {
        console.log('Checking access token');
        const accessToken = await getSignedCookie(c, secretKey, 'access_token');
        console.log('token is: ', accessToken);
        if (!accessToken) {
            console.log('No access token')
            return c.json({message: "Unauthorized"});
        }

        const decodedPayload = await verify(accessToken, secretKey);

        c.set('decodedPayload', decodedPayload);
        return next();
    } catch {
        return c.json({message: "Unauthorized"});
    }
}

export { checkAccessToken };
