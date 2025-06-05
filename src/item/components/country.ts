import { t } from "elysia";

export const CountryComponent = t.Object({
  type: t.Literal("country"),
  data: t.Object({
    country: t.String(),
  }),
});
