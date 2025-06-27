import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";
import type { ReceiptComponent } from "@/receipt/components/types";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
  googleInfo: text("google_info"),
  createdAt: integer({ mode: "timestamp" })
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  receipts: many(receipts),
}));

export const receipts = sqliteTable("receipts", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  createdAt: integer("created_at", { mode: "timestamp" })
    .default(new Date(0))
    .notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp" })
    .default(new Date(0))
    .notNull(),
  components: text("components", { mode: "json" })
    .$type<ReceiptComponent[]>()
    .default([])
    .notNull(),
});

export const receiptsRelations = relations(receipts, ({ one }) => ({
  user: one(users, {
    fields: [receipts.userId],
    references: [users.id],
  }),
}));
