import { Database } from "bun:sqlite";

const db = new Database("chat.db");

export { db };
