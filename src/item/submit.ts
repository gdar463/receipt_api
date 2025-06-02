import { type StatusFunc } from "elysia";
import { createFile } from "@/google/drive";
import { v4 } from "uuid";
import db from "@/db";
import { receipts } from "@/db/schema";
import type { StaticItemBody } from ".";

export async function submit(
  status: StatusFunc,
  userId: string,
  body: StaticItemBody,
) {
  const id = v4();
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
