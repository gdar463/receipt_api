import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";

import { requestLogger } from "@/request";

import { authenticate, createSession } from "./jwt";
import { login } from "./login";
import { signup } from "./signup";

export const authRouter = new Elysia({ prefix: "/auth" })
  .use(bearer())
  .use(requestLogger("auth"))
  .guard(
    {
      async beforeHandle({ bearer, set: { headers }, status }) {
        if (bearer != null) {
          const auth = await authenticate(bearer);
          if (auth != false) {
            headers.authorization = `Bearer ${await createSession(auth.payload.id)}`;
            return status(200);
          }
        }
      },
      body: t.Object({
        username: t.String({ error: "Missing username" }),
        password: t.String({ error: "Missing password" }),
      }),
    },
    (app) =>
      app
        .post(
          "/signup",
          async ({ body, set: { headers }, status }) =>
            await signup(body, headers, status),
        )
        .post(
          "/login",
          async ({ body, set: { headers }, status }) =>
            await login(body, headers, status),
        ),
  );
