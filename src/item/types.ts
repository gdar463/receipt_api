import { t } from "elysia";
import type { ComponentType, ReceiptComponent } from "./components/types";
import { allComponents } from "./components/validation";

export type Receipt = {
  name: string;
  components: ReceiptComponent[];
};

export type ComponentMap = Partial<Record<ComponentType, ReceiptComponent>>;

export type ReceiptDB = Receipt & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export const receiptSchema = t.Object({
  name: t.String(),
  components: t.Array(allComponents),
});

export const componentMap = t.Record(t.String(), allComponents);

export const receiptDBSchema = t.Composite([
  receiptSchema,
  t.Object({
    id: t.String(),
    createdAt: t.Number(),
    updatedAt: t.Number(),
  }),
]);
