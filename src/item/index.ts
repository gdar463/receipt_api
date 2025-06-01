import Elysia from "elysia";
import { submit } from "./submit";
import { decodeJwt } from "jose";

export const itemRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id } as { userId: string };
  })
  .post("/submit", async ({ status, userId }) => await submit(status, userId));
