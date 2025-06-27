import { t } from "elysia";

export const countryComponent = t.Object({
  type: t.Literal("country"),
  data: t.Object({
    code: t.String(),
  }),
});

export const scanComponent = t.Object({
  type: t.Literal("scan"),
  data: t.Object({
    driveId: t.String(),
  }),
});

export const merchantComponent = t.Object({
  type: t.Literal("merchant"),
  data: t.Object({
    name: t.String(),
    vatNumber: t.Optional(t.String()),
    address: t.String(),
    insidePlace: t.Optional(t.String()),
  }),
});

export const datetimeComponent = t.Object({
  type: t.Literal("datetime"),
  data: t.Object({
    date: t.Date(),
  }),
});

export const totalComponent = t.Object({
  type: t.Literal("total"),
  data: t.Object({
    amount: t.Number(),
    currency: t.String(),
  }),
});

export const allComponents = t.Union([
  countryComponent,
  scanComponent,
  merchantComponent,
  datetimeComponent,
  totalComponent,
]);
