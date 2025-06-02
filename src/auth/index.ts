import Elysia, { t } from "elysia";
import { signup } from "./signup";
import { login } from "./login";
import { authenticate, createSession } from "./jwt";

export const authRouter = new Elysia({ prefix: "/auth" })
  .onError(({ code, error, set }) => {
    if (code === "VALIDATION") {
      set.status = 400;
      return { error: error.message };
    }
  })
  .guard(
    {
      async beforeHandle({ cookie: { session }, status }) {
        if (session.value != null) {
          const auth = await authenticate(session.value);
          if (auth != false) {
            session.set({
              value: await createSession(auth.payload.id),
              path: "/",
            });
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
          async ({ body, cookie: { session }, status }) =>
            await signup(body, session, status),
        )
        .post(
          "/login",
          async ({ body, cookie: { session }, status }) =>
            await login(body, session, status),
        ),
  );
