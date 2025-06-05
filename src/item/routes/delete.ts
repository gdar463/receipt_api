import db from "@/db";
import { receipts } from "@/db/schema";
import { deleteFile } from "@/google/drive";
import { and, eq } from "drizzle-orm";
import type { StatusFunc } from "elysia";

export async function deleteReceipt(
  status: StatusFunc,
  userId: string,
  receiptId: string,
) {
  const rows = await db
    .delete(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)))
    .returning({ driveId: receipts.driveId });
  if (rows.length == 0) {
    return status(500);
  }
  await deleteFile(rows[0].driveId, userId);
  return status(200);
}
