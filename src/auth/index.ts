import bearer from "@elysiajs/bearer";
import Elysia, { t } from "elysia";

import { requestLogger } from "@/request";

import { postLoginDetail, postSignupDetail } from "./docs";
import { authenticate, createSession } from "./jwt";
import { login } from "./login";
import { signup } from "./signup";

export const authRouter = new Elysia({
  prefix: "/auth",
  tags: ["Auth"],
})
  .use(bearer())
  .use(requestLogger("auth"))
  .guard(
    {
      async beforeHandle({ bearer, status }) {
        if (bearer != null) {
          const auth = await authenticate(bearer);
          if (auth != false) {
            return status(200, { token: await createSession(auth.payload.id) });
          }
        }
      },
    },
    (app) =>
      app
        .post("/login", async ({ body, status }) => await login(body, status), {
          body: t.Object({
            username: t.String({
              description: "Username of an already existing user.",
            }),
            password: t.String({
              description: "Password of an already existing user.",
            }),
          }),
          detail: postLoginDetail,
        })
        .post(
          "/signup",
          async ({ body, status }) => await signup(body, status),
          {
            body: t.Object({
              username: t.String({ description: "Username for the new user." }),
              password: t.String({ description: "Password for the new user." }),
            }),
            detail: postSignupDetail,
          },
        ),
  );
