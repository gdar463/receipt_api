import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { decodeJwt } from "jose";

import { requestLogger } from "@/request";
import { promoteHooks } from "@/util";

import {
  FailedDeletionError,
  JWENotFoundError,
  NameAlreadyExistsError,
  ReceiptNotFoundError,
} from "./errors";

const receiptHooks = new Elysia({ name: "receiptHooks" })
  .use(bearer())
  .error({
    JWENotFoundError,
    ReceiptNotFoundError,
    NameAlreadyExistsError,
    FailedDeletionError,
  })
  .use(requestLogger("receipt"))
  .resolve({ as: "scoped" }, ({ bearer }) => {
    return { userId: decodeJwt(bearer!).id as string };
  })
  .onError(
    { as: "scoped" },
    ({
      logger,
      code,
      error,
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
        case "VALIDATION":
          logger.error("errored_request", {
            ...commonLog,
            status: 400,
            router: "receipt",
            error_id: "VALIDATION",
          });
          set.status = 400;
          return { error: "Invalid request", code: "ValidationFailed" };
        case "JWENotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            status: 401,
            router: "google",
            error_id: "JWENotFoundError",
          });
          set.status = 401;
          return {
            error: "Google not connected to account",
            code: "NoGoogleLinked",
          };
        case "ReceiptNotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            status: 404,
            router: "receipt",
            error_id: "ReceiptNotFoundError",
          });
          set.status = 404;
          return { error: "Receipt Not Found", code: "ReceiptNotFound" };
        case "NameAlreadyExistsError":
          logger.error("errored_request", {
            ...commonLog,
            status: 409,
            router: "receipt",
            error_id: "NameAlreadyExistsError",
          });
          set.status = 409;
          return { error: "Name already exists", code: "NameAlreadyExists" };
        case "FailedDeletionError":
          logger.error("errored_request", {
            ...commonLog,
            status: 409,
            router: "receipt",
            error_id: "FailedDeletionError",
          });
          set.status = 409;
          return {
            error: "Failed to delete. Receipt has components",
            code: "FailedDeletion",
          };
        default:
          logger.error("errored_request", {
            ...commonLog,
            status: set.status,
            router: "receipt",
            error_id: code,
          });
          return { error: error, code };
      }
    },
  );
promoteHooks(receiptHooks.event);
export { receiptHooks };
