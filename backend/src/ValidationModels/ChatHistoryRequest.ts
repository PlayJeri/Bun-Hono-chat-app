import { z } from "zod";

const ChatHistoryReqSchema = z.object({
  conversationId: z.string().min(10).max(50),
  limit: z.number().default(10),
  offset: z.number().default(0),
});

export { ChatHistoryReqSchema };
