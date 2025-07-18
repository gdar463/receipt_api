import bearer from "@elysiajs/bearer";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import countries from "i18n-iso-countries";
import { decodeJwt } from "jose";

import db from "@/db";
import { receipts } from "@/db/schema";
import { now } from "@/util";

import {
  deleteCountryComponentDetail,
  putCountryComponentDetail,
} from "../docs";
import { ComponentNotFoundError, CountryNotFoundError } from "../errors";
import { getComps } from "../utils";
import { countryComponent } from "../validation";

export const countryRouter = new Elysia()
  .use(bearer())
  .resolve(({ bearer }) => {
    return { userId: decodeJwt(bearer).id as string };
  })
  .put(
    "/country",
    async ({ status, params: { id }, body, userId }) => {
      if (!countries.isValid(body.code)) {
        throw new CountryNotFoundError();
      }
      const { comps, compMap } = await getComps(id, userId);

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
        id: t.String({ description: "Receipt's ID" }),
      }),
      detail: putCountryComponentDetail,
    },
  )
  .delete(
    "/country",
    async ({ status, params: { id }, userId }) => {
      const { comps, compMap } = await getComps(id, userId);
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
      detail: deleteCountryComponentDetail,
    },
  );
