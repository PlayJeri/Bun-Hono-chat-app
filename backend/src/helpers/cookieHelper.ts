import { verify } from "hono/jwt";
import { DecodedPayload, WebSocketData } from "../Types";

const secretKey = process.env.TOKEN_SECRET || "secret_key";

async function getWebSocketDataFromCookies(req: Request): Promise<WebSocketData> {
    try {
        const cookies = req.headers.get('cookie');
        if (!cookies) throw new Error('No cookies');
        
        let token = cookies
            .split(';')
            .map(cookie => cookie.split('='))
            .find(cookie => cookie[0]
            .trim() === 'access_token')?.[1];
    
        if (!token) throw new Error('No token');   
    
        token = token.split('.').slice(0, 3).join('.');
        const decodedPayload: DecodedPayload = await verify(token, secretKey);

        const result: WebSocketData = {
            username: decodedPayload.username,
            userId: decodedPayload.id,
            authToken: token
        }

        return result;
        
    } catch (error) {
        console.error('getWebSocketDataFromCookies error', error);
        throw new Error('Invalid token');
    }
}

export { getWebSocketDataFromCookies };
