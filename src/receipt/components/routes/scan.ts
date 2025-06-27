import Elysia, { t } from "elysia";
import { scanComponent } from "../validation";

export const scanRouter = new Elysia({ tags: ["components"] })
  .put("/scan", ({ params, body }) => {}, {
    body: scanComponent.properties.data,
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/scan", ({ params }) => {}, {
    params: t.Object({
      id: t.String(),
    }),
  });
