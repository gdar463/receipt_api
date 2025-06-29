import Elysia, { t } from "elysia";

import { componentsRouter } from "./components";
import { receiptHooks } from "./hooks";
import { deleteReceipt } from "./routes/delete";
import { getReceipt } from "./routes/get";
import { listReceipts } from "./routes/list";
import { submit } from "./routes/submit";

export const receiptRouter = new Elysia({ prefix: "/receipt" })
  .use(componentsRouter)
  .use(receiptHooks)
  .post(
    "/",
    async ({ status, userId, body }) => await submit(status, userId, body),
    {
      body: t.Object({
        name: t.String(),
      }),
    },
  )
  .get("/", async ({ userId }) => await listReceipts(userId))
  .get(
    "/:id",
    async ({ userId, params: { id }, query: { map } }) =>
      await getReceipt(userId, id, map),
    {
      params: t.Object({
        id: t.String(),
      }),
      query: t.Object({
        map: t.Optional(t.Number()),
      }),
    },
  )
  .delete(
    "/:id",
    async ({ status, userId, params: { id } }) =>
      await deleteReceipt(status, userId, id),
    {
      params: t.Object({
        id: t.String(),
      }),
    },
  );
