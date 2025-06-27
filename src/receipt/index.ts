import Elysia, { t } from "elysia";
import { submit } from "./routes/submit";
import { getReceipt } from "./routes/get";
import { listReceipts } from "./routes/list";
import { deleteReceipt } from "./routes/delete";
import { receiptSchema } from "./types";
import { receiptHooks } from "./hooks";

export const receiptRouter = new Elysia({ prefix: "/receipt" })
  .use(receiptHooks)
  .post(
    "/",
    async ({ status, userId, body }) => await submit(status, userId, body),
    {
      body: receiptSchema,
    }
  )
  .get("/", async ({ userId }) => await listReceipts(userId))
  .get(
    "/:id",
    async ({ userId, params: { id, map } }) =>
      await getReceipt(userId, id, map),
    {
      params: t.Object({
        id: t.String(),
        map: t.Nullable(t.Number()),
      }),
    }
  )
  .delete(
    "/:id",
    async ({ status, userId, params: { id } }) =>
      await deleteReceipt(status, userId, id),
    {
      params: t.Object({
        id: t.String(),
      }),
    }
  );
