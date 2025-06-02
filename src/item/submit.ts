import { t, type StatusFunc } from "elysia";
import { ScanComponent } from "./components/scan";
import { CountryComponent } from "./components/country";

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
  return "magical logic";
}
