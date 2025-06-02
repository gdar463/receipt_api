import { t, type StatusFunc } from "elysia";
import { ScanComponent } from "./components/scan";
import { CountryComponent } from "./components/country";
import { createFile } from "@/google/drive";
import { v4 } from "uuid";
import db from "@/db";
import { receipts } from "@/db/schema";

export const ItemBody = t.Object({
  name: t.String(),
  components: t.Array(t.Union([ScanComponent, CountryComponent])),
});

type StaticItemBody = typeof ItemBody.static;

export async function submit(
  status: StatusFunc,
  userId: string,
  body: StaticItemBody,
) {
  const id = v4();
  const driveId = await createFile(
    {
      mime: "application/json",
      name: `${id}.json`,
      body: JSON.stringify(body),
    },
    userId,
  );
  await db.insert(receipts).values({
    id,
    name: body.name,
    driveId: driveId!,
    userId,
  });
  return status(200);
}
