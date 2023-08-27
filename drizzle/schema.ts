import { InferModel, InferModelFromColumns, relations, sql } from "drizzle-orm";
import { index, integer, real, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().unique(),
  userId: text("userId").notNull().unique(),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export type User = InferModel<typeof users>;
