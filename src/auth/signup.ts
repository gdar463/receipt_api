import type { StatusFunc } from "elysia";

import db from "@/db";
import { users } from "@/db/schema";

import { createSession } from "./jwt";

export async function signup(
  body: { username: string; password: string },
  status: StatusFunc,
) {
  const ids = await db
    .insert(users)
    .values({
      username: body.username,
      password: await Bun.password.hash(body.password),
    })
    .onConflictDoNothing({ target: users.username })
    .returning({ id: users.id });
  if (ids.length == 0) {
    return status(409, {
      error: "Username already exists",
      code: "UsernameAlreadyExists",
    });
  }
  const id = ids[0].id;
  const jwt = await createSession(id);
  return status(200, { token: jwt });
}
