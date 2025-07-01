import { eq } from "drizzle-orm";

import db from "@/db";
import { users } from "@/db/schema";

import { UserDoesntExistError } from "../errors";

export async function me(userId: string) {
  const user = await db
    .select({
      id: users.id,
      username: users.username,
      email: users.email,
      displayName: users.displayName,
    })
    .from(users)
    .where(eq(users.id, userId));
  if (user.length === 0) {
    throw new UserDoesntExistError();
  }
  return user[0];
}
