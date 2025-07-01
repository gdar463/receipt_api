import type { DocumentDecoration } from "elysia";

export const putCountryComponentDetail: DocumentDecoration = {
  summary: "Add or Update Country",
  description:
    "Adds or updates the country component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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
  description: "Deletes the country component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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
  description: "Gets the scanned receipt, given its ID.",
  responses: {
    200: {
      description: "OK.",
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
      description: "Not found.",
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
    "Adds or updates the scanned receipt, given its ID. Generates a thumbnail at the same time.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    401: {
      description: "Google not linked.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NoGoogleLinked",
          },
        },
      },
    },
    404: {
      description: "Not found.",
      content: {
        "application/json": {
          schema: {
            anyOf: [{ $ref: "#/components/schemas/ReceiptNotFound" }],
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

export const deleteScanComponentDetail: DocumentDecoration = {
  summary: "Delete Scan",
  description:
    "Delete the scanned receipt, given its ID. Automatically deletes the file from Google Drive.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    401: {
      description: "Google not linked.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/NoGoogleLinked",
          },
        },
      },
    },
    404: {
      description: "Not found.",
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

export const putMerchantComponentDetail: DocumentDecoration = {
  summary: "Add or Update Merchant",
  description:
    "Adds or updates the merchant component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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

export const deleteMerchantComponentDetail: DocumentDecoration = {
  summary: "Delete Merchant",
  description: "Deletes the merchant component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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

export const putDatetimeComponentDetail: DocumentDecoration = {
  summary: "Add or Update Date",
  description:
    "Adds or updates the datetime component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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

export const deleteDatetimeComponentDetail: DocumentDecoration = {
  summary: "Delete Date",
  description: "Deletes the datetime component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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

export const putTotalComponentDetail: DocumentDecoration = {
  summary: "Add or Update Total",
  description:
    "Adds or updates the total component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
      content: {
        "application/json": {
          schema: {
            anyOf: [
              { $ref: "#/components/schemas/ReceiptNotFound" },
              { $ref: "#/components/schemas/CurrencyNotFound" },
            ],
          },
        },
      },
    },
  },
};

export const deleteTotalComponentDetail: DocumentDecoration = {
  summary: "Delete Total",
  description: "Deletes the total component of a receipt, given its ID.",
  responses: {
    204: {
      $ref: "#/components/schemas/noContent",
    },
    404: {
      description: "Not found.",
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
