import Elysia from "elysia";
import { submit } from "./submit";
import { decodeJwt } from "jose";

export const itemRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { id: decodeJwt(session.value!).id } as { id: string };
  })
  .post("/submit", async ({ status, id }) => await submit(status, id));
