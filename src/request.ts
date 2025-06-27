import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { logger } from "./logger";

export const requestDecor = new Elysia({ name: "requestDecor" }).derive(
  { as: "global" },
  () => {
    return {
      request_id: nanoid(),
      request_time: performance.now(),
    };
  }
);

export const requestLogger = (router = "") =>
  new Elysia({ name: `requestLogger-${router}` })
    .use(requestDecor)
    .decorate("logger", logger)
    .onTransform(
      { as: "scoped" },
      ({ request_id, request: { method }, route, set: { headers } }) => {
        logger.info("received_request", {
          path: route,
          method,
          request_id,
          router,
          ip:
            headers["x-forwarded-for"] ||
            headers["x-real-ip"] ||
            headers["x-client-ip"] ||
            null,
        });
      }
    )
    .onError(
      { as: "scoped" },
      ({ code, set, route, request: { method }, request_id, request_time }) => {
        if (code === "VALIDATION") {
          logger.error("errored_request", {
            path: route,
            method,
            request_id: request_id || null,
            status: set.status,
            router,
            error_id: code,
            timing:
              request_time != undefined
                ? performance.now() - request_time
                : null,
            ip:
              set.headers["x-forwarded-for"] ||
              set.headers["x-real-ip"] ||
              set.headers["x-client-ip"] ||
              null,
          });
          set.status = 400;
          return { error: "Invalid request" };
        }
      }
    )
    .onAfterResponse(
      { as: "scoped" },
      ({
        request_id,
        request_time,
        request: { method },
        route,
        set: { headers, status },
      }) => {
        if (
          status &&
          !status.toString().startsWith("4") &&
          !status.toString().startsWith("5")
        ) {
          logger.info("handled_request", {
            path: route,
            method,
            request_id,
            status,
            router,
            timing: performance.now() - request_time,
            ip:
              headers["x-forwarded-for"] ||
              headers["x-real-ip"] ||
              headers["x-client-ip"] ||
              null,
          });
        }
      }
    );
