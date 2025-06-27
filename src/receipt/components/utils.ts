import type { ComponentType, ReceiptComponent } from "./types";

export function createComponentMap(
  components: ReceiptComponent[]
): Partial<Record<ComponentType, ReceiptComponent>> {
  return Object.fromEntries(components.map((c) => [c.type, c]));
}
