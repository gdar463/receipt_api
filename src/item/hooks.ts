import { Elysia } from "elysia";
import { decodeJwt } from "jose";
import { requestLogger } from "@/request";
import {
  JWENotFoundError,
  NameAlreadyExistsError,
  PatchBodyNotFoundError,
  ReceiptNotFoundError,
} from "./errors";

export const itemHooks = new Elysia({ name: "itemHooks" })
  .error({
    JWENotFoundError,
    PatchBodyNotFoundError,
    ReceiptNotFoundError,
    NameAlreadyExistsError,
  })
  .use(requestLogger("item"))
  .resolve({ as: "scoped" }, ({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
  })
  .onError(
    ({
      logger,
      code,
      set,
      request_id,
      request: { method },
      route,
      request_time,
      userId,
    }) => {
      const commonLog = {
        path: route,
        method,
        request_id: request_id || null,
        status: set.status,
        user_id:
          userId != undefined
            ? new Bun.CryptoHasher("sha256", process.env.USER_ID_HASH_KEY)
                .update(userId)
                .digest("hex")
                .slice(0, 32)
            : null,
        timing:
          request_time != undefined ? performance.now() - request_time : null,
        ip:
          set.headers["x-forwarded-for"] ||
          set.headers["x-real-ip"] ||
          set.headers["x-client-ip"] ||
          null,
      };

      switch (code) {
        case "JWENotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            router: "google",
            error_id: "JWENotFoundError",
          });
          set.status = 400;
          return { error: "Google not connected to acoount" };
        case "ReceiptNotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            router: "item",
            error_id: "ReceiptNotFoundError",
          });
          set.status = 404;
          return { error: "Receipt Not Found" };
        case "NameAlreadyExistsError":
          logger.error("errored_request", {
            ...commonLog,
            router: "item",
            error_id: "NameAlreadyExistsError",
          });
          set.status = 409;
          return { error: "Name already exists" };
        case "PatchBodyNotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            router: "item",
            error_id: "PatchBodyNotFoundError",
          });
          set.status = 409;
          return { error: "Missing body" };
      }
    }
  );
