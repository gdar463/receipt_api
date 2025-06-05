import Elysia, { t } from "elysia";
import { submit } from "./submit";
import { decodeJwt } from "jose";
import { getReceipt } from "./get";
import { listReceipts } from "./list";
import { deleteReceipt } from "./delete";
import { patchReceipt } from "./patch";
import { ItemBody, PartialItemBody } from "./types";

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
  .get("/get", async ({ userId }) => await listReceipts(userId))
  .delete(
    "/delete/:id",
    async ({ status, userId, params: { id } }) =>
      await deleteReceipt(status, userId, id),
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  )
  .patch(
    "/edit/:id",
    async ({ userId, params: { id }, body }) =>
      await patchReceipt(userId, id, body),
    {
      params: t.Object({
        id: t.String(),
      }),
      body: PartialItemBody,
    },
  );
