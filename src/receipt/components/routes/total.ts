import Elysia, { t } from "elysia";
import { totalComponent } from "../validation";
import { decodeJwt } from "jose";
import { receipts } from "@/db/schema";
import db from "@/db";
import { eq, and } from "drizzle-orm";
import { ReceiptNotFoundError } from "@/receipt/errors";
import { createComponentMap } from "../utils";
import { ComponentNotFoundError } from "../errors";
import { now } from "@/util";

export const totalRouter = new Elysia({ tags: ["components"] })
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .put(
    "/total",
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

      if (compMap.total) {
        comps[compMap.total.index].data = body;
      } else {
        comps.push({
          type: "total",
          data: body,
        });
      }

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
      body: totalComponent.properties.data,
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/total",
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
      if (!compMap.total) {
        throw new ComponentNotFoundError();
      }

      comps.splice(compMap.total.index, 1);

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
    }
  );
