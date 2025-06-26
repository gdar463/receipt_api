// import db from "@/db";
// import { receipts } from "@/db/schema";
// import { getFileByID, updateFile } from "@/google/drive";
// import {
//   NameAlreadyExistsError,
//   PatchBodyNotFoundError,
//   ReceiptNotFoundError,
// } from "@/item/errors";
// import { and, eq } from "drizzle-orm";
import type { CountryComponent } from "../country";

export async function editText(
  userId: string,
  receiptId: string,
  comp: string,
  body: typeof CountryComponent.static,
) {
  return "magic";
  // if (!body.name) throw new PatchBodyNotFoundError();
  // let rows = [];
  // try {
  //   rows = await db
  //     .update(receipts)
  //     .set({ name: body.name })
  //     .where(and(eq(receipts.userId, userId), eq(receipts.id, receiptId)))
  //     .returning({ driveId: receipts.driveId });
  // } catch (e) {
  //   if (e instanceof Error && e.message.includes("UNIQUE constraint failed")) {
  //     throw new NameAlreadyExistsError();
  //   }
  //   throw e;
  // }
  // if (rows.length == 0) {
  //   throw new ReceiptNotFoundError();
  // }
  // const receipt = await getFileByID(rows[0].driveId, userId);
  // const nameUpdated = { ...receipt, name: body.name };
  // await updateFile(rows[0].driveId, nameUpdated, userId);
  // return nameUpdated;
}
