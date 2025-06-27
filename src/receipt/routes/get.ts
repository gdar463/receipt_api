import db from "@/db";
import { receipts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { ReceiptNotFoundError } from "@/receipt/errors";
import type { ReceiptDB } from "../types";
import { createComponentMap } from "../components/utils";

export async function getReceipt(
  userId: string,
  receiptId: string,
  map: number | undefined
) {
  const rows = await db
    .select()
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  if (rows.length == 0) {
    throw new ReceiptNotFoundError();
  }
  const receipt = rows[0] as ReceiptDB;
  if (map == undefined) {
    return receipt;
  }
  return {
    ...receipt,
    componentMap: createComponentMap(receipt.components),
  };
}
