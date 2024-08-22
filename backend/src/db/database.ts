import { drizzle } from "drizzle-orm/bun-sqlite";
import { Database } from "bun:sqlite";

const sqlite = new Database("chat.db");
const db = drizzle(sqlite);

export { db };
