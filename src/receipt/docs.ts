import type { DocumentDecoration } from "elysia";

export const getReceiptDetail: DocumentDecoration = {
  summary: "List Receipts",
  description: "Get a list of all receipts of the user.",
  responses: {
    200: {
      description: "Obtained list successfully",
      content: {
        "application/json": {
          schema: {
            type: "array",
            description: "Receipts List",
            items: {
              type: "object",
              description: "Receipt",
              properties: {
                id: {
                  $ref: "#/components/schemas/id",
                },
                name: {
                  $ref: "#/components/schemas/name",
                },
                createdAt: {
                  $ref: "#/components/schemas/createdAt",
                },
                updatedAt: {
                  $ref: "#/components/schemas/updatedAt",
                },
              },
            },
          },
        },
      },
    },
  },
};

export const postReceiptDetail: DocumentDecoration = {
  summary: "Create Receipt",
  description: "Create a new receipt, given unique name.",
  responses: {
    200: {
      description: "Created successfully.",
      content: {
        "application/json": {
          schema: {
            type: "object",
            properties: {
              id: {
                $ref: "#/components/schemas/id",
              },
            },
          },
        },
      },
    },
    409: {
      description: "Name already exists.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};

export const getReceiptByIdDetail: DocumentDecoration = {
  summary: "Get Receipt By ID",
  description: `Obtain a receipt, using its ID.<br><br>
  If needed a componentMap can be given by the server, for easier access to components, 
  by including the query parameter ${"`map`"} with value one.`,
  responses: {
    200: {
      description: "Obtained successfully.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/receipt",
          },
        },
      },
    },
    404: {
      description: "Not Found.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};

export const deleteReceiptByIdDetail: DocumentDecoration = {
  summary: "Delete Receipt By ID",
  description: "Delete a receipt, using its ID.",
  responses: {
    204: {
      description: "Deleted successfully.",
    },
  },
};
