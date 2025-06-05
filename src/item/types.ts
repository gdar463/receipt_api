import { t } from "elysia";
import { Components } from "./components";

export const ItemBody = t.Object({
  name: t.String(),
  components: Components,
});
export const PartialItemBody = t.Partial(ItemBody);

export type StaticItemBody = typeof ItemBody.static;
export type StaticPartialItemBody = typeof PartialItemBody.static;
