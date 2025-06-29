import Elysia, { t } from "elysia";
import { decodeJwt } from "jose";
import { receipts } from "@/db/schema";
import db from "@/db";
import { eq, and } from "drizzle-orm";
import { ReceiptNotFoundError } from "@/receipt/errors";
import { createComponentMap } from "../utils";
import { ComponentNotFoundError, GoogleError } from "../errors";
import { now } from "@/util";
import { createFile, deleteFile, getFileByID } from "@/google/drive";
import sharp from "sharp";

export const scanRouter = new Elysia({ tags: ["components"] })
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .get(
    "/scan",
    async ({ params: { id }, userId }) => {
      const rows = await db
        .select({ components: receipts.components })
        .from(receipts)
        .where(and(eq(receipts.userId, userId), eq(receipts.id, id)));
      if (rows.length === 0) {
        throw new ReceiptNotFoundError();
      }
      const comps = rows[0].components;
      const compMap = createComponentMap(comps);
      if (!compMap.scan) {
        throw new ComponentNotFoundError();
      }
      const file = await getFileByID(compMap.scan.data.driveId, userId);
      if (!file) {
        throw new GoogleError();
      }
      return file;
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .put(
    "/scan",
    async ({ status, params: { id }, body, userId }) => {
      const rows = await db
        .select({ components: receipts.components })
        .from(receipts)
        .where(and(eq(receipts.userId, userId), eq(receipts.id, id)));
      if (rows.length === 0) {
        throw new ReceiptNotFoundError();
      }
      const comps = rows[0].components;
      const compMap = createComponentMap(comps);

      if (compMap.scan) {
        await deleteFile(compMap.scan.data.driveId, userId);
        comps.splice(compMap.scan.index, 1);
      }
      const driveId = await createFile(
        {
          name: id,
          mime: body.file.type,
          body: body.file.stream(),
          properties: {
            orig_name: body.file.name,
          },
        },
        userId,
      );
      if (!driveId) {
        throw new GoogleError();
      }
      const thumbnail = await sharp(await body.file.arrayBuffer())
        .resize(200, 200, { fit: "inside" })
        .webp()
        .toBuffer();
      comps.push({
        type: "scan",
        data: {
          driveId,
          thumbnail: `data:image/webp;base64,${thumbnail.toString("base64")}`,
        },
      });

      await db
        .update(receipts)
        .set({
          components: comps,
          updatedAt: now(),
        })
        .where(eq(receipts.id, id));
      return status(204);
    },
    {
      body: t.Object({
        file: t.File({ type: "image" }),
      }),
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .delete(
    "/scan",
    async ({ status, params: { id }, userId }) => {
      const rows = await db
        .select({ components: receipts.components })
        .from(receipts)
        .where(and(eq(receipts.userId, userId), eq(receipts.id, id)));
      if (rows.length === 0) {
        throw new ReceiptNotFoundError();
      }
      const comps = rows[0].components;
      const compMap = createComponentMap(comps);
      if (!compMap.scan) {
        throw new ComponentNotFoundError();
      }

      await deleteFile(compMap.scan.data.driveId, userId);
      comps.splice(compMap.scan.index, 1);

      await db
        .update(receipts)
        .set({
          components: comps,
          updatedAt: now(),
        })
        .where(eq(receipts.id, id));
      return status(204);
    },
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
