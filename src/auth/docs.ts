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
            $ref: "#/components/schemas/authResponse",
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
            $ref: "#/components/schemas/authResponse",
          },
        },
      },
    },
    409: {
      description: "User already exists.",
      content: {
        "application/json": {
          schema: {
            $ref: "#/components/schemas/UserAlreadyExists",
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
