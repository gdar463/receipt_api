import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { decodeJwt } from "jose";

import db from "@/db";
import { receipts } from "@/db/schema";
import { now } from "@/util";

import {
  deleteMerchantComponentDetail,
  putMerchantComponentDetail,
} from "../docs";
import { ComponentNotFoundError } from "../errors";
import { getComps } from "../utils";
import { merchantComponent } from "../validation";

export const merchantRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .put(
    "/merchant",
    async ({ status, params: { id }, body, userId }) => {
      const { comps, compMap } = await getComps(id, userId);

      if (compMap.merchant) {
        comps[compMap.merchant.index].data = body;
      } else {
        comps.push({
          type: "merchant",
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
      body: merchantComponent.properties.data,
      params: t.Object({
        id: t.String({ description: "Receipt's ID" }),
      }),
      detail: putMerchantComponentDetail,
    },
  )
  .delete(
    "/merchant",
    async ({ status, params: { id }, userId }) => {
      const { comps, compMap } = await getComps(id, userId);
      if (!compMap.merchant) {
        throw new ComponentNotFoundError();
      }

      comps.splice(compMap.merchant.index, 1);

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
      detail: deleteMerchantComponentDetail,
    },
  );
