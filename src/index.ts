import { authRouter } from "@/auth";
import { receiptRouter } from "@/receipt";
import { test } from "./test";
import Elysia from "elysia";
import { googleRouter } from "./google";
import { authenticate } from "./auth/jwt";
import { logger } from "./logger";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .onError(({ code, set, path, request: { method } }) => {
    switch (code) {
      case "NOT_FOUND":
        logger.error("errored_request", {
          path,
          method,
          status: 404,
          ip:
            set.headers["x-forwarded-for"] ||
            set.headers["x-real-ip"] ||
            set.headers["x-client-ip"] ||
            null,
        });
        set.status = 404;
        return { error: "Not Found" };
    }
  })
  .get("/test", async () => await test())
  .use(authRouter)
  // protected section
  .guard(
    {
      async beforeHandle({
        logger,
        request_id,
        request_time,
        route,
        request: { method },
        set: { headers },
        cookie: { session },
        status,
      }) {
        if (session.value == null) {
          logger.warn("authentication_failed", {
            path: route,
            method,
            request_id,
            status: 401,
            error_id: "NotLoggedIn",
            timing: performance.now() - request_time,
            ip:
              headers["x-forwarded-for"] ||
              headers["x-real-ip"] ||
              headers["x-client-ip"] ||
              null,
          });
          return status(401, { error: "Not Logged In" });
        }
        const auth = await authenticate(session.value);
        if (auth === false) {
          logger.warn("authentication_failed", {
            path: route,
            method,
            request_id,
            status: 403,
            error_id: "InvalidToken",
            timing: performance.now() - request_time,
            ip:
              headers["x-forwarded-for"] ||
              headers["x-real-ip"] ||
              headers["x-client-ip"] ||
              null,
          });
          return status(403, { error: "Invalid Token" });
        }
      },
    },
    (app) => app.use(receiptRouter).use(googleRouter)
  )
  // end protected section
  .listen(port);

if ((await app.handle(new Request(`http://localhost:${port}/test`))).ok) {
  console.log(`running on localhost:${port}`);
} else {
  console.error(`failed starting on port ${port}`);
  process.exit(1);
}
