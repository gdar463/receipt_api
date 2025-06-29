import Elysia, { t } from "elysia";
import { merchantComponent } from "../validation";
import { decodeJwt } from "jose";
import { receipts } from "@/db/schema";
import db from "@/db";
import { eq } from "drizzle-orm";
import { getComps } from "../utils";
import { ComponentNotFoundError } from "../errors";
import { now } from "@/util";

export const merchantRouter = new Elysia({ tags: ["components"] })
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
        id: t.String(),
      }),
    }
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
        id: t.String(),
      }),
    }
  );
