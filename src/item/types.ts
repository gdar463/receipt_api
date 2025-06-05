import { t } from "elysia";
import { ScanComponent } from "./components/scan";
import { CountryComponent } from "./components/country";

export const ItemBody = t.Object({
  name: t.String(),
  components: t.Array(t.Union([ScanComponent, CountryComponent])),
});
export const PartialItemBody = t.Partial(ItemBody);

export type StaticItemBody = typeof ItemBody.static;
export type StaticPartialItemBody = typeof PartialItemBody.static;
