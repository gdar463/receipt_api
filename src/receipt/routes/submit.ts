import { type StatusFunc } from "elysia";
import { nanoid } from "nanoid";
import db from "@/db";
import { receipts } from "@/db/schema";
import { NameAlreadyExistsError } from "@/receipt/errors";
import { eq } from "drizzle-orm";
import type { Receipt } from "../types";

export async function submit(
  status: StatusFunc,
  userId: string,
  body: Receipt
) {
  const id = nanoid(32);
  const count = await db.$count(receipts, eq(receipts.name, body.name));
  if (count == 1) {
    throw new NameAlreadyExistsError();
  }
  await db.insert(receipts).values({
    id,
    name: body.name,
    userId,
    components: body.components,
    createdAt: new Date(Date.now()),
    updatedAt: new Date(Date.now()),
  });
  return status(200, { id });
}
