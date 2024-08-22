import { sql } from "drizzle-orm";
import {
	text,
	integer,
	sqliteTable,
	primaryKey,
} from "drizzle-orm/sqlite-core";

const user = sqliteTable("user", {
	id: integer("id").unique().primaryKey(),
	username: text("username").notNull().unique(),
	password: text("password").notNull(),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

const contact = sqliteTable(
	"contact",
	{
		userId: integer("user_id")
			.notNull()
			.references(() => user.id),
		friendId: integer("friend_id")
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.userId, table.friendId] }),
		};
	}
);

const conversation = sqliteTable("conversation", {
	id: text("id").primaryKey(),
	chatName: text("name").notNull(),
});

const conversationMember = sqliteTable(
	"conversation_members",
	{
		conversationId: text("conversation_id")
			.notNull()
			.references(() => conversation.id),
		userId: integer("user_id")
			.notNull()
			.references(() => user.id),
	},
	(table) => {
		return {
			pk: primaryKey({ columns: [table.conversationId, table.userId] }),
		};
	}
);

const message = sqliteTable("message", {
	id: integer("id").primaryKey(),
	conversationId: text("conversation_id")
		.notNull()
		.references(() => conversation.id),
	userId: integer("user_id")
		.notNull()
		.references(() => user.id),
	message: text("message").notNull(),
	createdAt: text("created_at")
		.notNull()
		.default(sql`(current_timestamp)`),
});

export { user, message, contact, conversation, conversationMember };
