import type { ElysiaSwaggerConfig } from "@elysiajs/swagger";

export const swaggerConfig: ElysiaSwaggerConfig = {
  autoDarkMode: true,
  scalarConfig: {
    metaData: {
      ogDescription: "API for my Receipt Tracker",
    },
  },
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
      description:
        "API for my Receipt Tracker.\n" +
        "## Authentication\n" +
        "For authentication, this API makes use of the `Bearer` token, inside the HTTP header `Authorization`.\n" +
        "To acquire one, check out the methods under the `Auth` tag.\n\n" +
        "The tokens are JWT, signed by the private-key of the server, set to expire 7 days from creation, with the following payload:\n" +
        "```json\n" +
        "{\n" +
        // prettier-ignore
        "\tid: \"{user_id}\"\n" +
        "}\n" +
        "```\n" +
        "The token should be included with every request, as apart from `/auth/login` and `/auth/signup`, all endpoints require authentication.\n" +
        "## Development Enviorment\n" +
        "Some endpoints are intended for internal use only and are hidden by default. " +
        "To make them visible, set the `OPENAPI_SHOW_HIDDEN` environment variable to a truthy value.\n\n" +
        "While `NODE_ENV` is set to `development`, all validation errors will return Elysia's default errors.",
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
        noContent: {
          description: "OK. (No Content)",
        },
        receipt: {
          title: "Receipt",
          type: "object",
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
                "Map of components. For format, try the request. (too big to type for OpenAPI)",
            },
          },
        },
        createdAt: {
          type: "integer",
          description: "Receipt's creation time, from Unix Epoch.",
          example: 946684800,
        },
        updatedAt: {
          type: "integer",
          description: "Receipt's last update time, from Unix Epoch.",
          example: 946684800,
        },
        id: {
          type: "string",
          description: "Receipt's ID.",
          example: "EPxYUUW17TrygICrzPHreWD4R79yx7JU",
        },
        name: {
          type: "string",
          description: "Receipt's name.",
          example: "Generic Receipt",
        },
        token: {
          title: "Token",
          type: "object",
          description:
            "Check [Authentication](#description/authentication) for more details.",
          required: ["token"],
          properties: {
            token: {
              type: "string",
              description:
                "Bearer token, to be saved and used with every request.",
              example: "YOUR_SECRET_TOKEN",
            },
          },
        },
        component: {
          title: "Any Component",
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
              description: "Type of the component.",
              enum: ["country"],
            },
            data: {
              type: "object",
              description: "Data held by the component.",
              required: ["code"],
              properties: {
                code: {
                  type: "string",
                  description: "ISO 3166 alpha-2 country code.",
                  example: "IT",
                },
              },
            },
          },
        },
        scanComponent: {
          title: "Scan Component.",
          type: "object",
          description:
            "Holds the file id and the thumbnail of the scanned receipt.",
          required: ["type", "data"],
          properties: {
            type: {
              type: "string",
              description: "Type of the component.",
              enum: ["scan"],
            },
            data: {
              type: "object",
              description: "Data held by the component.",
              required: ["driveId", "thumbnail"],
              properties: {
                driveId: {
                  type: "string",
                  description:
                    "Scan's drive id.\n" +
                    "> [!note]\n" +
                    "> To be used only by the API.",
                  example: "1MRQTQOJYGYYWIODGGUbDKMZTHAcDGOLD",
                },
                thumbnail: {
                  type: "string",
                  description:
                    "Data uri for a base64-encoded webp file, containing a smaller version of the scan.",
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
              description: "Type of the component.",
              enum: ["merchant"],
            },
            data: {
              type: "object",
              description: "Data held by the component.",
              required: ["name", "address"],
              properties: {
                name: {
                  type: "string",
                  description: "Name of the merchant.",
                  example: "Shoe Store LLC",
                },
                vatNumber: {
                  type: "string",
                  description: "VAT number of the merchant, if present.",
                  example: "IT12345678901",
                },
                address: {
                  type: "string",
                  description: "Address of the merchant.",
                  example: "Via Scarpe 12, Milano, Italy",
                },
                insidePlace: {
                  type: "string",
                  description:
                    "Name of the parent place, if merchant is inside one (e.g. mall).",
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
              description: "Type of the component.",
              enum: ["datetime"],
            },
            data: {
              type: "object",
              description: "Data held by the component.",
              required: ["date"],
              properties: {
                date: {
                  type: "string",
                  format: "date-time",
                  description: "ISO 8601 date-time string of the receipt.",
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
              description: "Type of the component.",
              enum: ["total"],
            },
            data: {
              type: "object",
              description: "Data held by the component.",
              required: ["amount", "currency"],
              properties: {
                amount: {
                  type: "number",
                  description: "Total of the receipt.",
                  example: "12.50",
                },
                currency: {
                  type: "string",
                  description: "ISO 4217 currency code.",
                  example: "EUR",
                },
              },
            },
          },
        },
        InvalidCreds: {
          title: "InvalidCredsError",
          type: "object",
          description: "Thrown if trying to login with invalid credentials.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Invalid credentials"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["InvalidCreds"],
            },
          },
        },
        Unauthenticated: {
          title: "UnauthenticatedError",
          type: "object",
          description:
            "Thrown if trying to access a protected endpoint without a token.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Not Logged In"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["Unauthenticated"],
            },
          },
        },
        InvalidToken: {
          title: "InvalidTokenError",
          type: "object",
          description:
            "Thrown if trying to refresh the token with an invalid/already expired token.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Invalid token"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["InvalidToken"],
            },
          },
        },
        UserAlreadyExists: {
          title: "UserAlreadyExistsError",
          type: "object",
          description:
            "Thrown if trying to signup with an already existing username and/or email.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["User already exists"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["UserAlreadyExists"],
            },
          },
        },
        ComponentNotFound: {
          title: "ComponentNotFoundError",
          type: "object",
          description: "Thrown if a non-existent component is requested.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Component Not Found"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["ComponentNotFound"],
            },
          },
        },
        CountryNotFound: {
          title: "CountryNotFoundError",
          type: "object",
          description:
            "Thrown if a non-existent country code is given. If country actually exists, open issue on GitHub, unless they aren't recognized globally.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Invalid country"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["CountryNotFound"],
            },
          },
        },
        CurrencyNotFound: {
          title: "CurrencyNotFoundError",
          type: "object",
          description:
            "Thrown if a non-existent currency code is given. If currency actually exists, open issue on GitHub.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Invalid currency"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["CurrencyNotFound"],
            },
          },
        },
        ValidationFailed: {
          title: "ValidationFailedError",
          type: "object",
          description:
            "Thrown if there's an error in the request's format. When in dev enviroment, return more information.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Invalid request"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["ValidationFailed"],
            },
          },
        },
        NoGoogleLinked: {
          title: "NoGoogleLinkedError",
          type: "object",
          description:
            "Thrown if trying to access Google Drive, without linking Google first.\n" +
            "> [!note]\n" +
            "> Actually checks if tokens exists in DB, but this is normally the reason.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Google not connected to account"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["NoGoogleLinked"],
            },
          },
        },
        GoogleFailed: {
          title: "GoogleFailedError",
          type: "object",
          description: "Thrown if Google returns anything unexpected.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Google Failed"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["GoogleFailed"],
            },
          },
        },
        ReceiptNotFound: {
          title: "ReceiptNotFoundError",
          type: "object",
          description: "Thrown when a non-existent receipt is requested.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Receipt Not Found"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["ReceiptNotFound"],
            },
          },
        },
        NameAlreadyExists: {
          title: "NameAlreadyExistsError",
          type: "object",
          description:
            "Thrown when trying to create a new receipt, with an already existing name.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Name already exists"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["NameAlreadyExists"],
            },
          },
        },
        FailedDeletion: {
          title: "FailedDeletionError",
          type: "object",
          description:
            "Thrown when trying to delete a receipt, which still has components.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: ["Failed to delete. Receipt has components"],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["FailedDeletion"],
            },
          },
        },
        UserDoesntExist: {
          title: "UserDoesntExistError",
          type: "object",
          description:
            "Thrown if the user requested doesn't exist, but JWT verification passes.",
          required: ["error", "code"],
          properties: {
            error: {
              type: "string",
              description: "Error Message.",
              enum: [
                "User doesn't exist. If it's not been deleted, contact support.",
              ],
            },
            code: {
              type: "string",
              description: "Error specific code.",
              enum: ["UserDoesntExist"],
            },
          },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          description:
            "A JWT Token, check [Authentication](#description/authentication) for more details.",
        },
      },
    },
  },
  exclude: ["/api/test"],
};
