import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";
import { decodeJwt } from "jose";

import { GoogleError } from "@/receipt/components/errors";
import { requestLogger } from "@/request";
import { promoteHooks } from "@/util";

const googleHooks = new Elysia({ name: "googleHooks" })
  .use(bearer())
  .error({
    GoogleError,
  })
  .use(requestLogger("google"))
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
            router: "google",
            error_id: "VALIDATION",
          });
          set.status = 400;
          return { error: "Invalid request", code: "ValidationFailed" };
        case "GoogleError":
          logger.error("errored_request", {
            ...commonLog,
            status: 500,
            router: "google",
            error_id: "GoogleError",
          });
          set.status = 500;
          return { error: "Google Failed", code: "GoogleError" };
        default:
          logger.error("errored_request", {
            ...commonLog,
            status: set.status,
            router: "google",
            error_id: code,
          });
          return { error: error, code };
      }
    },
  );
promoteHooks(googleHooks.event);

const globalGoogleHooks = new Elysia({ name: "globalGoogleHooks" })
  .use(bearer())
  .error({
    GoogleError,
  })
  .use(requestLogger("google"))
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
    }) => {
      const commonLog = {
        path: route,
        method,
        request_id: request_id || null,
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
            router: "google",
            error_id: "VALIDATION",
          });
          set.status = 400;
          return { error: "Invalid request", code: "ValidationFailed" };
        case "GoogleError":
          logger.error("errored_request", {
            ...commonLog,
            status: 500,
            router: "google",
            error_id: "GoogleError",
          });
          set.status = 500;
          return { error: "Google Failed", code: "GoogleError" };
        default:
          logger.error("errored_request", {
            ...commonLog,
            status: set.status,
            router: "google",
            error_id: code,
          });
          return { error: error, code };
      }
    },
  );
promoteHooks(globalGoogleHooks.event);

export { googleHooks, globalGoogleHooks };
