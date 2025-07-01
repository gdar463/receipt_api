import type { DocumentDecoration } from "elysia";

export const postLoginDetail: DocumentDecoration = {
  summary: "Login",
  description: `Logs in the API.`,
  security: [],
  responses: {
    200: {
      description: "OK.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/token",
          },
        },
      },
    },
    401: {
      description: "Invalid credentials.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/InvalidCreds",
          },
        },
      },
    },
  },
};

export const postSignupDetail: DocumentDecoration = {
  summary: "Signup",
  description: `Creates a user.`,
  security: [],
  responses: {
    200: {
      description: "OK.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/token",
          },
        },
      },
    },
    409: {
      description: "Username already exists.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UsernameAlreadyExists",
          },
        },
      },
    },
  },
};

export const postRefreshDetail: DocumentDecoration = {
  summary: "Refresh Token",
  description: "Refreshes the current Bearer Token.",
  responses: {
    200: {
      description: "OK.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/token",
          },
        },
      },
    },
    401: {
      description: "Invalid token.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/InvalidToken",
          },
        },
      },
    },
  },
};

export const getMeDetail: DocumentDecoration = {
  summary: "Get User",
  description: "Gets information of the current user.",
  responses: {
    200: {
      description: "OK.",
      content: {
        "application/json": {
          schema: {
            title: "User",
            type: "object",
            required: ["id", "username", "email", "displayName"],
            properties: {
              id: {
                type: "string",
                description: "User's ID.",
                example: "lUYV40MMZ1pHFmBnyWk63UYfplGDCpBp",
              },
              username: {
                type: "string",
                description: "User's username.",
                example: "beepBoopImHuman",
              },
              email: {
                type: "string",
                format: "email",
                description:
                  "User's email. (used in the future for password resets)",
                example: "definitelynotabot@trustme.com",
              },
              displayName: {
                type: "string",
                description: "User's display name. (for displaying in UIs)",
                example: "Not A Robot",
              },
            },
          },
        },
      },
    },
  },
};
