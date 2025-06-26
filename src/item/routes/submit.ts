import { type StatusFunc } from "elysia";
import { createFile } from "@/google/drive";
import { nanoid } from "nanoid";
import db from "@/db";
import { receipts } from "@/db/schema";
import { NameAlreadyExistsError } from "@/item/errors";
import { eq } from "drizzle-orm";

export async function submit(status: StatusFunc, userId: string, body: any) {
  const id = nanoid(32);
  const count = await db.$count(receipts, eq(receipts.name, body.name));
  if (count == 1) {
    throw new NameAlreadyExistsError();
  }
  const driveId = await createFile(
    {
      mime: "application/json",
      name: `${id}.json`,
      body: JSON.stringify(body),
    },
    userId,
  );
  await db.insert(receipts).values({
    id,
    name: body.name,
    driveId: driveId!,
    userId,
  });
  return status(200, { id });
}
