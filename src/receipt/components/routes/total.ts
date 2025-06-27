import Elysia, { t } from "elysia";
import { totalComponent } from "../validation";

export const totalRouter = new Elysia({ tags: ["components"] })
  .put("/total", ({ params, body }) => {}, {
    body: totalComponent.properties.data,
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/total", ({ params }) => {}, {
    params: t.Object({
      id: t.String(),
    }),
  });
