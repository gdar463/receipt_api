import Elysia, { t } from "elysia";
import { datetimeComponent } from "../validation";

export const datetimeRouter = new Elysia({ tags: ["components"] })
  .put("/datetime", ({ params, body }) => {}, {
    body: datetimeComponent.properties.data,
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/datetime", ({ params }) => {}, {
    params: t.Object({
      id: t.String(),
    }),
  });
