import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import * as schema from "../database/schema";

const sqlite = new Database(process.env.DB_URL || "sqlite.db");
export const db = drizzle(sqlite, { schema });

process.on("SIGINT", () => {
  sqlite.close();
  process.exit();
});
