import Elysia, { t } from "elysia";

import { postLoginDetail, postRefreshDetail, postSignupDetail } from "./docs";
import { InvalidTokenError } from "./errors";
import { authHooks } from "./hooks";
import { authenticate, createSession } from "./jwt";
import { login } from "./routes/login";
import { signup } from "./routes/signup";
import { signupBodyValidation } from "./types";

export const authRouter = new Elysia({
  prefix: "/auth",
  tags: ["Auth"],
})
  .use(authHooks)
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
            body: signupBodyValidation,
            detail: postSignupDetail,
          },
        )
        .post(
          "/refresh",
          () => {
            throw new InvalidTokenError();
          },
          {
            detail: postRefreshDetail,
          },
        ),
  );
