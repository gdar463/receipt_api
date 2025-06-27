import Elysia from "elysia";
import { ComponentNotFoundError } from "./errors";
import { requestLogger } from "@/request";
import { decodeJwt } from "jose";

export const componentsHooks = new Elysia({ name: "componentsHooks" })
  .error({
    ComponentNotFoundError,
  })
  .use(requestLogger("components"))
  .resolve({ as: "scoped" }, ({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id as string };
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
        case "ComponentNotFoundError":
          logger.error("errored_request", {
            ...commonLog,
            router: "components",
            error_id: "JWENotFoundError",
          });
          set.status = 404;
          return { error: "Google not connected to acoount" };
        default:
          logger.error("errored_request", {
            ...commonLog,
            router: "components",
            error_id: code,
          });
          return { error: error };
      }
    }
  );
