interface DbUser {
    id: number;
    username: string;
    password: string;
}

interface ChatMessage {
    id: number;
    conversation_id: string;
    user_id: number;
    message: string;
    timestamp: Date;
}

export {
    DbUser,
    ChatMessage
};