import db from "@/db";
import { receipts } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function listReceipts(userId: string) {
  const list = await db
    .select({ id: receipts.id, name: receipts.name })
    .from(receipts)
    .where(eq(receipts.userId, userId));
  return list;
}
