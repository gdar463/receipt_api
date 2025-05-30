import db from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import Elysia, { t } from "elysia";
import { google } from "googleapis";
import { decodeJwt } from "jose";
import { encryptInfo } from "./token";

const authClient = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI,
);

const scopes = ["openid", "https://www.googleapis.com/auth/drive.appdata"];

export const googleRouter = new Elysia({ prefix: "/google" })
  .get("/auth-url", () => {
    return {
      url: authClient.generateAuthUrl({
        access_type: "offline",
        scope: scopes,
      }),
    };
  })
  .resolve(({ cookie: { session } }) => {
    return { id: decodeJwt(session.value!).id } as { id: string };
  })
  .get(
    "/callback",
    async ({ query, id, status }) => {
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
        .where(eq(users.id, id));
      return status(200);
    },
    {
      query: t.Object({
        code: t.String(),
      }),
    },
  );
