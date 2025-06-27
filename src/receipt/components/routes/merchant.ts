import Elysia, { t } from "elysia";
import { merchantComponent } from "../validation";

export const merchantRouter = new Elysia({ tags: ["components"] })
  .put("/merchant", ({ params, body }) => {}, {
    body: merchantComponent.properties.data,
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/merchant", ({ params }) => {}, {
    params: t.Object({
      id: t.String(),
    }),
  });
