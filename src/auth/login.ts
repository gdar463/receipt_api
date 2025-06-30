import { eq } from "drizzle-orm";
import type { StatusFunc } from "elysia";

import db from "@/db";
import { users } from "@/db/schema";

import { createSession } from "./jwt";

export async function login(
  body: { username: string; password: string },
  status: StatusFunc,
) {
  const user = await db
    .select({ hash: users.password, id: users.id })
    .from(users)
    .where(eq(users.username, users.username));
  if (user.length == 0) {
    return status(401, {
      error: "Invalid username or password",
      code: "InvalidCreds",
    });
  }
  const correct = await Bun.password.verify(body.password, user[0].hash);
  if (!correct) {
    return status(401, {
      error: "Invalid username or password",
      code: "InvalidCreds",
    });
  }
  const jwt = await createSession(user[0].id);
  return status(200, { token: jwt });
}
