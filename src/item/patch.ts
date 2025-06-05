import db from "@/db";
import { receipts } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import type { StaticPartialItemBody } from "./types";
import {
  NameAlreadyExistsError,
  PatchBodyNotFoundError,
  ReceiptNotFoundError,
} from "./errors";
import { getFileByID, updateFile } from "@/google/drive";
import type { StaticSingleComponent } from "./components";
import { deepMerge } from "./util";

export async function patchReceipt(
  userId: string,
  receiptId: string,
  body: StaticPartialItemBody,
) {
  if (!body.name && !body.components) {
    throw new PatchBodyNotFoundError();
  }
  if (body.name) {
    try {
      await db
        .update(receipts)
        .set({ name: body.name })
        .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
    } catch (e) {
      if (
        e instanceof Error &&
        e.message.includes("UNIQUE constraint failed")
      ) {
        throw new NameAlreadyExistsError();
      }
    }
  }
  const rows = await db
    .select({ driveId: receipts.driveId })
    .from(receipts)
    .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)));
  if (rows.length == 0) {
    throw new ReceiptNotFoundError();
  }
  const receipt = await getFileByID(rows[0].driveId, userId);
  const nameUpdated = body.name ? { ...receipt, name: body.name } : receipt;
  console.log(body.components);
  if (body.components) {
    if (body.components.length != 0) {
      const avalMap = new Map<string, StaticSingleComponent>(
        nameUpdated.components.map((c) => [c.type, c]),
      );
      for (const comp of body.components) {
        const aval = avalMap.get(comp.type);
        if (aval) {
          if (comp.data != null) {
            aval.data = deepMerge(aval.data, comp.data);
          } else {
            nameUpdated.components.splice(
              nameUpdated.components.indexOf(aval!),
            );
          }
        } else {
          nameUpdated.components.push(comp);
        }
      }
    } else {
      nameUpdated.components = [];
    }
  }
  await updateFile(rows[0].driveId, nameUpdated, userId);
  return nameUpdated;
}
