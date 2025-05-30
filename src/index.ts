import { authRouter } from "@/auth";
import { itemRouter } from "@/item";
import { test } from "./test";
import Elysia from "elysia";
import { googleRouter } from "./google";
import { authenticate } from "./auth/jwt";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .get("/test", async () => await test())
  .use(authRouter)
  // protected section
  .guard(
    {
      async beforeHandle({ cookie: { session }, status }) {
        if (session.value == null) {
          return status(401, { error: "Not Logged In" });
        }
        const auth = await authenticate(session.value);
        if (auth === false) {
          return status(403, { error: "Invalid Token" });
        }
      },
    },
    (app) => app.use(itemRouter).use(googleRouter),
  )
  // end protected section
  .listen(port);

if ((await app.handle(new Request(`http://localhost:${port}/test`))).ok) {
  console.log(`running on localhost:${port}`);
} else {
  console.error(`failed starting on port ${port}`);
  process.exit(1);
}
