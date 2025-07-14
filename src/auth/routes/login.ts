import { eq } from "drizzle-orm";
import type { StatusFunc } from "elysia";

import db from "@/db";
import { users } from "@/db/schema";

import { InvalidCredsError } from "../errors";
import { createSession } from "../jwt";

export async function login(
  body: { username: string; password: string },
  status: StatusFunc,
) {
  const user = await db
    .select({
      hash: users.password,
      id: users.id,
      username: users.username,
      displayName: users.displayName,
      email: users.email,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.username, body.username));
  if (user.length == 0) {
    throw new InvalidCredsError();
  }
  const correct = await Bun.password.verify(body.password, user[0].hash);
  if (!correct) {
    throw new InvalidCredsError();
  }
  const jwt = await createSession(user[0].id);
  return status(200, {
    id: user[0].id,
    username: user[0].username,
    displayName: user[0].displayName,
    email: user[0].email,
    createdAt: user[0].createdAt,
    token: jwt,
  });
}
