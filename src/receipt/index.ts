import Elysia, { t } from "elysia";

import { componentsRouter } from "./components";
import {
  deleteReceiptByIdDetail,
  getReceiptByIdDetail,
  getReceiptDetail,
  postReceiptDetail,
} from "./docs";
import { receiptHooks } from "./hooks";
import { deleteReceipt } from "./routes/delete";
import { getReceipt } from "./routes/get";
import { listReceipts } from "./routes/list";
import { submit } from "./routes/submit";

export const receiptRouter = new Elysia({
  prefix: "/receipt",
  tags: ["Receipt"],
})
  .use(componentsRouter)
  .use(receiptHooks)
  .get("/", async ({ userId }) => await listReceipts(userId), {
    detail: getReceiptDetail,
  })
  .post(
    "/",
    async ({ status, userId, body }) => await submit(status, userId, body),
    {
      body: t.Object({
        name: t.String({ description: "Receipt's name" }),
      }),
      detail: postReceiptDetail,
    },
  )
  .get(
    "/:id",
    async ({ userId, params: { id }, query: { map } }) =>
      await getReceipt(userId, id, map),
    {
      params: t.Object({
        id: t.String({ description: "Receipt's id" }),
      }),
      query: t.Object({
        map: t.Optional(
          t.Number({ description: "Set to 1, if map is needed" }),
        ),
      }),
      detail: getReceiptByIdDetail,
    },
  )
  .delete(
    "/:id",
    async ({ status, userId, params: { id } }) =>
      await deleteReceipt(status, userId, id),
    {
      params: t.Object({
        id: t.String({ description: "Receipt's id" }),
      }),
      detail: deleteReceiptByIdDetail,
    },
  );
