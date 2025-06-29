import { and, eq } from "drizzle-orm";

import db from "@/db";
import { receipts } from "@/db/schema";

import { ReceiptNotFoundError } from "../errors";

import type { ComponentType, ReceiptComponent } from "./types";

export function createComponentMap(
  components: ReceiptComponent[],
): Partial<{ [K in ComponentType]: ReceiptComponent<K> & { index: number } }> {
  return Object.fromEntries(
    components.map((c, i) => [c.type, { ...c, index: i }]),
  );
}

export async function getComps(receiptId: string, userId: string) {
  const rows = await db
    .select({ components: receipts.components })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  if (rows.length === 0) {
    throw new ReceiptNotFoundError();
  }
  const comps = rows[0].components;
  const compMap = createComponentMap(comps);
  return { comps, compMap };
}
