import Elysia, { t } from "elysia";
import { ScanComponent } from "./scan";
import { CountryComponent } from "./country";
import { decodeJwt } from "jose";
import { edit } from "./routes/edit";

export const SingleComponent = t.Union([ScanComponent, CountryComponent]);
export type StaticSingleComponent = typeof SingleComponent.static;

export const Components = t.Array(SingleComponent);
export type StaticComponents = typeof Components.static;

export type CompTypes = StaticSingleComponent["type"] | "name";

export const componentRouter = new Elysia()
  .resolve(({ cookie: { session } }) => {
    return { userId: decodeJwt(session.value!).id } as { userId: string };
  })
  .patch(
    "/:id/edit/:comp",
    async ({ userId, params: { id, comp }, body }) =>
      edit(userId, id, comp, body),
    {
      params: t.Object({
        id: t.String(),
        comp: t.Any(),
      }),
      body: t.Union([
        SingleComponent,
        t.Object({
          name: t.String(),
        }),
      ]),
    },
  );
// .patch(
//   "/:id/edit/name",
//   async ({ userId, params: { id }, body }) => editName(userId, id, body),
//   {
//     params: t.Object({
//       id: t.String(),
//     }),
//     body: t.Object({
//       name: t.String(),
//     }),
//   },
// );
