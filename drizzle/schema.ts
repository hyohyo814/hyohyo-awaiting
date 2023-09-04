import { InferModel, sql } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().unique(),
  userId: text("userId").notNull().unique(),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export type User = InferModel<typeof users>;

export const codes = sqliteTable("codes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content"),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export type Code = InferModel<typeof codes>;
