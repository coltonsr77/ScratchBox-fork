import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

export const projects = sqliteTable("projects", {
  id: text("id").notNull().primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  createdAt: integer("created_at", { mode: "timestamp" }).notNull(),
  private: integer("private", { mode: "boolean" }).notNull(),
  user: text("user").notNull(),
});

export const projectLikes = sqliteTable("project_likes", {
  projectId: text("project_id").notNull().references(() => projects.id),
  user: text("user").notNull(),
}, (t) => [
  primaryKey({ columns: [t.projectId, t.user] }),
]);
