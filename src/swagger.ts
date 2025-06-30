import type { ElysiaSwaggerConfig } from "@elysiajs/swagger";

export const swaggerConfig: ElysiaSwaggerConfig = {
  autoDarkMode: true,
  documentation: {
    info: {
      title: "Receipt Tracker API",
      version: "0.1",
      license: {
        name: "GPL v3.0",
        url: "https://github.com/gdar463/receipt_api/blob/master/LICENSE",
      },
      contact: {
        name: "Dario",
        url: "https://github.com/gdar463/receipt_api",
      },
      description: "API for my Receipt Tracker",
    },
    servers: [
      {
        url: "http://localhost:3000",
        description: "Development",
      },
    ],
    tags: [
      {
        name: "Auth",
        description: "Handles auth for the API.",
      },
      {
        name: "Google",
        description: "Handles Google-related endpoints.",
      },
      {
        name: "Receipt",
        description: "Manage receipts.",
      },
      {
        name: "Components",
        description: "Manages scan components",
      },
    ],
    security: [{ bearerAuth: [] }],
    components: {
      schemas: {
        receipt: {
          type: "object",
          description: "Receipt object",
          required: ["id", "name", "createdAt", "updatedAt", "components"],
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
            components: {
              type: "array",
              description: "List of components",
              items: {
                $ref: "#/components/schemas/component",
              },
            },
            componentMap: {
              type: "object",
              description:
                "Map of components. For format, try the request. (too big to type for openAPI)",
            },
          },
        },
        createdAt: {
          type: "integer",
          description: "Receipt's creation time, from Unix Epoch",
          example: 946684800,
        },
        updatedAt: {
          type: "integer",
          description: "Receipt's last update time, from Unix Epoch",
          example: 946684800,
        },
        id: {
          type: "string",
          description: "Receipt's ID",
          example: "EPxYUUW17TrygICrzPHreWD4R79yx7JU",
        },
        name: {
          type: "string",
          description: "Receipt's name",
          example: "Generic Receipt",
        },
        error: {
          type: "object",
          description: "Error object",
          required: ["error"],
          properties: {
            error: {
              type: "string",
              description: "The reason of the error",
              example: "Generic Error.",
            },
          },
        },
        token: {
          type: "object",
          description: "Token object",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              description:
                "Bearer token, to be saved and used with every request. Expires after 7 days.",
              example: "YOUR_SECRET_TOKEN",
            },
          },
        },
        component: {
          description: "Any component",
          oneOf: [
            { $ref: "#/components/schemas/countryComponent" },
            { $ref: "#/components/schemas/scanComponent" },
            { $ref: "#/components/schemas/merchantComponent" },
            { $ref: "#/components/schemas/datetimeComponent" },
            { $ref: "#/components/schemas/totalComponent" },
          ],
          discriminator: {
            propertyName: "type",
            mapping: {
              country: "#/components/schemas/countryComponent",
              scan: "#/components/schemas/scanComponent",
              merchant: "#/components/schemas/merchantComponent",
              datetime: "#/components/schemas/datetimeComponent",
              total: "#/components/schemas/totalComponent",
            },
          },
        },
        countryComponent: {
          title: "Country Component",
          type: "object",
          description: "Holds the country of the receipt's issue.",
          required: ["type", "data"],
          properties: {
            type: {
              type: "string",
              description: "Type of the component",
              enum: ["country"],
            },
            data: {
              type: "object",
              description: "Data held by the component",
              required: ["code"],
              properties: {
                code: {
                  type: "string",
                  description: "ISO 3166 alpha-2 country code",
                  example: "IT",
                },
              },
            },
          },
        },
        scanComponent: {
          title: "Scan Component",
          type: "object",
          description:
            "Holds the file id and the thumbnail of the scanned receipt.",
          required: ["type", "data"],
          properties: {
            type: {
              type: "string",
              description: "Type of the component",
              enum: ["scan"],
            },
            data: {
              type: "object",
              description: "Data held by the component",
              required: ["driveId", "thumbnail"],
              properties: {
                driveId: {
                  type: "string",
                  description: "Scan's drive id. To be used only by the API",
                  example: "1MRQTQOJYGYYWIODGGUbDKMZTHAcDGOLD",
                },
                thumbnail: {
                  type: "string",
                  description:
                    "Data uri for a base64-encoded webp file, containing a smaller version of the scan",
                  example: "data:image/webp;base64,UklGRiIAAABXRUJQVlA4...",
                },
              },
            },
          },
        },
        merchantComponent: {
          title: "Merchant Component",
          type: "object",
          description: "Holds information about the merchant.",
          required: ["type", "data"],
          properties: {
            type: {
              type: "string",
              description: "Type of the component",
              enum: ["merchant"],
            },
            data: {
              type: "object",
              description: "Data held by the component",
              required: ["name", "address"],
              properties: {
                name: {
                  type: "string",
                  description: "Name of the merchant",
                  example: "Shoe Store LLC",
                },
                vatNumber: {
                  type: "string",
                  description: "VAT number of the merchant, if present",
                  example: "IT12345678901",
                },
                address: {
                  type: "string",
                  description: "Address of the merchant",
                  example: "Via Scarpe 12, Milano, Italy",
                },
                insidePlace: {
                  type: "string",
                  description:
                    "Name of the parent place, if merchant is inside one (e.g. mall)",
                  example: "Cat Mall",
                },
              },
            },
          },
        },
        datetimeComponent: {
          title: "Date Component",
          type: "object",
          description: "Holds the date and time of the receipt's issue.",
          required: ["type", "data"],
          properties: {
            type: {
              type: "string",
              description: "Type of the component",
              enum: ["datetime"],
            },
            data: {
              type: "object",
              description: "Data held by the component",
              required: ["date"],
              properties: {
                date: {
                  type: "string",
                  format: "date-time",
                  description: "ISO 8601 date-time string of the receipt",
                  example: "2000-01-01T00:00:00.000Z",
                },
              },
            },
          },
        },
        totalComponent: {
          title: "Total Component",
          type: "object",
          description:
            "Holds the total, made up of the amount and the currency code.",
          required: ["type", "data"],
          properties: {
            type: {
              type: "string",
              description: "Type of the component",
              enum: ["total"],
            },
            data: {
              type: "object",
              description: "Data held by the component",
              required: ["amount", "currency"],
              properties: {
                amount: {
                  type: "number",
                  description: "Total of the receipt",
                  example: "12.50",
                },
                currency: {
                  type: "string",
                  description: "ISO 4217 currency code of the amount",
                  example: "EUR",
                },
              },
            },
          },
        },
        ComponentNotFound: {
          title: "ComponentNotFound Error",
          type: "object",
          description: "Thrown if a non-existent component is requested.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Component Not Found"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["ComponentNotFound"],
            },
          },
        },
        CountryNotFound: {
          title: "CountryNotFound Error",
          type: "object",
          description:
            "Thrown if a non-existent country code is given. If country actually exist, open issue on GitHub.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Invalid country"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["CountryNotFound"],
            },
          },
        },
        ValidationFailed: {
          title: "ValidationFailed Error",
          type: "object",
          description:
            "Thrown if there's an error in the request's format. When in dev enviroment, return more information.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Invalid request"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["ValidationFailed"],
            },
          },
        },
        NoGoogleLinked: {
          title: "NoGoogleLinked Error",
          type: "object",
          description: `Thrown if trying to access Google Drive, without linking Google first.
            <small>actually checks if tokens exists in DB, but this is normally the reason</small>`,
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Google not connected to account"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["NoGoogleLinked"],
            },
          },
        },
        GoogleFailed: {
          title: "GoogleFailed Error",
          type: "object",
          description: "Thrown if Google returns anything unexpected.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Google Failed"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["GoogleFailed"],
            },
          },
        },
        ReceiptNotFound: {
          title: "ReceiptNotFound Error",
          type: "object",
          description: "Thrown when a non-existent receipt is requested.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Receipt Not Found"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["ReceiptNotFound"],
            },
          },
        },
        NameAlreadyExists: {
          title: "NameAlreadyExists Error",
          type: "object",
          description:
            "Thrown when trying to create a new receipt, with an already existing name.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message",
              enum: ["Name already exists"],
            },
            code: {
              type: "string",
              description: "Error specific code",
              enum: ["NameAlreadyExists"],
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description: `A JWT token, signed by the server using its own private key, 
          set to expire in 7 days, holding in the payload ${"`id`"}, or the id of the user`,
        },
      },
    },
  },
  exclude: ["/api/test"],
};
