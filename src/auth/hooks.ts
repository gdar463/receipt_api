import bearer from "@elysiajs/bearer";
import { Elysia } from "elysia";

import { requestLogger } from "@/request";
import { promoteHooks } from "@/util";

import {
  InvalidCredsError,
  InvalidTokenError,
  UserAlreadyExistsError,
} from "./errors";

const authHooks = new Elysia({ name: "authHooks" })
  .use(bearer())
  .error({
    InvalidCredsError,
    InvalidTokenError,
    UserAlreadyExistsError,
  })
  .use(requestLogger("auth"))
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
          logger.warn("errored_request", {
            ...commonLog,
            status: 400,
            router: "auth",
            error_id: "VALIDATION",
          });
          set.status = 400;
          return { error: "Invalid request", code: "ValidationFailed" };
        case "InvalidCredsError":
          logger.warn("errored_request", {
            ...commonLog,
            status: 401,
            router: "auth",
            error_id: "InvalidCredsError",
          });
          set.status = 401;
          return { error: "Invalid credentials", code: "InvalidCreds" };
        case "InvalidTokenError":
          logger.warn("errored_request", {
            ...commonLog,
            status: 401,
            router: "auth",
            error_id: "InvalidTokenError",
          });
          set.status = 401;
          return { error: "Invalid token", code: "InvalidToken" };
        case "UserAlreadyExistsError":
          logger.warn("errored_request", {
            ...commonLog,
            status: 409,
            router: "auth",
            error_id: "UserAlreadyExistsError",
          });
          set.status = 409;
          return {
            error: "User already exists",
            code: "UserAlreadyExists",
          };
        default:
          logger.error("errored_request", {
            ...commonLog,
            status: set.status,
            router: "auth",
            error_id: code,
          });
          return { error: error, code };
      }
    },
  );
promoteHooks(authHooks.event);
export { authHooks };
