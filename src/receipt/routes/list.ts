import { eq } from "drizzle-orm";

import db from "@/db";
import { receipts } from "@/db/schema";

export async function listReceipts(userId: string) {
  const list = await db
    .select({
      id: receipts.id,
      name: receipts.name,
      createdAt: receipts.createdAt,
      updatedAt: receipts.updatedAt,
    })
    .from(receipts)
    .where(eq(receipts.userId, userId));
  return list;
}
