import { drizzle } from "drizzle-orm/libsql/node";
import { customType } from "drizzle-orm/sqlite-core";

if (!process.env.DATABASE_URL) {
  console.error("no DATABASE_URL");
  process.exit(1);
}

const db = drizzle({
  connection: {
    url: process.env.DATABASE_URL,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  },
});

export const customTimestamp = customType<{ data: Date; driverData: number }>({
  dataType() {
    return "integer";
  },
  toDriver(value: Date) {
    return value.getTime();
  },
});

export default db;
