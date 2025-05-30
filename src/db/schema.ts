import { v4 } from "uuid";
import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

export const users = sqliteTable("users", {
  id: text()
    .primaryKey()
    .$defaultFn(() => v4()),
  username: text().unique().notNull(),
  password: text().notNull(),
  googleInfo: text(),
  createdAt: integer()
    .default(sql`(CURRENT_TIMESTAMP)`)
    .notNull(),
});
