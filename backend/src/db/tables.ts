import { db } from "./database";

db.run(`
    CREATE TABLE IF NOT EXISTS users
    (
        id INTEGER PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL
    )
`)

db.run(`
    CREATE TABLE IF NOT EXISTS friends
    (
        user_id INTEGER NOT NULL,
        friend_id INTEGER NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (friend_id) REFERENCES users(id),
        PRIMARY KEY (user_id, friend_id)
    )
`)

db.run(`
    CREATE TABLE IF NOT EXISTS conversations
    (
        id TEXT PRIMARY KEY,
        user1_id INTEGER NOT NULL,
        user2_id INTEGER NOT NULL,
        FOREIGN KEY (user1_id) REFERENCES users(id),
        FOREIGN KEY (user2_id) REFERENCES users(id)
    )
`)

db.run(`
    CREATE TABLE IF NOT EXISTS messages
    (
        id INTEGER PRIMARY KEY,
        conversation_id TEXT NOT NULL,
        user_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        FOREIGN KEY (conversation_id) REFERENCES conversations(id),
        FOREIGN KEY (user_id) REFERENCES users(id)
    )
`)