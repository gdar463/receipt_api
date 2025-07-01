import { and, eq, exists } from "drizzle-orm";
import type { StatusFunc } from "elysia";

import db from "@/db";
import { receipts } from "@/db/schema";

import { FailedDeletionError } from "../errors";

export async function deleteReceipt(
  status: StatusFunc,
  userId: string,
  receiptId: string,
) {
  if (
    await db.$count(
      receipts,
      exists(
        db
          .select()
          .from(receipts)
          .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId))),
      ),
    )
  ) {
    throw new FailedDeletionError();
  }
  await db
    .delete(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  return status(204);
}
