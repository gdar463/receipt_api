import { type JWTVerifyResult, SignJWT, jwtVerify } from "jose";
import {
  JWSInvalid,
  JWSSignatureVerificationFailed,
  JWTExpired,
} from "jose/errors";

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
      JWSInvalid ||
      JWTExpired
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
    .setIssuer("com.gdar463.receipts")
    .setExpirationTime("7d")
    .sign(key);
}
