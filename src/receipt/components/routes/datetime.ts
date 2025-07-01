import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { decodeJwt } from "jose";

import db from "@/db";
import { receipts } from "@/db/schema";
import { now } from "@/util";

import {
  deleteDatetimeComponentDetail,
  putDatetimeComponentDetail,
} from "../docs";
import { ComponentNotFoundError } from "../errors";
import { getComps } from "../utils";
import { datetimeComponent } from "../validation";

export const datetimeRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .put(
    "/datetime",
    async ({ status, params: { id }, body, userId }) => {
      const { comps, compMap } = await getComps(id, userId);

      if (compMap.datetime) {
        comps[compMap.datetime.index].data = body;
      } else {
        comps.push({
          type: "datetime",
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
      body: datetimeComponent.properties.data,
      params: t.Object({
        id: t.String({ description: "Receipt's ID" }),
      }),
      detail: putDatetimeComponentDetail,
    },
  )
  .delete(
    "/datetime",
    async ({ status, params: { id }, userId }) => {
      const { comps, compMap } = await getComps(id, userId);
      if (!compMap.datetime) {
        throw new ComponentNotFoundError();
      }

      comps.splice(compMap.datetime.index, 1);

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
      detail: deleteDatetimeComponentDetail,
    },
  );
