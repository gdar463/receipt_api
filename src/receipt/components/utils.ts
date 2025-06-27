import type { ComponentType, ReceiptComponent } from "./types";

export function createComponentMap(
  components: ReceiptComponent[]
): Partial<Record<ComponentType, ReceiptComponent & { index: number }>> {
  return Object.fromEntries(
    components.map((c, i) => [c.type, { ...c, index: i }])
  );
}
