import db from "@/db";
import { receipts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { StatusFunc } from "elysia";

export async function deleteReceipt(
  status: StatusFunc,
  userId: string,
  receiptId: string
) {
  const rows = await db
    .delete(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  if (rows.rowsAffected == 0) {
    return status(500);
  }
  return status(204);
}
