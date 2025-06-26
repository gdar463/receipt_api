import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const users = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => nanoid(32)),
  username: text().unique().notNull(),
  password: text().notNull(),
  googleInfo: text(),
  createdAt: integer()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  receipts: many(receipts),
}));

export const receipts = sqliteTable("receipts", {
  id: text().primaryKey(),
  name: text().notNull().unique(),
  driveId: text().notNull(),
  userId: text()
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
});

export const receiptsRelations = relations(receipts, ({ one }) => ({
  user: one(users, {
    fields: [receipts.userId],
    references: [users.id],
  }),
}));
