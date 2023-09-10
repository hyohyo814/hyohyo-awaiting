import { sql, relations, InferSelectModel, InferInsertModel } from "drizzle-orm";
import { integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  userId: text("userId").primaryKey().notNull().unique(),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export const usersRelations = relations(users, ({ many }) => ({
  records: many(records),
}));

export type SelectUser = InferSelectModel<typeof users>;
export type InsertUser = InferInsertModel<typeof users>;

export const codes = sqliteTable("codes", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  content: text("content"),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
  updatedAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export type SelectCode = InferSelectModel<typeof codes>;
export type InsertCode = InferInsertModel<typeof codes>;

export const records = sqliteTable("records", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  codeId: integer("codeId").notNull(),
  userId: text("userId").notNull(),
  time: integer("time"),
  createdAt: integer("created_at").default(sql`(cast (unixepoch () as int))`),
})

export const codesRelations = relations(codes, ({ many }) => ({
  records: many(records),
})); 

export const recordsRelations = relations(records, ({ one }) => ({
  user: one(users, {
    fields: [records.userId],
    references: [users.userId],
  }),
  code: one(codes, {
    fields: [records.codeId],
    references: [codes.id]
  })
}));

export type SelectRecord = InferSelectModel<typeof records>;
export type InsertRecord = InferInsertModel<typeof records>;
