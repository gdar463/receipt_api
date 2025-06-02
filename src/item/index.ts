import Elysia from "elysia";
import { ItemBody, submit } from "./submit";
import { decodeJwt } from "jose";

export const itemRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id } as { userId: string };
  })
  .onError(({ code, error, set }) => {
    switch (code) {
      case "VALIDATION":
        if (error.type === "body") {
          set.status = 400;
          return { error: "Invalid Body" };
        }
    }
  })
  .post(
    "/submit",
    async ({ status, userId, body }) => await submit(status, userId, body),
    {
      body: ItemBody,
    },
  );
