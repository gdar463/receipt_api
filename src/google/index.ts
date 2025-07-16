import bearer from "@elysiajs/bearer";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { google } from "googleapis";

import db from "@/db";
import { users } from "@/db/schema";
import { GoogleError } from "@/receipt/components/errors";

import { getAuthUrlDetail, getCallbackDetail } from "./docs";
import { globalGoogleHooks, googleHooks } from "./hooks";
import { encryptInfo } from "./token";

const authClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const scopes = ["openid", "https://www.googleapis.com/auth/drive.appdata"];

export const googleRouter = new Elysia({
  prefix: "/google",
  tags: ["Google"],
})
  .use(bearer())
  .use(googleHooks)
  .get(
    "/auth-url",
    ({ userId }) => {
      return {
        url: authClient.generateAuthUrl({
          access_type: "offline",
          scope: scopes,
          include_granted_scopes: true,
          prompt: "consent",
          state: userId,
        }),
      };
    },
    {
      detail: getAuthUrlDetail,
    },
  );

export const globalGoogleRouter = new Elysia({
  prefix: "/google",
  tags: ["Google"],
})
  .use(globalGoogleHooks)
  .get(
    "/callback",
    async ({ query, status }) => {
      const { tokens } = await authClient.getToken(query.code);
      if (!tokens.access_token) {
        throw new GoogleError();
      }
      await db
        .update(users)
        .set({
          googleInfo: await encryptInfo({
            accessToken: tokens.access_token!,
            refreshToken: tokens.refresh_token!,
            expires: new Date(tokens.expiry_date!),
          }),
        })
        .where(eq(users.id, query.state));
      return status(204);
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
      detail: getCallbackDetail,
    },
  );
