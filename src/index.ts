import { authRouter } from "@/auth";
import { itemRouter } from "@/item";
import { test } from "./test";
import Elysia from "elysia";
import { googleRouter } from "./google";
import { authenticate } from "./auth/jwt";
import { JWENotFoundError } from "./google/errors";
import {
  ComponentNotFoundError,
  NameAlreadyExistsError,
  PatchBodyInvalidError,
  PatchBodyNotFoundError,
  ReceiptNotFoundError,
} from "./item/errors";

const port = process.env.PORT || 3000;

const app = new Elysia()
  .error({
    PatchBodyNotFoundError,
    PatchBodyInvalidError,
    ComponentNotFoundError,
    JWENotFoundError,
    ReceiptNotFoundError,
    NameAlreadyExistsError,
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "NOT_FOUND":
        set.status = 404;
        return { error: "Not Found" };
      case "JWENotFoundError":
        set.status = 401;
        return { error: "Google not connected to account" };
      case "ReceiptNotFoundError":
        set.status = 404;
        return { error: "Receipt Not Found" };
      case "NameAlreadyExistsError":
        set.status = 409;
        return { error: "Name already exists" };
      case "PatchBodyNotFoundError":
        set.status = 409;
        return { error: "Missing body" };
      case "PatchBodyInvalidError":
        set.status = 400;
        return { error: "Invalid body for requested comp" };
      case "ComponentNotFoundError":
        set.status = 400;
        return { error: "Invalid Component" };
    }
    throw error;
  })
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
