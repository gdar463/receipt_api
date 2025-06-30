import { and, eq } from "drizzle-orm";
import type { StatusFunc } from "elysia";

import db from "@/db";
import { receipts } from "@/db/schema";

export async function deleteReceipt(
  status: StatusFunc,
  userId: string,
  receiptId: string,
) {
  await db
    .delete(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  return status(204);
}
