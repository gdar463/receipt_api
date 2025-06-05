import Elysia, { t } from "elysia";
import { submit } from "./submit";
import { decodeJwt } from "jose";
import { getReceipt } from "./get";
import { ScanComponent } from "./components/scan";
import { CountryComponent } from "./components/country";
import { listReceipts } from "./list";

export const ItemBody = t.Object({
  name: t.String(),
  components: t.Array(t.Union([ScanComponent, CountryComponent])),
});

export type StaticItemBody = typeof ItemBody.static;

export const itemRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id } as { userId: string };
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION":
        if (error.type === "body") {
          set.status = 400;
          return { error: "Invalid Body" };
        }
    }
  })
  .post(
    "/submit",
    async ({ status, userId, body }) => await submit(status, userId, body),
    {
      body: ItemBody,
    },
  )
  .get(
    "/get/:id",
    async ({ userId, params: { id } }) => await getReceipt(userId, id),
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .get("/get", async ({ userId }) => await listReceipts(userId));
