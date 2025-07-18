import { type JWTVerifyResult, SignJWT, jwtVerify } from "jose";
import {
  JWSInvalid,
  JWSSignatureVerificationFailed,
  JWTClaimValidationFailed,
  JWTExpired,
  JWTInvalid,
} from "jose/errors";

import { now } from "@/util";

const alg = "HS256";
const key = new TextEncoder().encode(process.env.JWT_SECRET);

type IdPayload = {
  payload: {
    id: string;
  };
};

// insecure
export async function authenticate(jwt: string) {
  try {
    return (await jwtVerify(jwt, key)) as JWTVerifyResult & IdPayload;
  } catch (e) {
    if (
      e instanceof JWSSignatureVerificationFailed ||
      e instanceof JWTInvalid ||
      e instanceof JWSInvalid ||
      e instanceof JWTClaimValidationFailed ||
      e instanceof JWTExpired
    ) {
      return false;
    }
    throw e;
  }
}

// trusted
export async function createSession(id: string) {
  return await new SignJWT({ id })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setNotBefore(now())
    .setIssuer("com.gdar463.receipts")
    .setExpirationTime("7d")
    .sign(key);
}
