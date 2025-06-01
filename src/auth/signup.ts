import db from "@/db";
import { users } from "@/db/schema";
import type { Cookie, StatusFunc } from "elysia";
import { createSession } from "./jwt";

export async function signup(
  body: { username: string; password: string },
  session: Cookie<string | undefined>,
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
    return status(409, { error: "Username already exists" });
  }
  const id = ids[0].id;
  const jwt = await createSession(id);
  session.set({
    value: jwt,
    path: "/",
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7),
  });
  return status(200);
}
