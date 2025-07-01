import { t } from "elysia";

export const countryComponent = t.Object({
  type: t.Literal("country", { description: "Type of the component" }),
  data: t.Object(
    {
      code: t.String({
        description: "ISO 3166 alpha-2 country code",
        examples: ["IT"],
      }),
    },
    { description: "Data held by the component" },
  ),
});

export const scanComponent = t.Object({
  type: t.Literal("scan", { description: "Type of the component" }),
  data: t.Object(
    {
      driveId: t.String({
        description: "Scan's drive id. To be used only by the API",
        examples: ["1MRQTQOJYGYYWIODGGUbDKMZTHAcDGOLD"],
      }),
      thumbnail: t.String({
        description:
          "Data uri for a base64-encoded webp file, containing a smaller version of the scan",
        examples: ["data:image/webp;base64,UklGRiIAAABXRUJQVlA4..."],
      }),
    },
    { description: "Data held by the component" },
  ),
});

export const merchantComponent = t.Object({
  type: t.Literal("merchant", { description: "Type of the component" }),
  data: t.Object(
    {
      name: t.String({
        description: "Name of the merchant",
        examples: ["Shoe Store LLC"],
      }),
      vatNumber: t.Optional(
        t.String({
          description: "VAT number of the merchant, if present",
          examples: ["IT12345678901"],
        }),
      ),
      address: t.String({
        description: "Address of the merchant",
        examples: ["Via Scarpe 12, Milano, Italy"],
      }),
      insidePlace: t.Optional(
        t.String({
          description:
            "Name of the parent place, if merchant is inside one (e.g. mall)",
          examples: ["Cat Mall"],
        }),
      ),
    },
    { description: "Data held by the component" },
  ),
});

export const datetimeComponent = t.Object({
  type: t.Literal("datetime", { description: "Type of the component" }),
  data: t.Object(
    {
      date: t.Date({
        description: "ISO 8601 date-time string of the receipt",
        examples: ["2000-01-01T00:00:00.000Z"],
      }),
    },
    { description: "Data held by the component" },
  ),
});

export const totalComponent = t.Object({
  type: t.Literal("total", { description: "Type of the component" }),
  data: t.Object(
    {
      amount: t.Number({
        description: "Total of the receipt",
        examples: ["12.50"],
      }),
      currency: t.String({
        description: "ISO 4217 currency code",
        examples: ["EUR"],
      }),
    },
    { description: "Data held by the component" },
  ),
});

export const allComponents = t.Union([
  countryComponent,
  scanComponent,
  merchantComponent,
  datetimeComponent,
  totalComponent,
]);
