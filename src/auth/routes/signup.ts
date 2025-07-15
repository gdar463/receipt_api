import type { StatusFunc } from "elysia";

import db from "@/db";
import { users } from "@/db/schema";

import { UserAlreadyExistsError } from "../errors";
import { createSession } from "../jwt";
import type { SignupBody } from "../types";

export async function signup(body: SignupBody, status: StatusFunc) {
  const ids = await db
    .insert(users)
    .values({
      username: body.username,
      password: await Bun.password.hash(body.password),
      displayName: body.displayName,
      email: body.email,
    })
    .onConflictDoNothing({ target: users.username })
    .onConflictDoNothing({ target: users.email })
    .returning({
      id: users.id,
      createdAt: users.createdAt,
    });
  if (ids.length == 0) {
    throw new UserAlreadyExistsError();
  }
  const id = ids[0].id;
  const jwt = await createSession(id);
  return status(200, {
    id,
    username: body.username,
    displayName: body.displayName,
    email: body.email,
    createdAt: ids[0].createdAt.getTime(),
    token: jwt,
  });
}
