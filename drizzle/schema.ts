import { InferModel, sql, relations } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: text("id").primaryKey().unique(),
  userId: text("userId").notNull().unique(),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export const usersRelations = relations(users, ({ many }) => ({
  records: many(records),
}));

export type User = InferModel<typeof users>;

export const codes = sqliteTable("codes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content"),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export type Code = InferModel<typeof codes>;

export const records = sqliteTable("records", {
  userId: text("userId"),
  time: integer("time"),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export const recordsRelations = relations(records, ({ one }) => ({
  user: one(users, {
    fields: [records.userId],
    references: [users.id],
  }),
}));
