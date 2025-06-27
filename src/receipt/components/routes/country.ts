import Elysia, { t } from "elysia";
import { countryComponent } from "../validation";
import { decodeJwt } from "jose";
import { receipts } from "@/db/schema";
import db from "@/db";
import { eq, and } from "drizzle-orm";
import { ReceiptNotFoundError } from "@/receipt/errors";
import { createComponentMap } from "../utils";
import { ComponentNotFoundError, CountryNotFoundError } from "../errors";
import { now } from "@/util";
import countries from "i18n-iso-countries";

export const countryRouter = new Elysia({ tags: ["components"] })
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .put(
    "/country",
    async ({ status, params: { id }, body, userId }) => {
      if (!countries.isValid(body.code)) {
        throw new CountryNotFoundError();
      }
      const rows = await db
        .select({ components: receipts.components })
        .from(receipts)
        .where(and(eq(receipts.userId, userId), eq(receipts.id, id)));
      if (rows.length === 0) {
        throw new ReceiptNotFoundError();
      }
      const comps = rows[0].components;
      const compMap = createComponentMap(comps);

      if (compMap.country) {
        comps[compMap.country.index].data = body;
      } else {
        comps.push({
          type: "country",
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
      body: countryComponent.properties.data,
      params: t.Object({
        id: t.String(),
      }),
    }
  )
  .delete(
    "/country",
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
      if (!compMap.country) {
        throw new ComponentNotFoundError();
      }

      comps.splice(compMap.country.index, 1);

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
