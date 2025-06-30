import cc from "currency-codes";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { decodeJwt } from "jose";

import db from "@/db";
import { receipts } from "@/db/schema";
import { now } from "@/util";

import { ComponentNotFoundError, CurrencyNotFoundError } from "../errors";
import { getComps } from "../utils";
import { totalComponent } from "../validation";

export const totalRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .put(
    "/total",
    async ({ status, params: { id }, body, userId }) => {
      if (!cc.codes().includes(body.currency)) {
        throw new CurrencyNotFoundError();
      }
      const { comps, compMap } = await getComps(id, userId);

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
    },
  )
  .delete(
    "/total",
    async ({ status, params: { id }, userId }) => {
      const { comps, compMap } = await getComps(id, userId);
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
    },
  );
