import Elysia, { t } from "elysia";
import { countryComponent } from "../validation";

export const countryRouter = new Elysia({ tags: ["components"] })
  .put("/country", ({ params, body }) => {}, {
    body: countryComponent.properties.data,
    params: t.Object({
      id: t.String(),
    }),
  })
  .delete("/country", ({ params }) => {}, {
    params: t.Object({
      id: t.String(),
    }),
  });
