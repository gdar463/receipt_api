import Elysia, { t } from "elysia";
import { submit } from "./routes/submit";
import { getReceipt } from "./routes/get";
import { listReceipts } from "./routes/list";
import { deleteReceipt } from "./routes/delete";
import { receiptSchema } from "./types";
import { itemHooks } from "./hooks";

export const itemRouter = new Elysia()
  .use(itemHooks)
  .post(
    "/submit",
    async ({ status, userId, body }) => await submit(status, userId, body),
    {
      body: receiptSchema,
    }
  )
  .get(
    "/get/:id",
    async ({ userId, params: { id } }) => await getReceipt(userId, id),
    {
      params: t.Object({
        id: t.String(),
      }),
    }
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
    }
  );
