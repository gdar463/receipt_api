import type { DocumentDecoration } from "elysia";

export const postLoginDetail: DocumentDecoration = {
  summary: "Login",
  description: `Logs in the API.`,
  security: [],
  responses: {
    200: {
      description: "Logged in.",
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
            $ref: "#/components/schemas/error",
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
      description: "Created user.",
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
            $ref: "#/components/schemas/error",
          },
        },
      },
    },
  },
};
