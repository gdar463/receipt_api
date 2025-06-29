import bearer from "@elysiajs/bearer";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { google } from "googleapis";
import { decodeJwt } from "jose";

import db from "@/db";
import { users } from "@/db/schema";
import { requestLogger } from "@/request";

import { encryptInfo } from "./token";

const authClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const scopes = ["openid", "https://www.googleapis.com/auth/drive.appdata"];

export const googleRouter = new Elysia({ prefix: "/google" })
  .use(bearer())
  .use(requestLogger("google"))
  .resolve({ as: "scoped" }, ({ bearer }) => {
    return { userId: decodeJwt(bearer!).id as string };
  })
  .get("/auth-url", ({ userId }) => {
    return {
      url: authClient.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
        include_granted_scopes: true,
        prompt: "consent",
        state: userId,
      }),
    };
  })
  .get(
    "/callback",
    async ({ query, status }) => {
      const { tokens } = await authClient.getToken(query.code);
      if (!tokens.access_token) {
        return status(500, { error: "Google Failed" });
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
      return status(200);
    },
    {
      query: t.Object({
        code: t.String(),
        state: t.String(),
      }),
    },
  );
