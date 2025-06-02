import db from "@/db";
import { users } from "@/db/schema";
import { createSecretKey } from "crypto";
import { eq } from "drizzle-orm";
import { google } from "googleapis";
import { compactDecrypt, CompactEncrypt } from "jose";
import { JWENotFoundError } from "./errors";

export type GoogleInfo = {
  accessToken: string;
  refreshToken: string;
  expires: Date;
};

const secretKey = createSecretKey(
  Buffer.from(process.env.GOOGLE_JWE_SECRET!, "base64"),
);

export async function encryptInfo(info: GoogleInfo) {
  const jwe = await new CompactEncrypt(
    new TextEncoder().encode(JSON.stringify(info)),
  )
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .encrypt(secretKey);
  return jwe;
}

export async function decryptInfo(jwe: string) {
  const { plaintext } = await compactDecrypt(jwe, secretKey);
  const info = new TextDecoder().decode(plaintext);
  return JSON.parse(info, (key, value) => {
    if (key === "expires") {
      return new Date(value);
    }
    return value;
  }) as GoogleInfo;
}

export async function getAuthClient(userId: string) {
  const authClient = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI,
  );
  const jwe = await db
    .select({ googleInfo: users.googleInfo })
    .from(users)
    .where(eq(users.id, userId));
  if (jwe.length == 0 || jwe[0].googleInfo == null) {
    throw new JWENotFoundError();
  }
  const tokens = await decryptInfo(jwe[0].googleInfo!);
  authClient.setCredentials({
    access_token: tokens.accessToken,
    refresh_token: tokens.refreshToken,
    expiry_date: tokens.expires.getTime(),
  });
  return authClient;
}
