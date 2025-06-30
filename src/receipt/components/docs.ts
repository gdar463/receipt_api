import type { DocumentDecoration } from "elysia";

export const putCountryComponentDetail: DocumentDecoration = {
  summary: "Add or Update Country",
  description:
    "Adds or updates the country component of a reciept, given its ID",
  responses: {
    204: {
      description: "Operation Successfull.",
    },
    404: {
      description: "Something was not found.",
      content: {
        "application/json": {
          schema: {
            anyOf: [
              { $ref: "#/components/schemas/CountryNotFound" },
              { $ref: "#/components/schemas/ReceiptNotFound" },
            ],
          },
        },
      },
    },
  },
};

export const deleteCountryComponentDetail: DocumentDecoration = {
  summary: "Delete Country",
  description: "Deletes the country component of a reciept, given its ID",
  responses: {
    204: {
      description: "Operation Successfull.",
    },
    404: {
      description: "Something was not found.",
      content: {
        "application/json": {
          schema: {
            anyOf: [
              { $ref: "#/components/schemas/ComponentNotFound" },
              { $ref: "#/components/schemas/ReceiptNotFound" },
            ],
          },
        },
      },
    },
  },
};

export const getScanComponentDetail: DocumentDecoration = {
  summary: "Get Scan",
  description: "Gets the scanned reciept, given its ID",
  responses: {
    200: {
      description: "Got Image.",
      content: {
        "image/jpeg": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
        "image/png": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
        "image/webp": {
          schema: {
            type: "string",
            format: "binary",
          },
        },
      },
    },
    404: {
      description: "Something was not found.",
      content: {
        "application/json": {
          schema: {
            anyOf: [
              { $ref: "#/components/schemas/ComponentNotFound" },
              { $ref: "#/components/schemas/ReceiptNotFound" },
            ],
          },
        },
      },
    },
    500: {
      description: "Google Failed.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/GoogleFailed",
          },
        },
      },
    },
  },
};

export const putScanComponentDetail: DocumentDecoration = {
  summary: "Add or Update Scan",
  description:
    "Adds or updates the scanned reciept, given its ID. Generates a thumbnail at the same time.",
  responses: {
    204: {
      description: "Operation Successfull.",
    },
    404: {
      description: "Something was not found.",
      content: {
        "application/json": {
          schema: {
            anyOf: [{ $ref: "#/components/schemas/ReceiptNotFound" }],
          },
        },
      },
    },
  },
};
