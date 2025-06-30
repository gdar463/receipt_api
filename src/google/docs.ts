import type { DocumentDecoration } from "elysia";

export const getAuthUrlDetail: DocumentDecoration = {
  summary: "Obtain OAuth2.0 URL",
  description: `Returns the Google OAuth2.0 URL, for connect Google Drive to the currectly logged-in user.`,
  responses: {
    200: {
      description: "Obtained Auth URL.",
      content: {
        "application/json": {
          schema: {
            description: "Auth Url Object.",
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "Google OAuth2.0 URL",
                example:
                  "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=openid%20https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fdrive.appdata&include_granted_scopes=true&prompt=consent&state=&response_type=code&client_id=&redirect_uri=",
              },
            },
          },
        },
      },
    },
  },
};

export const getCallbackDetail: DocumentDecoration = {
  summary: "OAuth2.0 Callback",
  description: `Callback for google after consent`,
  hide: process.env.OPENAPI_SHOW_HIDDEN ? false : true,
  responses: {
    204: {
      description: "Connected account.",
    },
    500: {
      description: "Google Failed.",
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
