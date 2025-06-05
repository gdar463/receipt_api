import { t } from "elysia";

export const CountryComponent = t.Object({
  type: t.Literal("country"),
  data: t.Nullable(
    t.Object({
      country: t.String(),
    }),
  ),
});
