import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { decodeJwt } from "jose";
import sharp from "sharp";

import db from "@/db";
import { receipts } from "@/db/schema";
import { createFile, deleteFile, getFileByID } from "@/google/drive";
import { now } from "@/util";

import {
  deleteScanComponentDetail,
  getScanComponentDetail,
  putScanComponentDetail,
} from "../docs";
import { ComponentNotFoundError, GoogleError } from "../errors";
import { getComps } from "../utils";

export const scanRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .get(
    "/scan",
    async ({ params: { id }, userId }) => {
      const { comps: _, compMap } = await getComps(id, userId);
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
        id: t.String({ description: "Receipt's ID" }),
      }),
      detail: getScanComponentDetail,
    },
  )
  .put(
    "/scan",
    async ({ status, params: { id }, body, userId }) => {
      const { comps, compMap } = await getComps(id, userId);

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
      parse: ["multipart/form-data"],
      body: t.Object({
        file: t.File({ type: "image", description: "Scanned receipt." }),
      }),
      params: t.Object({
        id: t.String({ description: "Receipt's ID" }),
      }),
      detail: putScanComponentDetail,
    },
  )
  .delete(
    "/scan",
    async ({ status, params: { id }, userId }) => {
      const { comps, compMap } = await getComps(id, userId);
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
        id: t.String({ description: "Receipt's ID" }),
      }),
      detail: deleteScanComponentDetail,
    },
  );
