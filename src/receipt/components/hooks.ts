import bearer from "@elysiajs/bearer";
import Elysia from "elysia";
import { decodeJwt } from "jose";

import { requestLogger } from "@/request";
import { promoteHooks } from "@/util";

import {
  ComponentNotFoundError,
  CountryNotFoundError,
  GoogleError,
} from "./errors";

const componentsHooks = new Elysia({ name: "componentsHooks" })
  .use(bearer())
  .error({
    ComponentNotFoundError,
    CountryNotFoundError,
    GoogleError,
  })
  .use(requestLogger("components"))
  .resolve({ as: "scoped" }, ({ bearer }) => {
    return { userId: decodeJwt(bearer!).id as string };
  })
  .onError(
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
        case "VALIDATION":
          logger.error("errored_request", {
            ...commonLog,
            router: "components",
            error_id: "VALIDATION",
          });
          if (process.env.NODE_ENV === "development") return error.message;
          set.status = 400;
          return { error: "Invalid request" };
        case "ComponentNotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            router: "components",
            error_id: "JWENotFoundError",
          });
          set.status = 404;
          return { error: "Component Not Found" };
        case "CountryNotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            router: "components/country",
            error_id: "CountryNotFoundError",
          });
          set.status = 400;
          return { error: "Invalid country" };
        case "GoogleError":
          logger.error("errored_request", {
            ...commonLog,
            router: "components/google",
            error_id: "GoogleError",
          });
          set.status = 500;
          return { error: "Google Failed" };
        default:
          logger.error("errored_request", {
            ...commonLog,
            router: "components",
            error_id: code,
          });
          return { error: error };
      }
    },
  );

promoteHooks(componentsHooks.event);
export { componentsHooks };
