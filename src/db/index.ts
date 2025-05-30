import { drizzle } from "drizzle-orm/libsql/node";

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

export default db;
