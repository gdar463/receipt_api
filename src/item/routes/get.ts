import db from "@/db";
import { receipts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ReceiptNotFoundError } from "@/item/errors";
import { getFileByID } from "@/google/drive";

export async function getReceipt(userId: string, receiptId: string) {
  const rows = await db
    .select({ driveId: receipts.driveId })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  if (rows.length == 0) {
    throw new ReceiptNotFoundError();
  }
  const receipt = await getFileByID(rows[0].driveId, userId);
  return {
    id: receiptId,
    data: receipt,
  };
}
