import db from "@/db";
import { receipts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ReceiptNotFoundError } from "@/item/errors";
import type { ReceiptDB } from "../types";

export async function getReceipt(userId: string, receiptId: string) {
  const rows = await db
    .select()
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  if (rows.length == 0) {
    throw new ReceiptNotFoundError();
  }
  const receipt = rows[0] as Omit<ReceiptDB, "componentMap">;
  return receipt;
}
